import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(authDto: AuthDto) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(authDto.password, salt);

    try {
      const user = await this.prisma.user.create({
        data: {
          username: authDto.username,
          password: hash,
          email: authDto.email,
          fullName: authDto.fullName,
        },
      });
      return this.signToken(user.id, user.username);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Username or email already exists');
        }
      }
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: loginDto.username,
      },
    });

    if (!user) {
      throw new ForbiddenException('Invalid username');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid password');
    }
    return this.signToken(user.id, user.username);
  }

  async signToken(
    userId: number,
    username: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      username,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: this.config.get<string>('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }
}
