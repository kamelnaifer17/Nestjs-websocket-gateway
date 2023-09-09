import { Module } from "@nestjs/common";
import { EvetnsGateway } from "./events.gateway";

@Module({
    imports: [],
    controllers: [],
    providers: [EvetnsGateway],
  })
  
  export class EventsModule {}
