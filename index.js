'use strict'

const Trailpack = require('trailpack')
const lib = require('./lib')
const _ = require('lodash')

module.exports = class StripeTrailpack extends Trailpack {

  /**
   * Check express4 is used and verify stripe configuration
   */
  validate () {
    if (!_.includes(_.keys(this.app.packs), 'express')) {
      return Promise.reject(new Error('This Trailpack only works for express!'))
    }

    if (!this.app.config.stripe) {
      return Promise.reject(new Error('No configuration found at config.stripe!'))
    }
  }

  /**
   * Initialize Stripe
   */
  configure () {
    lib.Stripe.init(this.app)
    lib.Stripe.addRoutes(this.app)
  }

  constructor (app) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    })
  }
}

