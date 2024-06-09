import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RevokeUserRequestDto {
  @ApiProperty({
    required: true,
    example: 'some-objectID',
  })
  @IsNotEmpty()
  @IsString()
  id: string;
}
