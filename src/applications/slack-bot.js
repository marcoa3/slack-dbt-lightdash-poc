// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");
const snowflake = require("snowflake-sdk");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const connectionPool = snowflake.createPool(
  // connection options
  {
    account: process.env.SNOWFLAKE_ACCOUNT,
    role: process.env.SNOWFLAKE_ROLE,
    password: process.env.SNOWFLAKE_PASSWORD,
    username: process.env.SNOWFLAKE_USER,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
  },
  // pool options
  {
    max: 10, // specifies the maximum number of connections in the pool
    min: 1, // specifies the minimum number of connections in the pool
  }
);

function metric_to_lightdash(metric_json) {
    console.log(metric_json)
  const table_name = metric_json.table_name
  const BASE_URL = `https://beautypie.lightdash.cloud/projects/e9292f3b-639d-49b8-80cd-5fb3ab3bec32/tables/${table_name}?`;
  const dimensions = metric_json.dimensions.map((d) => `${table_name}_${d}`);
  const metrics = [`${table_name}_${metric_json.name}`];
  const url_params = {
    tableName: table_name,
    metricQuery: {
      dimensions,
      metrics,
      sorts: [],
      limit: 500,
      tableCalculations: [],
      filters: {},
      additionalMetrics: []
    },
    tableConfig: { columnOrder: [...dimensions, ...metrics] },
    chartConfig: {
      type: 'cartesian',
      config: {
        layout: {
          xField: dimensions[0],
          yField: metrics
        },
        eChartsConfig: {
          series: [{
            encode: {
              xRef: { field: dimensions[0] },
              yRef: { field: metrics[0] }
            },
            type: 'bar'
          }]
        }
      }
    }
  };
  return `${BASE_URL}create_saved_chart_version=${JSON.stringify(url_params).replace(/\s/g, '')}`;
}

// All the room in the world for your code

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();

app.event("app_home_opened", async ({ event, client, context }) => {
  console.log("HEYYY");
  try {
    /* view.publish is the method that your app uses to push a view to the Home tab */
  } catch (error) {
    console.error(error);
  }
});

app.event("reaction_added", async ({ event, client, context }) => {
  try {
    if (event.reaction === "robot_face") {
      console.log("Processing", event.reaction);
      await client.chat.postMessage({
        channel: event.item.channel,
        text: "thinking......",
      });
      const message = await client.conversations.history({
        channel: event.item.channel,
        latest: event.item.ts,
        inclusive: true,
        limit: 1,
      });

      const text = `$$${message.messages[0].text}$$`;
      // Execute the query and store the results in a variable
      var response;
      await connectionPool.use(async (clientConnection) => {
        console.log("Successfully connected to Snowflake.");

        const query = `SELECT ANALYTICS_STAGING.DBT_NATURAL_LANGUAGE.metric_sql_to_metric_object(
  ANALYTICS_STAGING.DBT_NATURAL_LANGUAGE.TEXT_TO_SQL(
    ${text},
     ANALYTICS_STAGING.DBT_NATURAL_LANGUAGE.dbt_metrics()
  ),
  ANALYTICS_STAGING.DBT_NATURAL_LANGUAGE.dbt_metrics()
);`;
        console.log(query);

        clientConnection.execute({
          sqlText: query,
          complete: function (err, stmt, rows) {
            if (err) {
              console.error("Unable to execute query: " + err.message);
            } else {
              console.log("Query executed successfully.");
              response = rows;
              const ldUrl = metric_to_lightdash(response[0][Object.keys(response[0])])
              console.log(rows);
              console.log(response[0][Object.keys(response[0])])
              console.log(ldUrl)
              client.chat.postMessage({
                channel: event.item.channel,
                text: ldUrl,
              });
            }
            // connection.destroy(function (err, conn) {
            //   if (err) {
            //     console.error("Unable to disconnect: " + err.message);
            //   } else {
            //     console.log("Disconnected from Snowflake.");
            //   }
            // });
          },
        });
      });
    }
  } catch (error) {
    console.error(error);
  }
});
