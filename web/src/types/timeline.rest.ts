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
  start_date!: RDate;
  end_date?: RDate;
  text?: RText;
  media?: RMedia;
  background?: RBackground;
}
