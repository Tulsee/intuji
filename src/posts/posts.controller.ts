import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { PostsService } from './posts.service';
import { JwtGuard } from 'src/auth/guard';
import { CreateCommentsDto, CreatePostsDto } from './dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}
  @Get()
  getPosts() {
    return this.postsService.getPosts();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) postId: number) {
    console.log('world');
    return this.postsService.getPostById(postId);
  }

  @UseGuards(JwtGuard)
  @Post()
  createPost(@GetUser('id') userId: number, @Body() dto: CreatePostsDto) {
    return this.postsService.createBlogPost(userId, dto);
  }

  @UseGuards(JwtGuard)
  @Post(':postId/comments')
  createComment(
    @GetUser('id') userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: CreateCommentsDto,
  ) {
    return this.postsService.createComment(postId, userId, dto.content);
  }

  @Get(':postId/comments')
  getComments(@Param('postId', ParseIntPipe) postId: number) {
    return this.postsService.getComments(postId);
  }
}
