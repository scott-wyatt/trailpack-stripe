'use strict'

const Service = require('trails-service')
const _ = require('lodash')

/**
 * @module StripeService
 * @description Stripe Service
 */
module.exports = class StripeService extends Service {
  constructor(app) {
    super(app)
    this.stripe = require('stripe')(this.app.config.stripe.secret)
  }

  /**
   * Validate and handle webhook from stripe
   * @param req request object
   * @param res response object
   * @param next callback function
   */
  webhook(req, res, next) {

    const params = req.params
    const eventDate = new Date(params.created * 1000)

    // this.app.log.error(params)

    if (!params.data || !_.isObject(params.data)) {
      const err = new Error('E_VALIDATION')
      err.statusCode = 400
      err.message = 'Requires a data attribute as an object'
      return next(err)
    }

    if (!params.data.object || !_.isObject(params.data.object)) {
      const err = new Error('E_VALIDATION')
      err.statusCode = 400
      err.message = 'Requires a data.object attribute as an object'
      return next(err)
    }
    // We add this in incase Stripe Events get out of Order
    params.data.object.lastStripeEvent = eventDate

    next(null,params)
  }
}

