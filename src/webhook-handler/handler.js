'use strict';

const HTTPError = require('node-http-error')
const validate = require('./validate')

module.exports.handleWebhookEvent = (event, context, callback) => {
  
  let response = {}

  
  validate(event.body, event.headers['X-Exl-Signature'])
    .then(() => {
      response = {
        statusCode: 200,
        body: "webhook event received"
      }
    })    
    .catch((e) => {
      if (e instanceof HTTPError) {
        response = errorResponse(e.status, e.message)
      }
    })
    .then(() => {
      callback(null, response);
    })

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

// const 

const errorResponse = (statusCode, message) => {
  return {
    statusCode,
    body: JSON.stringify({
      message,
    })
  }
}