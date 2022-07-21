import { ApiProperty } from '@nestjs/swagger';
import {
  ApiArrayProperty,
  ApiModelProperty,
  ApiNumberProperty,
  ApiStringProperty,
  IsPassword,
  IsUndefinable,
} from 'decorators/';

class Planet {
  @ApiNumberProperty()
  id: number;

  @ApiStringProperty()
  name: string;
}

export class CreateSampleDto {
  @ApiProperty()
  @IsUndefinable()
  id: string;

  @ApiStringProperty()
  name: string;

  @ApiStringProperty()
  description: string;

  @ApiProperty()
  @IsPassword()
  password: string;

  @ApiModelProperty({ type: Planet })
  mainPlanet: Planet;

  @ApiArrayProperty({ type: Planet })
  planets: Planet[];
}
