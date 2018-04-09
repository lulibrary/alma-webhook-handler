'use strict';

module.exports.handleChallengeEvent = (event, context, callback) => {
  

  callback(null, challenge(event));

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

const challenge = (event) => {
  if (!event.queryStringParameters || !event.queryStringParameters.challenge) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          message: "Missing challenge parameter"
        },
      })
    }
  }
  return {
    statusCode: 200,
      body: JSON.stringify({
        challenge: event.queryStringParameters.challenge,
      })
    }
}
