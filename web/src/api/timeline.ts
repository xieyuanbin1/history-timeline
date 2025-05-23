import {request} from "./index.ts";
import {RAddSlide, SlideResponse, TimelineAddTitle} from "../types/timeline.rest.ts";

// 获取 时间线列表
// 这个接口返回的是顶层的时间线 对应 timeline 中的数据 作为下拉列表
export const timelineListApi = () => {
  return request.post<{id: string, name: string }[]>('/timeline/title');
}

// 点击 时间线分类 获取时间线数据
// 包括 title、events
export const timelineTitleDetailApi = (id: string) => {
  return request.post<SlideResponse>('/timeline/title/detail', { id });
}

export const timelineAddTitleApi = (title: TimelineAddTitle) => {
  return request.post('/timeline/add/title', title);
}

export const timelineDeleteApi = (id: string) => {
  return request.post(`/timeline/delete`, { id });
}

export const slideAddApi = (body: RAddSlide) => {
  return request.post(`/timeline/add/slide`, body);
}

// 更新时间线 name
export const timelineUpdateApi = (id: string, name: string) => {
  return request.post<SlideResponse>('/timeline/update/title', { id, name });
}

// 删除 slide
export const slideDeleteApi = (id: string) => {
  return request.post(`/timeline/delete/slide`, { id });
}
