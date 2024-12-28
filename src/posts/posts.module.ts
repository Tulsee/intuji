import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [PostsController],
  providers: [PostsService, JwtStrategy],
})
export class PostsModule {}
