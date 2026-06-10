import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LoginHistoryDocument = HydratedDocument<LoginHistory>;

@Schema({
  timestamps: true,
})
export class LoginHistory {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  usuarioId!: Types.ObjectId;

  @Prop({
    default: Date.now,
  })
  fecha!: Date;
}

export const LoginHistorySchema = SchemaFactory.createForClass(LoginHistory);
