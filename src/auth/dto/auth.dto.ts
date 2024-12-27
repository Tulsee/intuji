import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must include at least one uppercase letter, one lowercase letter, and either a number or a special character.',
  })
  @ApiProperty()
  password: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsOptional()
  @ApiProperty()
  fullName: string;
}

export class LoginDto {
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must include at least one uppercase letter, one lowercase letter, and either a number or a special character.',
  })
  @ApiProperty()
  password: string;
}
