module.exports = [
  {
    method: 'POST',
    path: '/stripe/webhook',
    handler: 'StripeController.webhook'
  }
]
