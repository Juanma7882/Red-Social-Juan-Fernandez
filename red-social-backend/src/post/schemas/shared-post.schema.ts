import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SharedPostDocument = HydratedDocument<SharedPost>;

@Schema({
  timestamps: true,
})
export class SharedPost {
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
  emisorId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  receptorId!: Types.ObjectId;
}

export const SharedPostSchema = SchemaFactory.createForClass(SharedPost);
