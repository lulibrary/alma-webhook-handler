'use strict';

module.exports.handleWebhookEvent = (event, context, callback) => {
  

  callback(null, "webhook event received");

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};