'use strict'

const Topic = require('@lulibrary/lag-utils').Topic
const HTTPError = require('node-http-error')

const validateRequestSignature = require('./request-validator')
const eventTopicData = require('./eventTopicData')

module.exports.handleWebhookEvent = (event, context, callback) => {
  let response = {}

  validateRequestSignature(event.body, event.headers['X-Exl-Signature'])
    .then(() => {
      return handleSnsPublish(event)
    })
    .then((data) => {
      response = {
        statusCode: 200,
        body: 'Data successfully published to topic'
      }
    })
    .catch((e) => {
      console.log(e)
      if (e instanceof HTTPError) {
        response = errorResponse(e.status, e.message)
      } else {
        response = errorResponse(500, 'Internal server error')
      }
    })
    .then(() => {
      callback(null, response)
    })

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
}

const handleSnsPublish = (event) => {
  const body = extractMessageBody(event)
  const eventTopicArn = lookupTopicArn(body.event.value)
  const eventTopic = new Topic(eventTopicArn, process.env.AWS_DEFAULT_REGION)

  return eventTopic.publish(event.body)
}

const lookupTopicArn = (eventType) => {
  try {
    return eventTopicData.get(eventType).sns_arn
  } catch (e) {
    throw new HTTPError(422, `Event type ${eventType} is not supported`)
  }
}

const extractMessageBody = (event) => {
  try {
    return JSON.parse(event.body)
  } catch (e) {
    throw new HTTPError(400, 'Event body is not valid JSON')
  }
}

const errorResponse = (statusCode, message) => {
  return {
    statusCode,
    body: JSON.stringify({
      message
    })
  }
}
