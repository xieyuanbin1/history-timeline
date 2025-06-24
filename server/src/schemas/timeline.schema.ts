import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SlideModel } from './slide.schema';
import { ErasModel } from './eras.schema';

@Schema({ timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' } })
export class TimelineModel {
  @Prop({ required: true }) name: string;
  @Prop({ default: 0 }) weight?: number;
  @Prop({ type: SlideModel }) title?: SlideModel;
  @Prop({ type: [SlideModel], required: true, default: [] })
  events: SlideModel[];
  @Prop({ type: [ErasModel] }) eras?: ErasModel[];
  @Prop({ type: String, enum: ['human', 'cosmological'], default: 'human' })
  scale?: string;
}

export const TimelineSchema = SchemaFactory.createForClass(TimelineModel);
