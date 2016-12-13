'use strict'

const Controller = require('trails/controller')

/**
 * @module StripeController
 * @description Stripe Controller for Stripe Models.
 * @help :: See trails controllers
 */
module.exports = class StripeController extends Controller{
  /**
   * Handle Events from Stripe Webhooks
   * @param {Object} req
   * @param {Object} res
   */
  webhook(req, res) {
    const StripeService = this.app.services.StripeService

    StripeService.webhook(req, res, (err, event) => {
      if (err) {
        if (err.code === 'E_VALIDATION') {
          // Validation Error
          res.status(400).json({error: err.message || err})
        }
        else {
          // Unreconciled Error
          this.app.log.error(err)
          res.serverError(err, req, res)
        }
      }
      else {

        // Send Stripe a response right away so that it doesn't wait on the ORM
        res.json(event)

        // Handle Stripe Event
        if (!event.ignore) {

          StripeService.handleStripeEvent(event.type, event.data.object, (err, response) => {
            if (err) {
              this.app.log.error(err)
            }
            else {
              this.app.log.debug(response)
            }
          })
        }
      }
    })
  }
}

