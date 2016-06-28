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
    //const params = req.params.all()
    //const eventDate = new Date(params.created * 1000)
  }
}

