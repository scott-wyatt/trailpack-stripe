'use strict'

const Model = require('trails/model')

/**
 * @module Invoiceitem
 * @description Invoice Item Stripe Model
 */
module.exports = class Invoiceitem extends Model {

  static config (app) {
    let config = {}

    if (app && (app.config.database.orm === 'waterline' || app.config.database.orm === 'js-data')) {
      config = {
        /**
         * Callback to be run before validating from Stripe.
         *
         * @param {Object}   values
         * @param {Function} next
         */
        beforeValidate: (values, next) => {
          if (values.created) {
            values.created = new Date(values.created * 1000)
          }
          next()
        }
      }
    }
    else if (app && app.config.database.orm === 'sequelize') {
      config = {
        //More informations about supported models options here : http://docs.sequelizejs.com/en/latest/docs/models-definition/#configuration
        options: {
          hooks: {
            beforeValidate: (values, options, fn) => {
              if (values.created) {
                values.created = new Date(values.created * 1000)
              }
              fn()
            }
          },
          classMethods: {
            //If you need associations, put them here
            associate: (models) => {
              //More information about associations here : http://docs.sequelizejs.com/en/latest/docs/associations/
              // models.Invoiceitem.belongsTo(models.Invoice, {
              //   as: 'invoice',
              //   onDelete: 'CASCADE',
              //   foreignKey: {
              //     allowNull: true
              //   }
              // })

              // models.Invoiceitem.belongsTo(models.Subscription, {
              //   as: 'subscription',
              //   onDelete: 'CASCADE',
              //   foreignKey: {
              //     allowNull: true
              //   }
              // })
            }
          }
        }
      }
    }
    return config
  }

  static schema (app, Sequelize) {
    let schema = {}
    if (app.config.database.orm === 'waterline' || app.config.database.orm === 'js-data') {
      schema = {
        id: {
          type: 'string',
          primaryKey: true,
          unique: true
        },
        object: {
          type: 'string' //"line_item",
        },
        type: {
          type: 'string' //"invoiceitem",
        },
        livemode: {
          type: 'boolean' //false
        },
        amount: {
          type: 'integer' //99999
        },
        currency: {
          type: 'string' //"usd"
        },
        proration: {
          type: 'boolean' //true
        },
        period: {
          type: 'json' // {"start": 1422575156, "end": 1422575156}
        },
        invoice: {
          model: 'Invoice' // "in_5m2UNzEY8YCWFi",
        },
        subscription: {
          model: 'Subscription' //"sub_5bfJWiXp3MNZpF"
        },
        quantity: {
          type: 'integer' //1
        },
        plan: {
          type: 'json' // {"interval": "week","name": "Bar","created": 1422575143,"amount": 100000,"currency": "usd","id": "18966bar1422575142","object": "plan","livemode": false,"interval_count": 1,"trial_period_days": null,metadata: {},"statement_descriptor": null}
        },
        description: {
          type: 'string' //"Remaining time on Bar after 29 Jan 2015"
        },
        metadata: {
          type: 'json'
        },

        //Added to Model and doesn't exists in Stripe
        lastStripeEvent: {
          type: 'datetime'
        }
      }
    }
    else if (app.config.database.orm === 'sequelize') {

      const database = app.config.database

      let sJSON = (field) =>{
        return {
          type: Sequelize.STRING,
          get: function() {
            return JSON.parse(this.getDataValue(field))
          },
          set: function(val) {
            return this.setDataValue(field, JSON.stringify(val))
          }
        }
      }

      if (database.models[this.constructor.name.toLowerCase()]) {
        if (database.stores[database.models[this.constructor.name.toLowerCase()].store].dialect == 'postgres') {
          sJSON = (field) => {
            return {
              type: Sequelize.JSON
            }
          }
        }
      }
      else if (database.stores[database.models.defaultStore].dialect == 'postgres') {
        sJSON = (field) => {
          return {
            type: Sequelize.JSON
          }
        }
      }

      schema = {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          unique: true
        },
        object: {
          type: Sequelize.STRING //"line_item",
        },
        type: {
          type: Sequelize.STRING //"invoiceitem",
        },
        livemode: {
          type: Sequelize.BOOLEAN //false
        },
        amount: {
          type: Sequelize.INTEGER //99999
        },
        currency: {
          type: Sequelize.STRING //"usd"
        },
        proration: {
          type: Sequelize.BOOLEAN //true
        },
        period: sJSON('period'),

        // invoice Model belongsTo
        invoice: {
          type: Sequelize.STRING //null
        },

        // subscription Model belongsTo
        subscription: {
          type: Sequelize.STRING //null
        },

        quantity: {
          type: Sequelize.INTEGER //1
        },
        plan: sJSON('plan'),
        description: {
          type: Sequelize.STRING //"Remaining time on Bar after 29 Jan 2015"
        },
        metadata: sJSON('metadata'),

        //Added to Model and doesn't exists in Stripe
        lastStripeEvent: {
          type: Sequelize.DATE
        }
      }
    }
    return schema
  }

  // Stripe Webhook invoiceitem.created
  stripeInvoiceitemCreated(invoiceitem, cb) {
    const StripeService = this.app.services.StripeService
    const Invoiceitem = this.app.models.Invoiceitem
    StripeService.dbStripeEvent('Invoiceitem', invoiceitem, (err, uInvoiceitem) => {
      if (err) {
        return cb(err)
      }
      Invoiceitem.afterStripeInvoiceitemCreated(uInvoiceitem, function(err, invoiceitem){
        return cb(err, invoiceitem)
      })
    })
  }

  afterStripeInvoiceitemCreated(invoiceitem, next){
    //Do somethings after an invoice item is created
    next(null, invoiceitem)
  }

  // Stripe Webhook invoiceitem.updated
  stripeInvoiceitemUpdated(invoiceitem, cb) {
    const StripeService = this.app.services.StripeService
    const Invoiceitem = this.app.models.Invoiceitem
    StripeService.dbStripeEvent('Invoiceitem', invoiceitem, (err, uInvoiceitem) => {
      if (err) {
        return cb(err)
      }
      Invoiceitem.afterStripeInvoiceitemUpdated(uInvoiceitem, function(err, invoiceitem){
        return cb(err, invoiceitem)
      })
    })
  }

  afterStripeInvoiceitemUpdated(invoiceitem, next){
    //Do somethings after an invoice item is created
    next(null, invoiceitem)
  }

  // Stripe Webhook invoiceitem.deleted
  stripeInvoiceitemDeleted(invoiceitem, cb) {
    const crud = this.app.services.FootprintService
    const Invoiceitem = this.app.models.Invoiceitem

    crud.destroy('Invoiceitem',invoiceitem.id)
    .then(invoiceitems => {
      Invoiceitem.afterStripeInvoiceitemDeleted(invoiceitems[0], function(err, invoiceitem){
        return cb(err, invoiceitem)
      })
    })
    .catch(cb)
  }

  afterStripeInvoiceitemDeleted(invoiceitem, next){
    //Do somethings after an invoice item is created
    next(null, invoiceitem)
  }
}
