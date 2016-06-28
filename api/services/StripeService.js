'use strict'

const Service = require('trails-service')

/**
 * @module StripeService
 * @description Stripe Service
 */
module.exports = class StripeService extends Service {
  constructor(app) {
    super(app)
    this.stripe = require('stripe')(this.app.config.stripe.secret)
  }
}

