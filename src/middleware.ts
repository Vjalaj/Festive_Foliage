import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Session-Id, X-Forwarded-For, X-Real-IP',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Get response and add CORS headers
  const response = NextResponse.next();
  
  // Allow all origins (needed for ngrok and similar tunnels)
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Session-Id, X-Forwarded-For, X-Real-IP');
  
  return response;
}

// Only run middleware on API routes
export const config = {
  matcher: '/api/:path*',
};
