'use strict'

const Controller = require('trails-controller')

/**
 * @module StripeController
 * @description Stripe Controller for Stripe Models.
 * @help :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = class StripeController extends Controller{
  /**
   * Handle Events from Stripe Webhooks
   *
   * @param {Object} req
   * @param {Object} res
   */
  webhook(req, res) {
    this.app.services.StripeService.webhook(req, res, (err, event) => {
      if (err) {
        if (err.code === 'E_VALIDATION') {
          res.status(400).json({error: err.message || err})
        }
        else {
          this.app.log.error(err)
          res.serverError(err, req, res)
        }
      }
      else {
        res.json(event)
      }
    })
  }
}

