import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtStrategy } from './jwt.strategy';

@Injectable()
export class GqlAuthGuard {
  constructor(private readonly jwtStrategy: JwtStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    const authHeader = req.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[GqlAuthGuard] REJECTED: no Authorization header');
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.slice(7);
    if (!token) {
      console.log('[GqlAuthGuard] REJECTED: empty token');
      throw new UnauthorizedException('Empty token');
    }

    try {
      console.log('[GqlAuthGuard] verifying token, length:', token.length);
      const payload = await this.jwtStrategy.verifyToken(token);
      req.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      console.log('[GqlAuthGuard] ACCESS GRANTED for user:', payload.sub?.slice(0, 8) + '...');
      return true;
    } catch (err) {
      console.log('[GqlAuthGuard] REJECTED:', err.message);
      throw new UnauthorizedException(err.message);
    }
  }
}
