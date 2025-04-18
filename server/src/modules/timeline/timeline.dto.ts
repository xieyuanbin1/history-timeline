import {JSONSchemaType} from "ajv";
import {SlideFrom} from "../../entity/Slide.entity";

export class IDate {
  year!: number;
  month?: number;
  day?: number;
}

export class IText {
  headline?: string;
  text?: string;
}

export class IMedia {
  url!: string;
  thumbnail?: string;
  title?: string;
}

export class IBackground {
  url?: string;
  alt?: string;
  color?: number;
}

export class TimelineAddTitleDTO {
  name!: string;
}

export class TimelineUpdateTitleDTO {
  id!: string;
  name!: string;
}

export const TimelineAddTitleSchema: JSONSchemaType<TimelineAddTitleDTO> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
  },
  required: ['name'],
}

export const TimelineUpdateTitleSchema: JSONSchemaType<TimelineUpdateTitleDTO> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
  },
  required: ['id', 'name'],
}

export class TimelineAddEventDTO {
  id!: string;
  type!: SlideFrom;
  start_date!: IDate;
  end_date?: IDate;
  text?: IText;
  media?: IMedia;
  group?: string;
  background?: IBackground;
}

export class TimelineUpdateEventDTO {
  id!: string;
  start_date?: IDate;
  end_date?: IDate;
  text?: IText;
  media?: IMedia;
  group?: string;
  background?: IBackground;
}

export const TimelineAddEventSchema: JSONSchemaType<TimelineAddEventDTO> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    type: { type: 'string' },
    start_date: {
      type: 'object',
      properties: {
        year: { type: 'number' },
        month: { type: 'number', nullable: true },
        day: { type: 'number', nullable: true },
      },
      required: ['year'],
    },
    end_date: {
      type: 'object',
      nullable: true,
      properties: {
        year: { type: 'number' },
        month: { type: 'number', nullable: true },
        day: { type: 'number', nullable: true },
      },
      required: ['year'],
    },
    text: {
      type: 'object',
      nullable: true,
      properties: {
        headline: { type: 'string', nullable: true },
        text: { type: 'string', nullable: true },
      },
    },
    media: {
      type: 'object',
      nullable: true,
      properties: {
        url: { type: 'string' },
        thumbnail: { type: 'string', nullable: true },
        title: { type: 'string', nullable: true },
      },
      required: ['url'],
    },
    group: { type: 'string', nullable: true },
    background: {
      type: 'object',
      nullable: true,
      properties: {
        url: { type: 'string', nullable: true },
        alt: { type: 'string', nullable: true },
        color: { type: 'number', nullable: true },
      },
    },
  },
  required: ['id', 'type', 'start_date'],
}

export const TimelineUpdateEventSchema: JSONSchemaType<TimelineUpdateEventDTO> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    start_date: {
      type: 'object',
      nullable: true,
      properties: {
        year: { type: 'number' },
        month: { type: 'number', nullable: true },
        day: { type: 'number', nullable: true },
      },
      required: ['year'],
    },
    end_date: {
      type: 'object',
      nullable: true,
      properties: {
        year: { type: 'number' },
        month: { type: 'number', nullable: true },
        day: { type: 'number', nullable: true },
      },
      required: ['year'],
    },
    text: {
      type: 'object',
      nullable: true,
      properties: {
        headline: { type: 'string', nullable: true },
        text: { type: 'string', nullable: true },
      },
    },
    media: {
      type: 'object',
      nullable: true,
      properties: {
        url: { type: 'string' },
        thumbnail: { type: 'string', nullable: true },
        title: { type: 'string', nullable: true },
      },
      required: ['url'],
    },
    group: { type: 'string', nullable: true },
    background: {
      type: 'object',
      nullable: true,
      properties: {
        url: { type: 'string', nullable: true },
        alt: { type: 'string', nullable: true },
        color: { type: 'number', nullable: true },
      },
    },
  },
  required: ['id'],
}

export class TimelineIdDTO {
  id!: string;
}
export const TimelineIdSchema: JSONSchemaType<TimelineIdDTO> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
  },
  required: ['id'],
}
