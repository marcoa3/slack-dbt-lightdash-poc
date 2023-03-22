// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");
const snowflake = require("snowflake-sdk");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Create a Snowflake connection object
const connection = snowflake.createConnection({
  account: process.env.SNOWFLAKE_ACCOUNT,
  role: process.env.SNOWFLAKE_ROLE,
  password: process.env.SNOWFLAKE_PASSWORD,
  username: process.env.SNOWFLAKE_USER,
  warehouse: process.env.SNOWFLAKE_WAREHOUSE,
});

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
      await connection.connect(function (err, conn) {
        if (err) {
          console.error("Unable to connect: " + err.message);
        } else {
          console.log("Successfully connected to Snowflake.");

          const query = `SELECT ANALYTICS_STAGING.DBT_NATURAL_LANGUAGE.metric_sql_to_metric_object(
        ANALYTICS_STAGING.DBT_NATURAL_LANGUAGE.TEXT_TO_SQL(
          ${text},
           ANALYTICS_STAGING.DBT_NATURAL_LANGUAGE.dbt_metrics()
        )
      );`;
          console.log(query);

          connection.execute({
            sqlText: query,
            complete: function (err, stmt, rows) {
              if (err) {
                console.error("Unable to execute query: " + err.message);
              } else {
                console.log("Query executed successfully.");
                response = rows;
                console.log(rows);
                client.chat.postMessage({
                  channel: event.item.channel,
                  text: response[0][Object.keys(response[0])],
                });
              }
              connection.destroy(function (err, conn) {
                if (err) {
                  console.error("Unable to disconnect: " + err.message);
                } else {
                  console.log("Disconnected from Snowflake.");
                }
              });
            },
          });
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
});
