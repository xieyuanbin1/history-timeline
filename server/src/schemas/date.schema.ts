import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' } })
export class DateModel {
  @Prop({ required: true }) year: number;
  @Prop() month?: number;
  @Prop() day?: number;
  @Prop() hour?: number;
  @Prop() minute?: number;
  @Prop() second?: number;
  @Prop() millisecond?: number;
  @Prop() display_date?: string;
  @Prop() format?: string;
}

export const DateSchema = SchemaFactory.createForClass(DateModel);
