// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// export default (req, res) => {
//   res.status(200).json({ name: 'John Doe' })
// }

const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Set static path
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());

const publicVapidKey =
  "BB-z-ha3r_ZYVyY2U-bJCCITqhbZ8_uhKXnURkbT4Q8vh1sU6d87EkKsB2o1wEaf8f_bQLyymNbPqZQAgh83TP8";
const privateVapidKey = "NEks_D14Hzcd6RxgwSR3tBzHXpR1UO5_t5ioqXYUz1Y";

webpush.setVapidDetails(
  "mailto:test@test.com",
  publicVapidKey,
  privateVapidKey
);

// Subscribe Route
export default (req, res) => {
  // Get pushSubscription object
  const subscription = req.body;

  // Send 201 - resource created
  res.status(201).json({});

  // Create payload
  const payload = JSON.stringify({ title: "Push Test" });

  // Pass object into sendNotification
  webpush
    .sendNotification(subscription, payload)
    .catch(err => console.error(err));
};

// const port = 5000;

app.listen(undefined, () => console.log(`Server started on port`));









// export default app.post("/api/subscribe", (req, res) => {
//   // Get pushSubscription object
//   const subscription = req.body;

//   // Send 201 - resource created
//   res.status(201).json({});

//   // Create payload
//   const payload = JSON.stringify({ title: "Push Test" });

//   // Pass object into sendNotification
//   webpush
//     .sendNotification(subscription, payload)
//     .catch(err => console.error(err));
// });