import { HandlerEvent } from "@netlify/functions";
import type { HandlerResponse } from "@netlify/functions";
import lambdaTester from "lambda-tester";
import type { Handler as AWSHandler } from "aws-lambda";
import { handler as myFunction } from "../src/function";
import { config } from "dotenv";
config();

class NetlifyEvent {
  event: HandlerEvent;
  constructor(event?: Partial<HandlerEvent>) {
    this.event = {
      rawUrl: event?.rawUrl || "",
      rawQuery: event?.rawQuery || "",
      path: event?.path || "",
      httpMethod: event?.httpMethod || "GET",
      headers: event?.headers || {},
      multiValueHeaders: event?.multiValueHeaders || {},
      queryStringParameters: event?.queryStringParameters || null,
      multiValueQueryStringParameters: event?.multiValueQueryStringParameters || null,
      body: event?.body || "",
      isBase64Encoded: event?.isBase64Encoded || false,
    };
  }
}

type AstronomyResp = {
  astronomy: {
    astro: {
      sunrise: string;
      sunset: string;
      moonrise: string;
      moonset: string;
      moon_phase: string;
      moon_illumination: string;
    };
  };
};

test("success", async () => {
  const netlifyEvent = new NetlifyEvent({ queryStringParameters: { location: "New York" } });
  await lambdaTester(myFunction as AWSHandler)
    .event(netlifyEvent.event)
    .expectResolve((res: HandlerResponse) => {
      expect(JSON.parse(res.body ?? "")).toEqual(
        expect.objectContaining<AstronomyResp>({
          astronomy: expect.objectContaining({
            astro: expect.objectContaining({
              sunrise: expect.any(String),
              sunset: expect.any(String),
              moonrise: expect.any(String),
              moonset: expect.any(String),
              moon_phase: expect.any(String),
              moon_illumination: expect.any(String),
            }),
          }),
        })
      );
    });
});

test("error: no params", async () => {
  const netlifyEvent = new NetlifyEvent();
  await lambdaTester(myFunction as AWSHandler)
    .event(netlifyEvent.event)
    .expectResolve((res: HandlerResponse) => {
      expect(JSON.parse(res.body ?? "")).toEqual("No parameters passed!");
    });
});

test("error: no location", async () => {
  const netlifyEvent = new NetlifyEvent({ queryStringParameters: { location: "" } });
  await lambdaTester(myFunction as AWSHandler)
    .event(netlifyEvent.event)
    .expectResolve((res: HandlerResponse) => {
      expect(JSON.parse(res.body ?? "")).toEqual("No location passed!");
    });
});

test("error: wrong api key", async () => {
  process.env.API_KEY = "123456";
  const netlifyEvent = new NetlifyEvent({ queryStringParameters: { location: "New York" } });
  await lambdaTester(myFunction as AWSHandler)
    .event(netlifyEvent.event)
    .expectResolve((res: HandlerResponse) => {
      expect(JSON.parse(res.body ?? "")).toEqual("API key is invalid.");
    });
});
