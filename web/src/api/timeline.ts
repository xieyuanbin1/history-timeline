import {request} from "./index.ts";

export const timelineListApi = () => {
  return request.post<string>('/timeline');
}
