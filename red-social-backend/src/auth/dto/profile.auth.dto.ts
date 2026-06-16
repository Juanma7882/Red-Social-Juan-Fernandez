import { IsString } from 'class-validator';
export class Profile {
  @IsString()
  imagenPerfil!: string;

  @IsString()
  nombre!: string;

  @IsString()
  username!: string;
}
