const eventTopicData =  new Map([
  ['LOAN_CREATED', 
    {
      sns_arn: process.env.LoanCreatedTopicArn
    }
  ]
]);

module.exports = eventTopicData