const functions = require('firebase-functions');
const csv = require('csv-parser');
const fs = require('fs');

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into
// Cloud Firestore under the path /messages/:documentId/original
exports.getPlacebyPincode = functions.https.onRequest(async (req, res) => {
  const csvFilePath='./locations.csv';

  // Grab the text parameter.
  const pincode = req.query.pincode;
  const results = [];

  try {
    fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      const location = results.find((place) => {
        if(place.pincode === pincode){
          return place;
        }
      });

      let response = [];

      if(location){
        response = [
          location.state,
          location.district,
        ]
      }

      res.json(response);
    });
  } catch (e) {
    console.log(e);
  }
});
