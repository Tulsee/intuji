import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EditProfileDto {
  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email?: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  fullName?: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  username?: string;
}
