'use strict'

module.exports = {
  // Public Key
  public: process.env.STRIPE_PUBLIC || '<test_public_key>',
  // Secret Key
  secret: process.env.STRIPE_SECRET || '<test_secret_key>',
  // Validate Events with Stripe
  validate: process.env.STRIPE_VALIDATE || false
}
