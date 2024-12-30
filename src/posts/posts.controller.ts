import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorator';
import { diskStorage, Multer } from 'multer';
import { PostsService } from './posts.service';
import { JwtGuard } from 'src/auth/guard';
import { CreateCommentsDto, CreatePostsDto, UploadImageDto } from './dto';
import { extname, join } from 'path';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';

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

  @UseGuards(JwtGuard)
  @Post(':postId/images')
  @ApiOperation({ summary: 'Upload an image for a post' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file',
    type: UploadImageDto,
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, image, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(image.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadImage(
    @Param('postId', ParseIntPipe) postId: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new Error('File is not uploaded');
    }
    const url = `/uploads/${image.filename}`;
    return this.postsService.uploadImage(postId, url);
  }
}
