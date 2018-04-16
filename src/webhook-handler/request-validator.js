const AWS = require('aws-sdk/global')
require('aws-sdk/clients/ssm')

const crypto = require('crypto')
const HTTPError = require('node-http-error')

const validateRequestSignature = (message, signature) => {
  return getSecretFromAWS()
    .then((secretKey) => {
      if (!validateSignature(message, secretKey, signature)) {
        throw new HTTPError(401, 'An invalid message signature was sent')
      }
    })
}

const validateSignature = (body, secret, signature) => {
  var hash = crypto.createHmac('SHA256', secret)
    .update(body)
    .digest('base64')
  return (hash === signature)
}

const getSecretFromAWS = () => {
  const keyName = process.env.ALMA_SECRET_KEY_NAME
  const ssm = new AWS.SSM({apiVersion: '2014-11-06'})

  const params = {
    Name: keyName,
    WithDecryption: true
  }

  return new Promise((resolve, reject) => {
    ssm.getParameter(params, (err, data) => {
      err ? reject(err) : resolve(data.Value)
    })
  })
}

module.exports = validateRequestSignature
