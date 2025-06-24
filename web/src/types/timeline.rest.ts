export class RDate {
  year!: number;
  month?: number;
  day?: number;
}

export class RText {
  headline?: string;
  text?: string;
}

export class RMedia {
  url!: string;
  thumbnail?: string;
  title?: string;
}

export class RBackground {
  url?: string;
  alt?: string;
  color?: number;
}

export class TimelineAddTitle {
  name!: string;
}

export class RSlide {
  id?: string;
  pid?: number;
  text!: RText;
  start_date!: RDate;
  end_date?: RDate;
  background?: RBackground;
  media?: RMedia;
}

export class SlideResponse {
  title?: RSlide;
  events!: RSlide[];
}

export class RAddSlide {
  id!: string;
  type!: string;
  text!: RText;
  start_date!: RDate;
  end_date?: RDate;
  group?: string;
  background?: RBackground;
  media?: RMedia;
}
