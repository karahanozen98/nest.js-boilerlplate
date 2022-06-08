import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsPassword, IsUndefinable } from 'decorators/validator.decorator';

export class CreateSampleDto {
  @ApiProperty()
  @IsUndefinable()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsPassword()
  password: string;
}
