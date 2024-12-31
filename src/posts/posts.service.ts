import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostsDto } from './dto/posts.dto';
import * as path from 'path';
import * as fs from 'fs';
import { EditPostDto } from './dto';

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

  async uploadImage(postId: number, url: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const image = await this.prisma.image.create({
      data: {
        url,
        postId,
      },
    });
    return image;
  }

  async deleteImage(postId: number) {
    const image = await this.prisma.image.findFirst({
      where: { postId },
    });

    if (!image) {
      throw new NotFoundException(`No image found for post with ID ${postId}`);
    }
    const filePath = path.join(
      process.cwd(),
      'uploads',
      image.url.split('/uploads/')[1],
    );
    fs.unlinkSync(filePath);

    await this.prisma.image.delete({
      where: { id: image.id },
    });

    return { message: 'Image deleted successfully' };
  }

  async updatePost(postId: number, userId: number, dto: EditPostDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    if (post.authorId !== userId) {
      throw new NotFoundException(`You are not authorized to update this post`);
    }

    const updatedPost = await this.prisma.post.update({
      where: { id: postId },
      data: {
        ...dto,
      },
    });
    return updatedPost;
  }
}
