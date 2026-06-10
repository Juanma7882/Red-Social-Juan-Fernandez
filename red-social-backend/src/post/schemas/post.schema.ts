import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({
  timestamps: true,
})
export class Post {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  usuarioId!: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
  })
  titulo!: string;

  @Prop({
    required: true,
    trim: true,
  })
  mensaje!: string;

  @Prop({
    default: '',
  })
  imagen!: string;

  @Prop({
    type: [Types.ObjectId],
    ref: 'User',
    default: [],
  })
  likes!: Types.ObjectId[];

  @Prop({
    type: [Types.ObjectId],
    ref: 'User',
    default: [],
  })
  guardadosPor!: Types.ObjectId[];

  @Prop({
    default: 0,
  })
  compartidosCount!: number;

  @Prop({
    default: false,
  })
  eliminado!: boolean;
}
export const PostSchema = SchemaFactory.createForClass(Post);
