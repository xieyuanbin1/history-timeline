import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' } })
export class BackgroundModel {
  @Prop() url?: string;
  @Prop() alt?: string;
  @Prop() color?: number;
}

export const BackgroundSchema = SchemaFactory.createForClass(BackgroundModel);
