import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { CurrentUser } from './current-user.decorator';

@Resolver()
export class AuthResolver {
  @Query(() => String)
  @UseGuards(GqlAuthGuard)
  getProfile(@CurrentUser() user: any) {
    return `Hello User ${user.email} (ID: ${user.id})`;
  }
}
