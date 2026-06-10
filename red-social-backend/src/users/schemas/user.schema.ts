import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  nombre!: string;

  @Prop({ required: true })
  apellido!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true, unique: true })
  username!: string;

  @Prop({ required: true })
  password!: string;

  @Prop()
  fechaNacimiento?: Date;

  @Prop()
  descripcion?: string;

  @Prop({ default: '' })
  imagenPerfil!: string;

  @Prop({ enum: ['usuario', 'administrador'], default: 'usuario' })
  perfil!: string;

  @Prop({ default: true })
  habilitado!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
