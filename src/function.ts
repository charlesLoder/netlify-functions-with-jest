import { Handler, HandlerEvent } from "@netlify/functions";
import fetch from "node-fetch";
import { config } from "dotenv";
config();

type WeatherAPIError = {
  error: {
    code: number;
    message: string;
  };
};

const getError = (error: unknown): { mssg: string } => {
  if ((error as WeatherAPIError).error) {
    return {
      mssg: (error as WeatherAPIError).error.message,
    };
  }

  if ((error as Error).message) {
    return {
      mssg: (error as Error).message,
    };
  }

  return {
    mssg: "An unknown error occurred",
  };
};

const getParameter = (event: HandlerEvent, parameter: string): string => {
  if (!event.queryStringParameters) {
    throw new Error("No parameters passed!");
  }

  if (!event.queryStringParameters[parameter]) {
    throw new Error(`No ${parameter} passed!`);
  }

  return event.queryStringParameters[parameter]!;
};

const handler: Handler = async (event: HandlerEvent, context) => {
  try {
    if (!event) throw new Error("No event!");
    const location = getParameter(event, "location");
    const date = event?.queryStringParameters?.date || new Date().toLocaleDateString("en-CA");
    const resp = await fetch(
      `http://api.weatherapi.com/v1/astronomy.json?key=${process.env.API_KEY}&q=${location}&dt=${date}`
    );

    if (!resp.ok) throw await resp.json();
    const data = await resp.json();

    return {
      statusCode: 200,
      headers: {
        "access-control-allow-origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    const e = getError(error);
    return {
      statusCode: 400,
      headers: {
        "access-control-allow-origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(e.mssg),
    };
  }
};

export { handler };
