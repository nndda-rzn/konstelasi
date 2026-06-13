import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

interface CachedKeys {
  keys: any[];
  fetchedAt: number;
}

@Injectable()
export class JwtStrategy {
  private legacySecret: string | null;
  private supabaseUrl: string | null;
  private cachedKeys: CachedKeys | null = null;
  private keyCacheTTL = 60 * 60 * 1000; // 1 hour

  constructor() {
    this.legacySecret = process.env.SUPABASE_JWT_SECRET || null;
    this.supabaseUrl = process.env.SUPABASE_URL || null;

    console.log('[JwtStrategy] initialized:');
    console.log('  SUPABASE_URL:', this.supabaseUrl || 'not set');
    console.log('  Legacy secret:', this.legacySecret ? 'loaded' : 'not set');

    if (!this.supabaseUrl && !this.legacySecret) {
      throw new Error(
        'Configure at least one of:\n' +
          '  SUPABASE_URL (auto-fetch ES256 keys from /auth/v1/.well-known/jwks.json)\n' +
          '  SUPABASE_JWT_SECRET (legacy HS256 verification)\n' +
          'Set these in backend/.env',
      );
    }
  }

  /**
   * Fetch JWKS from Supabase and cache.
   * Endpoint: https://<project>.supabase.co/auth/v1/.well-known/jwks.json
   */
  private async getJwks(): Promise<any[]> {
    if (this.cachedKeys && Date.now() - this.cachedKeys.fetchedAt < this.keyCacheTTL) {
      return this.cachedKeys.keys;
    }

    if (!this.supabaseUrl) throw new Error('SUPABASE_URL not configured');

    const url = `${this.supabaseUrl}/auth/v1/.well-known/jwks.json`;
    console.log('[JwtStrategy] fetching JWKS from:', url);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.cachedKeys = { keys: data.keys || [], fetchedAt: Date.now() };
      console.log('[JwtStrategy] JWKS loaded, keys:', this.cachedKeys.keys.length);
      return this.cachedKeys.keys;
    } catch (err) {
      console.error('[JwtStrategy] Failed to fetch JWKS:', err.message);
      throw new Error('Failed to fetch JWKS from Supabase. Check SUPABASE_URL.');
    }
  }

  async verifyToken(token: string): Promise<Record<string, any>> {
    const { decodeProtectedHeader } = await import('jose');

    const header = decodeProtectedHeader(token);
    const alg = header.alg;
    const kid = header.kid as string | undefined;
    console.log('[JwtStrategy] token alg:', alg, '| kid:', kid);

    if (alg === 'ES256') {
      // Find matching key from JWKS
      const keys = await this.getJwks();
      const key = keys.find((k: any) => !kid || k.kid === kid);

      if (!key) {
        throw new UnauthorizedException(
          `No matching key found for kid "${kid}". ` +
            `Available keys: ${keys.map((k: any) => k.kid).join(', ')}`,
        );
      }

      const { jwtVerify, importJWK } = await import('jose');
      const cryptoKey = await importJWK(key, 'ES256');
      const { payload } = await jwtVerify(token, cryptoKey, {
        algorithms: ['ES256'],
      });

      console.log('[JwtStrategy] ES256 verified → sub:', payload.sub?.slice(0, 8));
      return payload as Record<string, any>;
    }

    if (alg === 'HS256' && this.legacySecret) {
      const { jwtVerify } = await import('jose');
      const key = new TextEncoder().encode(this.legacySecret);
      const { payload } = await jwtVerify(token, key, {
        algorithms: ['HS256'],
      });

      console.log('[JwtStrategy] HS256 verified → sub:', payload.sub?.slice(0, 8));
      return payload as Record<string, any>;
    }

    throw new UnauthorizedException(
      `Unsupported algorithm "${alg}". Set SUPABASE_URL for ES256 or SUPABASE_JWT_SECRET for HS256.`,
    );
  }
}
