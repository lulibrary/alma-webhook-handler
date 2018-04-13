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
  ],
  ['LOAN_RENEWED',
    {
      sns_arn: process.env.LoanRenewedTopicArn
    }
  ],
  ['LOAN_RETURNED',
    {
      sns_arn: process.env.LoanReturnedTopicArn
    }
  ],
  ['REQUEST_CREATED',
    {
      sns_arn: process.env.RequestCreatedTopicArn
    }
  ],
  ['REQUEST_CLOSED',
    {
      sns_arn: process.env.RequestClosedTopicArn
    }
  ]
])

module.exports = eventTopicData
