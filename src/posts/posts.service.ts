import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostsDto } from './dto/posts.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createBlogPost(userId: number, dto: CreatePostsDto) {
    const post = await this.prisma.post.create({
      data: {
        authorId: userId,
        ...dto,
      },
    });
    return post;
  }

  async getPostById(postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      //   throw new NotFoundException(`Post with ID ${postId} not found`);
      return {};
    }

    return post;
  }

  getPosts() {
    return this.prisma.post.findMany();
  }

  async createComment(postId: number, userId: number, content: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    const comment = await this.prisma.comment.create({
      data: {
        content,
        postId,
        userId,
      },
    });

    return comment;
  }

  async getComments(postId: number) {
    const comments = await this.prisma.comment.findMany({
      where: {
        postId,
      },
    });

    return comments;
  }
}
