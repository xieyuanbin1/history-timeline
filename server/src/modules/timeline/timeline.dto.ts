import { Type } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

export class TimelineAddDTO {
  @IsString() name: string;
  @IsNumber() @IsOptional() weight?: number;
}

export class SDate {
  @IsNumber() year: number;
  @IsNumber() @IsOptional() month?: number;
  @IsNumber() @IsOptional() day?: number;
  @IsNumber() @IsOptional() hour?: number;
  @IsNumber() @IsOptional() minute?: number;
  @IsNumber() @IsOptional() second?: number;
  @IsNumber() @IsOptional() millisecond?: number;
  @IsString() @IsOptional() display_date?: number;
  @IsString() @IsOptional() format?: number;
}

export class SText {
  @IsString() @IsOptional() headline?: string;
  @IsString() @IsOptional() text?: string;
}

export class SMedia {
  @IsString() url: string;
  @IsString() @IsOptional() caption?: string;
  @IsString() @IsOptional() credit?: string;
  @IsString() @IsOptional() thumbnail?: string;
  @IsString() @IsOptional() alt?: string;
  @IsString() @IsOptional() title?: string;
  @IsString() @IsOptional() link?: string;
  @IsString() @IsOptional() link_target?: string;
}

export class SBackground {
  @IsString() @IsOptional() url?: string;
  @IsString() @IsOptional() alt?: string;
  @IsNumber() @IsOptional() color?: number;
}

export class SlideAddDTO {
  @IsObject() @ValidateNested() @Type(() => SDate) start_date: SDate;
  @IsObject()
  @ValidateNested()
  @Type(() => SDate)
  @IsOptional()
  end_date?: SDate;
  @IsObject() @ValidateNested() @Type(() => SText) @IsOptional() text?: SText;
  @IsObject()
  @ValidateNested()
  @Type(() => SMedia)
  @IsOptional()
  media?: SMedia;
  @IsString() @IsOptional() group?: string;
  @IsString() @IsOptional() display_date?: string;
  @IsObject()
  @ValidateNested()
  @Type(() => SBackground)
  @IsOptional()
  background?: SBackground;
  @IsString() @IsOptional() autolink?: string;
  @IsString() @IsOptional() unique_id?: string;
}
