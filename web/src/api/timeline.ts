import {request} from "./index.ts";
import {TimelineAddTitle} from "../types/timeline.rest.ts";

export const timelineListApi = () => {
  return request.post<{id: string, name: string }[]>('/timeline/title');
}

export const timelineTitleDetailApi = (id: string) => {
  return request.post('/timeline/title/detail', { id });
}

export const timelineAddTitleApi = (title: TimelineAddTitle) => {
  return request.post('/timeline/add/title', title);
}

export const timelineDeleteApi = (id: string) => {
  return request.post(`/timeline/delete`, { id });
}