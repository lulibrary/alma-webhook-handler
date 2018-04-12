const eventTopicData = new Map([
  ['LOAN_CREATED',
    {
      sns_arn: process.env.LoanCreatedTopicArn
    }
  ],
  ['LOAN_DUE_DATE',
    {
      sns_arn: process.env.LoanDueDateTopicArn
    }
  ]
])

module.exports = eventTopicData
