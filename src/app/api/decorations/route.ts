import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Only import blob when needed (prevents errors when not configured)
let blobPut: typeof import('@vercel/blob').put | null = null;
if (process.env.BLOB_READ_WRITE_TOKEN) {
  import('@vercel/blob').then(m => { blobPut = m.put; }).catch(() => {});
}

const DATA_PATH = path.join(process.cwd(), 'data', 'decorations.json');
const BLOB_FILENAME = 'decorations.json';

// Simple mutex lock to prevent concurrent file writes causing corruption
let writeLock: Promise<void> = Promise.resolve();

async function withLock<T>(fn: () => Promise<T>): Promise<T> {
  // Chain onto the existing lock
  const currentLock = writeLock;
  let release: () => void;
  writeLock = new Promise<void>((resolve) => { release = resolve; });
  
  await currentLock; // Wait for previous operations to complete
  try {
    return await fn();
  } finally {
    release!();
  }
}

async function readData() {
  try {
    // If running on Vercel with Blob storage configured
    if (process.env.BLOB_READ_WRITE_TOKEN && process.env.VERCEL_BLOB_STORE_URL) {
      try {
        const blobUrl = `${process.env.VERCEL_BLOB_STORE_URL}/${BLOB_FILENAME}`;
        const res = await fetch(blobUrl, {
          headers: {
            Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
          },
          cache: 'no-store',
        });
        if (res.ok) {
          const json = await res.json();
          return json || [];
        }
      } catch (e) {
        console.log('Blob read failed, falling back to local:', e);
      }
    }

    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
      await fs.writeFile(DATA_PATH, '[]', 'utf-8');
      return [];
    }
    throw err;
  }
}

async function writeData(data: any) {
  const body = JSON.stringify(data, null, 2);
  
  // If running on Vercel with Blob storage configured
  if (process.env.BLOB_READ_WRITE_TOKEN && blobPut) {
    try {
      await blobPut(BLOB_FILENAME, body, {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
      });
      return;
    } catch (e) {
      console.log('Blob write failed, falling back to local:', e);
    }
  }

  // Local file write (for development)
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, body, 'utf-8');
}

export async function GET() {
  const decorations = await readData();
  return NextResponse.json(decorations);
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, percentX, percentY, x, y } = body;
  if (!id) return new NextResponse(JSON.stringify({ error: 'Missing id' }), { status: 400 });

  return await withLock(async () => {
    const decorations = await readData();
    const idx = decorations.findIndex((d: any) => d.id === id);
    if (idx === -1) return new NextResponse(JSON.stringify({ error: 'Not found' }), { status: 404 });

    const target = decorations[idx];

    // Anyone can move decorations (position updates only)
    // apply updates
    if (typeof percentX === 'number' && typeof percentY === 'number') {
      target.percentX = percentX;
      target.percentY = percentY;
      // also store x/y if provided
      if (typeof x === 'number') target.x = x;
      if (typeof y === 'number') target.y = y;
    } else if (typeof x === 'number' && typeof y === 'number') {
      target.x = x;
      target.y = y;
    }

    decorations[idx] = target;
    await writeData(decorations);
    return NextResponse.json(target);
  });
}

export async function POST(req: Request) {
  // Allow public additions (any visitor can add). Persist serializable fields only.
  const body = await req.json();

  // derive client ip and session from headers
  const ip = (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown');
  const session = req.headers.get('x-session-id') || null;

  // check blocks
  try {
    const blocksRaw = await fs.readFile(path.join(process.cwd(), 'data', 'blocks.json'), 'utf-8');
    const blocks = JSON.parse(blocksRaw || '[]');
    const blocked = blocks.find((b: any) => {
      const ipMatch = b.ip && b.ip === ip;
      const sessionMatch = b.session && session && b.session === session;
      if (!ipMatch && !sessionMatch) return false;
      // if block specifies types, only block matching types
      if (b.types && Array.isArray(b.types) && b.types.length > 0) {
        return b.types.includes(body.type);
      }
      return true;
    });
    if (blocked) {
      return new NextResponse(JSON.stringify({ error: 'Blocked' }), { status: 403 });
    }
  } catch (e) {
    // ignore — no blocks file
  }

  return await withLock(async () => {
    const decorations = await readData();
    const id = `${body.type || 'item'}-${Date.now()}`;
    const newDecoration: any = {
      id,
      type: body.type,
      name: body.name,
      scale: body.scale,
      rotation: body.rotation,
      data: body.data || {},
      ip,
      session,
    };

    // accept percent positions (preferred) or absolute x/y - store both
    if (typeof body.percentX === 'number' && typeof body.percentY === 'number') {
      newDecoration.percentX = body.percentX;
      newDecoration.percentY = body.percentY;
    }
    if (typeof body.x === 'number' && typeof body.y === 'number') {
      newDecoration.x = body.x;
      newDecoration.y = body.y;
    }

    decorations.push(newDecoration);
    await writeData(decorations);
    return NextResponse.json(newDecoration);
  });
}

function unauthorized() {
  return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
}

export async function DELETE(req: Request) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Basic ')) return unauthorized();

  const creds = Buffer.from(auth.split(' ')[1], 'base64').toString('utf-8');
  const [user, pass] = creds.split(':');

  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASS = process.env.ADMIN_PASS;

  if (!ADMIN_USER || !ADMIN_PASS) {
    return new NextResponse(JSON.stringify({ error: 'Server not configured' }), { status: 500 });
  }

  if (user !== ADMIN_USER || pass !== ADMIN_PASS) return unauthorized();

  const body = await req.json();
  const { id } = body;
  if (!id) return new NextResponse(JSON.stringify({ error: 'Missing id' }), { status: 400 });

  return await withLock(async () => {
    const decorations = await readData();
    const filtered = decorations.filter((d: any) => d.id !== id);
    await writeData(filtered);
    return NextResponse.json({ success: true, decorations: filtered });
  });
}
