import { App } from "./app.controller";
import { Module } from "./decorators";
import {TimelineController} from "./modules/timeline/timeline.controller";

@Module({
  controllers: [
    App,
    TimelineController,
  ]
})
export class AppModule {}
