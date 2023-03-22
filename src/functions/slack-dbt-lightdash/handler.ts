import { APIGatewayEvent, Context } from "aws-lambda";
import { defaultLogger } from "@beautypie/logger";

const logger = defaultLogger

// const DBT_ENDPOINT = "https://api.example.com/data";
// const SNOWFLAKE_ENDPOINT = "https://api.example.com/data";

// interface Metrics {
//   name: string;
//   dimensions: string;
//   description: string;
//   time_grains: string;
//   label: string;
// }

// interface DBTResponse {
//   compiled_code: string;
//   metrics: Metrics;
// }

export const handler = async (
  event: APIGatewayEvent,
  context: Context
) => {
  const queryString = event.body
  logger.info({bpData: context, msg:`Recieved event with body '${queryString}' and with context '${JSON.stringify(context)}'`})

  return {
    statusCode: 200,
    body: "Hello world"
  };

  // try {
  //   const response = await fetch(apiUrl);
  //   const data: DBTResponse = await response.json();

  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify(data)
  //   };
  // } catch (error) {
  //   logger.error(error);

  //   return {
  //     statusCode: 500,
  //     body: JSON.stringify({ message: "Error querying DBT", error: error })
  //   };
  // }
};
