import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Only import blob when needed
let blobPut: typeof import('@vercel/blob').put | null = null;
if (process.env.BLOB_READ_WRITE_TOKEN) {
  import('@vercel/blob').then(m => { blobPut = m.put; }).catch(() => {});
}

const BLOCKS_PATH = path.join(process.cwd(), 'data', 'blocks.json');
const BLOB_FILENAME = 'blocks.json';

async function readBlocks() {
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
        console.log('Blob read failed for blocks, falling back to local:', e);
      }
    }

    const raw = await fs.readFile(BLOCKS_PATH, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(path.dirname(BLOCKS_PATH), { recursive: true });
      await fs.writeFile(BLOCKS_PATH, '[]', 'utf-8');
      return [];
    }
    throw err;
  }
}

async function writeBlocks(data: any) {
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
      console.log('Blob write failed for blocks, falling back to local:', e);
    }
  }

  await fs.mkdir(path.dirname(BLOCKS_PATH), { recursive: true });
  await fs.writeFile(BLOCKS_PATH, body, 'utf-8');
}

function unauthorized() {
  return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
}

export async function GET() {
  const blocks = await readBlocks();
  return NextResponse.json(blocks);
}

export async function POST(req: Request) {
  // Admin-only: add block (by ip or session)
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Basic ')) return unauthorized();
  const creds = Buffer.from(auth.split(' ')[1], 'base64').toString('utf-8');
  const [user, pass] = creds.split(':');
  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASS = process.env.ADMIN_PASS;
  if (!ADMIN_USER || !ADMIN_PASS) return new NextResponse(JSON.stringify({ error: 'Server not configured' }), { status: 500 });
  if (user !== ADMIN_USER || pass !== ADMIN_PASS) return unauthorized();

  const body = await req.json();
  const { ip, session, reason, types } = body;
  if (!ip && !session) return new NextResponse(JSON.stringify({ error: 'Missing ip or session' }), { status: 400 });
  const blocks = await readBlocks();
  const entry = { id: `block-${Date.now()}`, ip: ip || null, session: session || null, reason: reason || null, types: types || null, blockedAt: new Date().toISOString() };
  blocks.push(entry);
  await writeBlocks(blocks);
  return NextResponse.json(entry);
}

export async function DELETE(req: Request) {
  // Admin-only: remove block by id
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Basic ')) return unauthorized();
  const creds = Buffer.from(auth.split(' ')[1], 'base64').toString('utf-8');
  const [user, pass] = creds.split(':');
  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASS = process.env.ADMIN_PASS;
  if (!ADMIN_USER || !ADMIN_PASS) return new NextResponse(JSON.stringify({ error: 'Server not configured' }), { status: 500 });
  if (user !== ADMIN_USER || pass !== ADMIN_PASS) return unauthorized();

  const body = await req.json();
  const { id } = body;
  if (!id) return new NextResponse(JSON.stringify({ error: 'Missing id' }), { status: 400 });
  const blocks = await readBlocks();
  const filtered = blocks.filter((b: any) => b.id !== id);
  await writeBlocks(filtered);
  return NextResponse.json({ success: true, blocks: filtered });
}
