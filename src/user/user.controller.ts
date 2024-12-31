import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { EditProfileDto } from './dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@UseGuards(JwtGuard, RolesGuard)
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  getProfile(@GetUser() user: User) {
    return user;
  }

  @Patch('profile')
  @Roles(Role.SuperAdmin)
  editProfile(@GetUser('id') userId: number, @Body() dto: EditProfileDto) {
    return this.userService.editProfile(userId, dto);
  }
}
