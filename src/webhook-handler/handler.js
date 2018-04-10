'use strict';

const Topic = require('@lulibrary/lag-utils').Topic;
const HTTPError = require('node-http-error')

const validateRequestSignature = require('./request-validator')
const eventTopicData = require('./eventTopicData');

module.exports.handleWebhookEvent = (event, context, callback) => {
  
  let response = {}
  
  validateRequestSignature(event.body, event.headers['X-Exl-Signature'])
    .then(() => {
      return handleSnsPublish(event)
    })
    .then((data) => {
      response = {
        statusCode: 200,
        body: "Data successfully published to topic"
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

const handleSnsPublish = (event) => {
  const body = JSON.parse(event.body);
  const eventTopicArn = eventTopicData.get(body.event.value)
  const eventTopic = new Topic(eventTopicArn, process.env.AWS_REGION)

  return eventTopic.publish(event.body)
}

const errorResponse = (statusCode, message) => {
  return {
    statusCode,
    body: JSON.stringify({
      message,
    })
  }
}
