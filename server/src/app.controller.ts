import { Controller, Post } from "./decorators";

@Controller('app')
export class App {
  @Post()
  async ping() {
    return 'app-pong';
  }
}
