import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCommentsDto {
  @IsNotEmpty()
  @ApiProperty()
  content: string;
}
