import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { IsPassword, IsUndefinable } from 'decorators/';

class Planet {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;
}

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

  @ApiProperty({ type: [Planet] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Planet)
  planets: [Planet];
}
