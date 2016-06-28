'use strict'

module.exports = {
  public: process.env.STRIPE_PUBLIC || '<test_public_key>',
  secret: process.env.STRIPE_SECRET || '<test_secret_key>'
}
