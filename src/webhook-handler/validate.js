const crypto = require('crypto')
const HTTPError = require('node-http-error');

const secretKey = "secretkey";

const validate = (message, signature) => {
  if(!validateSignature(message, secretKey, signature)) {
    throw new HTTPError(401,'An invalid message signature was sent')
  }
}

const validateSignature = (body, secret, signature) => {
  var hash = crypto.createHmac('SHA256', secret)
     .update(body)
     .digest('base64');
  return (hash === signature);
}

module.exports = validate