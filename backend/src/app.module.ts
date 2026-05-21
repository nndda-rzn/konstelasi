import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { join } from 'path';
import mikroOrmConfig from './mikro-orm.config';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { CanvasModule } from './canvas/canvas.module';
import { TagModule } from './tag/tag.module';
import { StreakModule } from './streak/streak.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      context: ({ req }) => ({ req }), // Ensure context has req for GqlAuthGuard
    }),
    AuthModule,
    NotesModule,
    CanvasModule,
    TagModule,
    StreakModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
