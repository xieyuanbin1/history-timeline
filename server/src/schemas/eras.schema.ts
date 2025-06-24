import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DateModel } from './date.schema';
import { TextModel } from './text.schema';

@Schema({ timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' } })
export class ErasModel {
  @Prop({ type: DateModel, required: true }) start_date: DateModel;
  @Prop({ type: DateModel }) end_date?: DateModel;
  @Prop({ type: TextModel }) text?: TextModel;
}

export const ErasSchema = SchemaFactory.createForClass(ErasModel);
