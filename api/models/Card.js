'use strict'

const Model = require('trails-model')

/**
 * @module Card
 * @description Card Stripe Model
 */
module.exports = class Card extends Model {

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
              // models.Card.belongsTo(models.Customer, {
              //   as: 'customer',
              //   onDelete: 'CASCADE',
              //   foreignKey: {
              //     allowNull: false
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
          type: 'string', //"card_5R82bJXG5gm5bt"
          primaryKey: true,
          unique: true
        },
        object: {
          type: 'string' //"card"
        },
        last4: {
          type: 'string' //"4242"
        },
        brand: {
          type: 'string' //"Visa"
        },
        funding: {
          type: 'string' //"credit"
        },
        exp_month: {
          type: 'integer' //12
        },
        exp_year: {
          type: 'integer' //2018
        },
        country: {
          type: 'string' //"US"
        },
        name: {
          type: 'string' //"Scottie"
        },
        address_line1: {
          type: 'string' //"undefined"
        },
        address_line2: {
          type: 'string' //"undefined"
        },
        address_city: {
          type: 'string' //"undefined"
        },
        address_state: {
          type: 'string' //"undefined"
        },
        address_zip: {
          type: 'string' //"undefined"
        },
        address_country: {
          type: 'string' //"undefined"
        },
        cvc_check: {
          type: 'string' //"pass"
        },
        address_line1_check: {
          type: 'string' //"pass"
        },
        address_zip_check: {
          type: 'string' //"pass"
        },
        dynamic_last4: {
          type: 'string' //"pass" (For Apple Pay integrations only.) The last four digits of the device account number.
        },
        metadata: {
          type: 'json' //{}
        },
        customer: {
          model: 'Customer' // "cus_5MM1RcCBWYpcy7"
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
          type: Sequelize.STRING, //"card_5R82bJXG5gm5bt"
          primaryKey: true,
          unique: true
        },
        object: {
          type: Sequelize.STRING //"card"
        },
        last4: {
          type: Sequelize.STRING //"4242"
        },
        brand: {
          type: Sequelize.STRING //"Visa"
        },
        funding: {
          type: Sequelize.STRING //"credit"
        },
        exp_month: {
          type: Sequelize.INTEGER //12
        },
        exp_year: {
          type: Sequelize.INTEGER //2018
        },
        country: {
          type: Sequelize.STRING //"US"
        },
        name: {
          type: Sequelize.STRING //"Scottie"
        },
        address_line1: {
          type: Sequelize.STRING //"undefined"
        },
        address_line2: {
          type: Sequelize.STRING //"undefined"
        },
        address_city: {
          type: Sequelize.STRING //"undefined"
        },
        address_state: {
          type: Sequelize.STRING //"undefined"
        },
        address_zip: {
          type: Sequelize.STRING //"undefined"
        },
        address_country: {
          type: Sequelize.STRING //"undefined"
        },
        cvc_check: {
          type: Sequelize.STRING //"pass"
        },
        address_line1_check: {
          type: Sequelize.STRING //"pass"
        },
        address_zip_check: {
          type: Sequelize.STRING //"pass"
        },
        dynamic_last4: {
          type: Sequelize.STRING //"pass" (For Apple Pay integrations only.) The last four digits of the device account number.
        },
        metadata: sJSON('metadata'), //{}

        // customer Model belongsTo
        customer: {
          type: Sequelize.STRING //null
        },

        //Added to Model and doesn't exists in Stripe
        lastStripeEvent: {
          type: Sequelize.DATE
        }
      }
    }
    return schema
  }

  // Stripe Webhook customer.card.created
  stripeCustomerCardCreated(card, cb) {
    const StripeService = this.app.services.StripeService
    const Card = this.app.models.Card
    StripeService.dbStripeEvent('Card', card, (err, uCard) => {
      if (err) {
        return cb(err)
      }
      Card.afterStripeCustomerCardCreated(uCard, function(err, card){
        return cb(err, card)
      })
    })
  }

  afterStripeCustomerCardCreated(card, next) {
    //Add somethings to do after a card is created
    next(null, card)
  }

  // Stripe Webhook customer.card.updated
  stripeCustomerCardUpdated(card, cb) {
    const StripeService = this.app.services.StripeService
    const Card = this.app.models.Card
    StripeService.dbStripeEvent('Card', card, (err, uCard) => {
      if (err) {
        return cb(err)
      }
      Card.afterStripeCustomerCardUpdated(uCard, function(err, card){
        return cb(err, card)
      })
    })
  }

  afterStripeCustomerCardUpdated(card, next){
    //Add somethings to do after a card is updated
    next(null, card)
  }

  // Stripe Webhook customer.card.deleted
  stripeCustomerCardDeleted(card, cb) {
    const crud = this.app.services.FootprintService
    const Card = this.app.models.Card

    crud.destroy('Card',card.id)
    .then(cards => {
      Card.afterStripeCustomerCardDeleted(cards[0], function(err, card){
        return cb(err, card)
      })
    })
    .catch(cb)
  }

  afterStripeCustomerCardDeleted(card, next){
    //Add somethings to do after a card is deleted
    next(null, card)
  }
}
