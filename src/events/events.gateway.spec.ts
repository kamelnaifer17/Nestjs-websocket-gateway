import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { Socket, io } from "socket.io-client";
import { EvetnsGateway } from "./events.gateway";

async function createNestApp(...gateways: any): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    providers: gateways,
  }).compile();
  return testingModule.createNestApplication();
}

describe("EventsGateway", () => {
  let gateway: EvetnsGateway;
  let app: INestApplication;
  let ioClient: Socket;

  beforeAll(async () => {
    app = await createNestApp(EvetnsGateway);
    gateway = app.get<EvetnsGateway>(EvetnsGateway);
    ioClient = io("http://localhost:3000", {
      autoConnect: false,
      transports: ["websocket", "polling"],
    });

    app.listen(3000);
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be defined", () => {
    expect(gateway).toBeDefined();
  });

  it('should emit "events2" on "events"', async () => {
    ioClient.connect();
    ioClient.emit("events", "Hello world!");
    await new Promise<void>((resolve) => {
      ioClient.on("connect", () => {
        console.log("connected");
      });
      ioClient.on("events2", (data) => {
        expect(data).toBe("Hello world!");
        resolve();
      });
    });
    ioClient.disconnect();
  });
});
