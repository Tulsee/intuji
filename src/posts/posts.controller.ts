import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorator';
import { diskStorage } from 'multer';
import { PostsService } from './posts.service';
import { JwtGuard } from 'src/auth/guard';
import { CreateCommentsDto, CreatePostsDto, EditPostDto, UploadImageDto } from './dto';
import { extname } from 'path';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('posts')
@ApiBearerAuth()
export class PostsController {
  constructor(private postsService: PostsService) {}
  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  getPosts() {
    return this.postsService.getPosts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by id' })
  getPostById(@Param('id', ParseIntPipe) postId: number) {
    return this.postsService.getPostById(postId);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.User, Role.SuperAdmin)
  @Post()
  @ApiOperation({ summary: 'Create a post' })
  createPost(@GetUser('id') userId: number, @Body() dto: CreatePostsDto) {
    return this.postsService.createBlogPost(userId, dto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.User, Role.SuperAdmin)
  @Post(':postId/comments')
  @ApiOperation({ summary: 'Create a comment for a post' })
  createComment(
    @GetUser('id') userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: CreateCommentsDto,
  ) {
    return this.postsService.createComment(postId, userId, dto.content);
  }

  @Get(':postId/comments')
  @ApiOperation({ summary: 'Get post comments' })
  getComments(@Param('postId', ParseIntPipe) postId: number) {
    return this.postsService.getComments(postId);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.User, Role.SuperAdmin)
  @Post(':postId/image')
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

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.User, Role.SuperAdmin)
  @Delete(':postId/image')
  @ApiOperation({ summary: 'Delete post image' })
  async deleteImage(@Param('postId', ParseIntPipe) postId: number) {
    return this.postsService.deleteImage(postId);
  }

  @UseGuards(JwtGuard)
  @Patch(':postId')
  @ApiOperation({ summary: 'Update a post' })
  updatePost(
    @GetUser('id') userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: EditPostDto,
  ) {
    return this.postsService.updatePost(postId, userId, dto);
  }
}
