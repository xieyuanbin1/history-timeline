import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' } })
export class MediaModel {
  @Prop({ required: true }) url: string;
  @Prop() caption?: string;
  @Prop() credit?: string;
  @Prop() thumbnail?: string;
  @Prop() alt?: string;
  @Prop() title?: string;
  @Prop() link?: string;
  @Prop() link_target?: string;
}

export const MediaSchema = SchemaFactory.createForClass(MediaModel);
