import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({
  timestamps: true,
})
export class Comment {
  @Prop({
    type: Types.ObjectId,
    ref: 'Post',
    required: true,
  })
  postId!: Types.ObjectId;

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
  mensaje!: string;

  @Prop({
    default: false,
  })
  modificado!: boolean;

  @Prop({
    default: false,
  })
  eliminado!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
