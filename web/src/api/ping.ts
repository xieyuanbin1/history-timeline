import {request} from "./index.ts";

export const pingApi = () => {
  return request.post<string>('/app');
}