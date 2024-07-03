import { IsOptional, IsString } from 'class-validator';

export class TextToaudioDto {
  @IsString()
  readonly prompt: string;
  @IsString()
  @IsOptional()
  readonly voice?: string;
}
