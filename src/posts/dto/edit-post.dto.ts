import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EditPostDto {
  @IsOptional()
  @ApiProperty()
  @IsString()
  title?: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  content?: string;
}
