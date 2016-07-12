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
    const crud = this.app.services.FootprintService
    const params = req.body
    const eventDate = new Date(params.created * 1000)

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

    // Try and Find the Event in the DB
    crud.find('Event', {id: params.id}, { findOne: true })
    .then(event => {
      if (event) {
        // Tell handleStripeEvent to ignore this since it already exsits
        params.ignore = true
        return next(null, params)
      }

      // Create the new Event in the DB
      return crud.create('Event', params)
    })
    .then(event => {

      //Return newly created event
      return next(null, event)
    })
    .catch(next)

  }

  /**
   * Check if in DB
   * @param {String} model
   * @param {Object} stripeObject
   * @param cb callback function
   */
  dbStripeEvent(model, stripeObject, cb){
    const crud = this.app.services.FootprintService

    this.validateStripeEvent(stripeObject.id, (err, event) => {
      if (err) {
        const err = new Error()
        err.code = 'E_VALIDATION'
        err.message = 'Event Not Found on Stripe'
        return cb(err, stripeObject)
      }
      crud.find(model, {id: stripeObject.id}, { findOne: true })
      .then(fModel => {
        if (!fModel) {
          return crud.create(model, stripeObject)
        }
        else if (fModel.lastStripeEvent > stripeObject.lastStripeEvent){
          const err = new Error()
          err.message = stripeObject.id,'is older than',fModel.id
          return cb(err, fModel)
        }
        else {
          return fModel
        }
      })
      .then(fModel => {
        return crud.update(model, {id: fModel.id}, fModel)
      })
      .then(uModel => {
        return cb(null, uModel[0])
      })
      .catch(cb)
    })

  }

  /**
   * Validate Stripe Event
   * @param {String} id
   * @param cb callback function
   * @return null of err
   */
  validateStripeEvent(id, cb){
    if (!this.app.config.stripe.validate) {
      cb(null)
    }
    this.stripe.events.retrieve(id, function(err, event) {
      if (err) {
        return cb(err)
      }
      cb(null)
    })
  }

  /**
   * Validate and handle webhook from stripe
   * @param {String} type
   * @param {Object} stripeObject
   * @param next callback function
   */
  handleStripeEvent(type, stripeObject, cb){
    const models = this.app.models
    const stripeEvents = {

      //Account
      'account.updated': () => {
        models.Stripeaccount.stripeAccountUpdated(stripeObject,
          function (err, account) {
            return cb(err, account)
          })
      },
      'account.external_account.created': () => {
        //TODO: No way to currently handle this event
        return cb(null, null)
      },
      'account.external_account.updated': () => {
        //TODO: No way to currently handle this event
        return cb(null, null)
      },
      'account.external_account.deleted': () => {
        //TODO: No way to currently handle this event
        return cb(null, null)
      },
      'account.application.deauthorized': () => {
        models.Stripeaccount.stripeAccountApplicationDeauthorized(stripeObject,
          function (err, application) {
            return cb(err, application)
          })
      },

      //Application Fee
      'application_fee.created': () => {
        models.Applicationfee.stripeApplicationFeeCreated(stripeObject,
          function (err, fee) {
            return cb(err, fee)
          })
      },
      'application_fee.refunded': () => {
        models.Applicationfee.stripeApplicationFeeRefunded(stripeObject,
          function (err, fee) {
            return cb(err, fee)
          })
      },

      //Balance
      'balance.available': () => {
        //Balance Objects have no Id.
        return cb(null, null)
      },

      //Bitcoin
      'bitcoin.receiver.created': () => {
        models.Bitcoin.stripeBitcoinReceiverCreated(stripeObject,
          function (err, receiver) {
            return cb(err, receiver)
          })
      },
      'bitcoin.receiver.filled': () => {
        models.Bitcoin.stripeBitcoinReceiverFilled(stripeObject,
          function (err, receiver) {
            return cb(err, receiver)
          })
      },
      'bitcoin.receiver.updated': () => {
        models.Bitcoin.stripeBitcoinReceiverUpdated(stripeObject,
          function (err, receiver) {
            return cb(err, receiver)
          })
      },
      'bitcoin.receiver.transaction.created': () => {
        models.Bitcoin.stripeBitcoinReceiverTransactionCreated(stripeObject,
          function (err, receiver) {
            return cb(err, receiver)
          })
      },

      //Charge
      'charge.succeeded': () => {
        models.Charge.stripeChargeSucceeded(stripeObject,
          function (err, charge) {
            return cb(err, charge)
          })
      },
      'charge.failed': () => {
        models.Charge.stripeChargeFailed(stripeObject,
          function (err, charge) {
            return cb(err, charge)
          })
      },
      'charge.refunded': () => {
        models.Charge.stripeChargeRefunded(stripeObject,
          function (err, charge) {
            return cb(err, charge)
          })
      },
      'charge.captured': () => {
        models.Charge.stripeChargeCaptured(stripeObject,
          function (err, charge) {
            return cb(err, charge)
          })
      },
      'charge.updated': () => {
        models.Charge.stripeChargeUpdated(stripeObject,
          function (err, charge) {
            return cb(err, charge)
          })
      },
      'charge.dispute.created': () => {
        models.Dispute.stripeChargeDisputeCreated(stripeObject,
          function (err, dispute) {
            return cb(err, dispute)
          })
      },
      'charge.dispute.updated': () => {
        models.Dispute.stripeChargeDisputeUpdated(stripeObject,
          function (err, dispute) {
            return cb(err, dispute)
          })
      },
      'charge.dispute.closed': () => {
        models.Dispute.stripeChargeDisputeClosed(stripeObject,
          function (err, dispute) {
            return cb(err, dispute)
          })
      },
      'charge.dispute.funds_withdrawn': () => {
        models.Dispute.stripeChargeDisputeFundsWithdrawn(stripeObject,
          function (err, dispute) {
            return cb(err, dispute)
          })
      },
      'charge.dispute.funds_reinstated': () => {
        models.Dispute.stripeChargeDisputeFundsReinstated(stripeObject,
          function (err, dispute) {
            return cb(err, dispute)
          })
      },

      //Coupon
      'coupon.created': () => {
        models.Coupon.stripeCouponCreated(stripeObject,
          function (err, coupon) {
            return cb(err, coupon)
          })
      },
      'coupon.deleted': () => {
        models.Coupon.stripeCouponDeleted(stripeObject,
          function (err, coupon) {
            return cb(err, coupon)
          })
      },

      //Customer
      'customer.created': () => {
        models.Customer.stripeCustomerCreated(stripeObject,
          function (err, customer) {
            return cb(err, customer)
          })
      },
      'customer.updated': () => {
        models.Customer.stripeCustomerUpdated(stripeObject,
          function (err, customer) {
            return cb(err, customer)
          })
      },
      'customer.deleted': () => {
        models.Customer.stripeCustomerDeleted(stripeObject,
          function (err, customer) {
            return cb(err, customer)
          })
      },
      'customer.card.created': () => {
        models.Card.stripeCustomerCardCreated(stripeObject,
          function (err, card) {
            return cb(err, card)
          })
      },
      'customer.card.updated': () => {
        models.Card.stripeCustomerCardUpdated(stripeObject,
          function (err, card) {
            return cb(err, card)
          })
      },
      'customer.card.deleted': () => {
        models.Card.stripeCustomerCardDeleted(stripeObject,
          function (err, card) {
            return cb(err, card)
          })
      },
      'customer.source.created': () => {
        const sourceTypes = {
          'card': models.Card.stripeCustomerCardCreated,
          'bitcoin_receiver': models.Bitcoin.stripeBitcoinReceiverCreated,
          'bank_account': models.Bankaccount.stripeCustomerSourceCreated
        }
        const sourceType = sourceTypes[stripeObject.object]
        if (typeof sourceType  !== 'function') {
          const err = new Error()
          err.message = 'customer.source.created','can not handle',stripeObject.object
          err.status = 500
          return cb(err, stripeObject)
        }
        else {
          sourceType(stripeObject, function (err, source) {
            return cb(err, source)
          })
        }
      },
      'customer.source.updated': () => {
        const sourceTypes = {
          'card': models.Card.stripeCustomerCardUpdated,
          'bitcoin_receiver': models.Bitcoin.stripeBitcoinReceiverUpdated,
          'bank_account': models.Bankaccount.stripeCustomerSourceUpdated
        }
        const sourceType = sourceTypes[stripeObject.object]
        if (typeof sourceType  !== 'function') {
          const err = new Error()
          err.message = 'customer.source.updated','can not handle',stripeObject.object
          err.status = 500
          return cb(err, stripeObject)
        }
        else {
          sourceType(stripeObject, function (err, source) {
            return cb(err, source)
          })
        }
      },
      'customer.source.deleted': () => {
        const sourceTypes = {
          'card': models.Card.stripeCustomerCardDeleted,
          'bitcoin_receiver': models.Bitcoin.stripeBitcoinReceiverDeleted,
          'bank_account': models.Bankaccount.stripeCustomerSourceDeleted
        }
        const sourceType = sourceTypes[stripeObject.object]
        if (typeof sourceType  !== 'function') {
          const err = new Error()
          err.message = 'customer.source.deleted','can not handle',stripeObject.object
          err.status = 500
          return cb(err, stripeObject)
        }
        else {
          sourceType(stripeObject, function (err, source) {
            return cb(err, source)
          })
        }
      },
      'customer.subscription.created': () => {
        models.Subscription.stripeCustomerSubscriptionCreated(stripeObject,
          function (err, subscription) {
            return cb(err, subscription)
          })
      },
      'customer.subscription.updated': () => {
        models.Subscription.stripeCustomerSubscriptionUpdated(stripeObject,
          function (err, subscription) {
            return cb(err, subscription)
          })
      },
      'customer.subscription.deleted': () => {
        models.Subscription.stripeCustomerSubscriptionDeleted(stripeObject,
          function (err, subscription) {
            return cb(err, subscription)
          })
      },
      'customer.subscription.trial_will_end': () => {
        models.Subscription.stripeCustomerSubscriptionTrial(stripeObject,
          function (err, subscription) {
            return cb(err, subscription)
          })
      },
      'customer.discount.created': () => {
        models.Discount.stripeCustomerDiscountCreated(stripeObject,
          function (err, discount) {
            return cb(err, discount)
          })
      },
      'customer.discount.updated': () => {
        models.Discount.stripeCustomerDiscountUpdated(stripeObject,
          function (err, discount) {
            return cb(err, discount)
          })
      },
      'customer.discount.deleted': () => {
        models.Discount.stripeCustomerDiscountDeleted(stripeObject,
          function (err, discount) {
            return cb(err, discount)
          })
      },

      //Invoice
      'invoice.created': () => {
        models.Invoice.stripeInvoiceCreated(stripeObject,
          function (err, invoice) {
            return cb(err, invoice)
          })
      },
      'invoice.updated': () => {
        models.Invoice.stripeInvoiceUpdated(stripeObject,
          function (err, invoice) {
            return cb(err, invoice)
          })
      },
      'invoice.payment_succeeded': () => {
        models.Invoice.stripeInvoicePaymentSucceeded(stripeObject,
          function (err, invoice) {
            return cb(err, invoice)
          })
      },
      'invoice.payment_failed': () => {
        models.Invoice.stripeInvoicePaymentFailed(stripeObject,
          function (err, invoice) {
            return cb(err, invoice)
          })
      },

      //Invoice Item
      'invoiceitem.created': () => {
        models.Invoiceitem.stripeInvoiceitemCreated(stripeObject,
          function (err, invoiceitem) {
            return cb(err, invoiceitem)
          })
      },
      'invoiceitem.updated': () => {
        models.Invoiceitem.stripeInvoiceitemUpdated(stripeObject,
          function (err, invoiceitem) {
            return cb(err, invoiceitem)
          })
      },
      'invoiceitem.deleted': () => {
        models.Invoiceitem.stripeInvoiceitemDeleted(stripeObject,
          function (err, invoiceitem) {
            return cb(err, invoiceitem)
          })
      },

      //Order
      'order.created': () => {
        models.Order.stripeOrderCreated(stripeObject,
          function (err, order) {
            return cb(err, order)
          })
      },
      'order.payment_failed': () => {
        models.Order.stripeOrderPaymentFailed(stripeObject,
          function (err, order) {
            return cb(err, order)
          })
      },
      'order.payment_succeeded': () => {
        models.Order.stripeOrderPaymentSucceeded(stripeObject,
          function (err, order) {
            return cb(err, order)
          })
      },
      'order.updated': () => {
        models.Order.stripeOrderUpdated(stripeObject,
          function (err, order) {
            return cb(err, order)
          })
      },

      //Plan
      'plan.created': () => {
        models.Plan.stripePlanCreated(stripeObject,
          function (err, plan) {
            return cb(err, plan)
          })
      },
      'plan.updated': () => {
        models.Plan.stripePlanUpdated(stripeObject,
          function (err, plan) {
            return cb(err, plan)
          })
      },
      'plan.deleted': () => {
        models.Plan.stripePlanDeleted(stripeObject,
          function (err, plan) {
            return cb(err, plan)
          })
      },

      //Product
      'product.created': () => {
        models.Product.stripeProductCreated(stripeObject,
          function (err, product) {
            return cb(err, product)
          })
      },
      'product.updated': () => {
        models.Product.stripeProductUpdated(stripeObject,
          function (err, product) {
            return cb(err, product)
          })
      },

      //Recipient
      'recipient.created': () => {
        models.Recipient.stripeRecipientCreated(stripeObject,
          function (err, recipient) {
            return cb(err, recipient)
          })
      },
      'recipient.updated': () => {
        models.Recipient.stripeRecipientUpdated(stripeObject,
          function (err, recipient) {
            return cb(err, recipient)
          })
      },
      'recipient.deleted': () => {
        models.Recipient.stripeRecipientDeleted(stripeObject,
          function (err, recipient) {
            return cb(err, recipient)
          })
      },

      //Sku
      'sku.created': () => {
        models.Sku.stripeSkuCreated(stripeObject,
          function (err, sku) {
            return cb(err, sku)
          })
      },
      'sku.updated': () => {
        models.Sku.stripeSkuCreated(stripeObject,
          function (err, sku) {
            return cb(err, sku)
          })
      },

      //Transfer
      'transfer.created': () => {
        models.Transfer.stripeTransferCreated(stripeObject,
          function (err, transfer) {
            return cb(err, transfer)
          })
      },
      'transfer.updated': () => {
        models.Transfer.stripeTransferUpdated(stripeObject,
          function (err, transfer) {
            return cb(err, transfer)
          })
      },
      'transfer.reversed': () => {
        models.Transfer.stripeTransferReversed(stripeObject,
          function (err, transfer) {
            return cb(err, transfer)
          })
      },
      'transfer.paid': () => {
        models.Transfer.stripeTransferPaid(stripeObject,
          function (err, transfer) {
            return cb(err, transfer)
          })
      },
      'transfer.failed': () => {
        models.Transfer.stripeTransferFailed(stripeObject,
          function (err, transfer) {
            return cb(err, transfer)
          })
      },

      //Ping
      'ping': () => {
        //May be sent by Stripe at any time to see if a provided webhook URL is working. So return a 200
        return cb(null, 'OK')
      },
      'default': () => {
        //As of this trailpack creation all hooks are handled. So this may be a rouge attempt or you may have experimental features enabled from Stripe.
        this.app.log.error('Unknown Operation')
        return cb(null, 'Unknown Operation')
      }
    }
    // if the stripeEvents Object contains the type
    // passed in, let's use it
    this.app.log.debug('TYPE:',type)

    if (typeof stripeEvents[type] !== 'undefined') {
      stripeEvents[type](stripeObject)
    }
    else {
      // otherwise we'll assign the default
      // also the same as stripeEvents.default
      stripeEvents['default'](stripeObject)
    }
  }
}

