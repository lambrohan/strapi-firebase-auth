"use strict";

const admin = require("firebase-admin");
const serviceAccount = require("path-to-serviceAccountKey.json");
module.exports = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://<your-project-id>.firebaseio.com",
  });
  strapi.firebase = admin;
};
