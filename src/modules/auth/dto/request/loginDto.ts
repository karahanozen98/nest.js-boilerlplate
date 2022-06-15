import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsPassword } from 'decorators';

export class LoginDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsPassword()
  password: string;
}
