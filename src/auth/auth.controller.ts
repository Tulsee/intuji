import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto } from './dto';

@Controller('users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() authDto: AuthDto) {
    return this.authService.register(authDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
