// 参考官方文档:
// https://timeline.knightlab.com/docs/json-format.html

declare namespace TL {
  interface Color {
    r: number;
    g: number;
    b: number;
  }

  interface Options {
    font?: string; // 字体
    debug?: boolean; // 开启 debug 模式，如果开启控制台会有大量日志输出
    height?: number; // 时间线的高度
    width?: number; // 时间线的高度
    is_embed?: boolean;
    hash_bookmark?: boolean;
    default_bg_color?: string | Color;
    scale_factor?: number;
    initial_zoom?: number;
    zoom_sequence?: number[];
    timenav_position?: 'top' | 'bottom';
    optimal_tick_width?: number;
    base_class?: string;
    timenav_height?: number;
    timenav_height_percentage?: number;
    timenav_mobile_height_percentage?: number;
    timenav_height_min?: number;
    marker_height_min?: number;
    marker_width_min?: number;
    marker_padding?: number;
    start_at_slide?: number;
    start_at_end?: boolean;
    menubar_height?: number;
    use_bc?: boolean;
    duration?: number;
    ease?: any;
    dragging?: boolean;
    trackResize?: boolean;
    slide_padding_lr?: number;
    slide_default_fade?: string;
    language?: string;
    ga_measurement_id?: string;
    ga_property_id?: string;
    track_events?: string[];
    script_path?: string;
    soundcite?: boolean;
  }

  interface Date {
    year: number; // 整数 不要有小数点 公元前用负数
    month?: number; // 1-12
    day?: number;
    hour?: number; // 0-23
    minute?: number; // 0-59
    second?: number;
    millisecond?: number;
    display_date?: string;
    format?: string;
  }

  interface Text {
    headline?: string;
    text?: string;
  }

  interface Media {
    url: string;
    caption?: string;
    credit?: string;
    thumbnail?: string;
    alt?: string;
    title?: string;
    link?: string;
    link_target?: string;
  }

  interface Background {
    url?: string;
    alt?: string;
    color?: number; // 以十六进制表示的 CSS 颜色（如 #0f9bd1）或有效的 CSS 颜色关键字
  }

  interface Slide {
    start_date: Date;
    end_date?: Date;
    text?: Text;
    media?: Media;
    group?: string;
    display_date?: string;
    background?: Background;
    autolink?: boolean;
    unique_id?: string;
  }

  interface Era {
    start_date: Date;
    end_date: Date;
    text?: Text;
  }

  interface Data {
    title?: Slide;
    eras?: Era;
    scale?: 'human' | 'cosmological';
    events: Slide[];
  }

  class Timeline {
    constructor(dom: string, data: Data, options?: Options);
  }
}
