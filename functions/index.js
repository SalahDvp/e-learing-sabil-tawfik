const {onCall,HttpsError,onRequest} = require("firebase-functions/v2/https");
const {getDatabase} = require("firebase-admin/database");
const {logger} = require("firebase-functions/v2");
const admin=require('firebase-admin')
const functions = require('firebase-functions');
var generator = require('generate-password');
admin.initializeApp();



exports.createUserAndAssignRole = onCall(async (request) => {
  try {
    const { data } = request;
    var password = generator.generate({
      length: 10,
      numbers: true
    });

    const userRecord =  await admin.auth().createUser({
      email: data.email,
      password: password,
    });
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: "worker" });
    const parentData = {
      ...data,
      id: userRecord.uid,
    };
    await admin.firestore().collection('users').doc(userRecord.uid).set(parentData);

    logger.info("User created and assigned role");

    return { success: true, uid: userRecord.uid, data: data, password:password};
  } catch (error) {
    // Log error message
    logger.error("Error creating user and assigning role:", error);

    // Throw HttpsError
    throw new HttpsError("internal", "Error creating user and assigning role");
  }
});
