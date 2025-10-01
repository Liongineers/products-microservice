import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateAvailabilityDto {
  @ApiProperty({
    description: 'New availability count',
    example: 5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  availability: number;
}
