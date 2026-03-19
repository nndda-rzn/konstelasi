import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Login has been completely removed. Passthrough all.
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
