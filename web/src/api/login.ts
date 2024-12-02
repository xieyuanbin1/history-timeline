import {request} from "./index.ts";

interface LoginDTO {
  name: string;
  passwd: string;
}

export const loginApi = (body: LoginDTO) => {
  return request.post<string>('/user/login', body);
}
