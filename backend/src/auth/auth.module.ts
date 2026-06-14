import { Module, Global } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { GqlAuthGuard } from './gql-auth.guard';
import { AuthResolver } from './auth.resolver';

@Global()
@Module({
  providers: [JwtStrategy, GqlAuthGuard, AuthResolver],
  exports: [JwtStrategy, GqlAuthGuard],
})
export class AuthModule {}
