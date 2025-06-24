import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' } })
export class TextModel {
  @Prop() headline?: string;
  @Prop() text?: string;
}

export const TextSchema = SchemaFactory.createForClass(TextModel);
