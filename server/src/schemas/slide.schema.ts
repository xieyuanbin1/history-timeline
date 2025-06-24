import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DateModel } from './date.schema';
import { TextModel } from './text.schema';
import { MediaModel } from './media.schema';
import { BackgroundModel } from './background.schema';

@Schema({ timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' } })
export class SlideModel {
  @Prop({ type: DateModel, required: true }) start_date: DateModel;
  @Prop({ type: DateModel }) end_date?: DateModel;
  @Prop({ type: TextModel }) text?: TextModel;
  @Prop({ type: MediaModel }) media?: MediaModel;
  @Prop() group?: string;
  @Prop() display_date?: string;
  @Prop({ type: BackgroundModel }) background?: BackgroundModel;
  @Prop() autolink?: string;
  @Prop() unique_id?: string;
}

export const SlideSchema = SchemaFactory.createForClass(SlideModel);
