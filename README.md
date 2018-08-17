# alma-webhook-handler
A serverless application on AWS Lambda for handling Alma webhooks, and passing them to SNS topics.

This service is built on the [serverless](https://serverless.com/) framework.

The service handles 8 specific webhook event types. These are `LOAN_CREATED`, `LOAN_RENEWED`, `LOAN_DUE_DATE`, `LOAN_RETURNED`, `REQUEST_CREATED`, `REQUEST_CANCELED`, `REQUEST_CLOSED` AND `REQUEST_PLACED_ON_SHELF`. 
For each of these event types the service defines and creates an AWS SNS topic, to which it writes the specific event data.
Subscriptions can be set up on these topics to make use of these data. The [LAG-sns-update-cache](https://github.com/lulibrary/LAG-sns-update-cache) service is intended to subscribe to these topics to use the data for caching purposes.

The service consists of two AWS Lambda functions, `challenge-handler` and `webhook-handler`.

### challenge-handler
The `challenge-handler` handles the initial challenge request made by the Alma webhook API. The Alma API makes an HTTP GET request to the provided endpoint with a random `challenge` parameter. The `challenge-handler` returns this `challenge` parameter back, with a `200` response.

### webhook-handler
The `webhook-handler` then handles the webhook events from the Alma webhook API. These are HTTP POST requests with the event data sent in the request body. The POST request also includes an `X-Exl-Signature` header to validate the webhook data. This is a SHA-256 HMAC of the request body, using a user defined secret key supplied to Alma. The Lambda verifies this signature by computing the HMAC of the received data. The secret is stored in AWS SSM and retrieved from it at runtime. If the signatures do not match the Lambda will return a `401` error and will not write any data to SNS.

## Usage

The service can be deployed using the command
`sls deploy --stage <STAGE> --region <REGION>`

There are three valid stages defined in the `serverless.yml` configuration file. These are `dev`, `stg` and `prod`. An environment variable `ALMA_SHARED_SECRET_NAME` must be defined, which should be the name of the SSM parameter for the Alma shared secret. Note that all names of SSM parameters start with a slash `/`.

On deployment the service will create all necessary resources with the exception of the SSM Parameter, which must be created separately. It is recommended to simply generate a random string for the shared secret.

## Associated Services

There are four services that make up the Alma caching stack. These are:

- [alma-webhook-handler](https://github.com/lulibrary/alma-webhook-handler)       -   passes Alma webhook data to SNS topics :
- [LAG-sns-update-cache](https://github.com/lulibrary/LAG-sns-update-cache)       -   writes webhook data from SNS topics to  DynanoDB
- [LAG-bulk-update-cache](https://github.com/lulibrary/LAG-bulk-update-cache)     -   updates DynamoDB with data from Alma API for queued records
- [LAG-api-gateway](https://github.com/lulibrary/LAG-api-gateway)                 -   provides a REST API for cached Alma data with fallback to Alma API

There are also 3 custom packages on which these depend. These are:
- [LAG-Utils](https://github.com/lulibrary/LAG-Utils)                             -   utility library for AWS services
- [LAG-Alma-Utils](https://github.com/lulibrary/LAG-Alma-Utils)                   -   utility library for DynamoDB cache schemas
- [node-alma-api-wrapper](https://github.com/lulibrary/node-alma-api-wrapper)     -   utility library for querying Alma API


## Development
Contributions to this service or any of the associated services and packages are welcome.
