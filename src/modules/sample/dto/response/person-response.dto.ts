import { ApiProperty } from '@nestjs/swagger';

export class PersonResponseDto {
  @ApiProperty({ default: 1 })
  id: string;

  @ApiProperty({ default: 'Luke' })
  name: string;

  @ApiProperty({ default: 180 })
  heigth: number;

  @ApiProperty({ default: 80 })
  mass: number;

  constructor({ id, name, height, mass }) {
    this.id = id;
    this.name = name;
    this.heigth = height;
    this.mass = mass;
  }
}
