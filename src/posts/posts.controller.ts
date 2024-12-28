import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { PostsService } from './posts.service';
import { CreatePostsDto } from './dto/posts.dto';
import { JwtGuard } from 'src/auth/guard';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}
  @Get()
  getPosts() {
    return this.postsService.getPosts();
  }

  @Get(':id')
  getpostById(@Param('id', ParseIntPipe) postId: number) {
    return this.postsService.getPostById(postId);
  }

  @UseGuards(JwtGuard)
  @Post()
  createPost(@GetUser('id') userId: number, @Body() dto: CreatePostsDto) {
    return this.postsService.createBlogPost(userId, dto);
  }
}
