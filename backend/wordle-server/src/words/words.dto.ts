import { IsNotEmpty } from 'class-validator';

export class CreateWordDto {
  @IsNotEmpty()
  word: string;

  frequency?: number;

  alreadyUsedAsWordle?: boolean;
}
