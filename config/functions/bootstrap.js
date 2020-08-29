"use strict";

const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json"); // add serviceAccountKey from firebase to root directory
module.exports = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://<firebase-project-id>.firebaseio.com",
  });
  strapi.firebase = admin;
};
