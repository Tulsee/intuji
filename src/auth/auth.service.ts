import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  register(authDto: AuthDto) {
    return { msg: authDto };
  }
  login() {
    return { msg: 'I am a login method' };
  }
}
