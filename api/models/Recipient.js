'use strict'

const Model = require('trails-model')

/**
 * @module Recipient
 * @description Recipient Stripe Model
 */
module.exports = class Recipient extends Model {

  static config (app) {
    let config = {}

    if (app && app.config.database.orm === 'waterline') {
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
              // models.Recipient.belongsTo(models.Card, {
              //   as: 'default_card',
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
          type: 'string', //"rp_3Uh38RCOt3igvD"
          primaryKey: true,
          unique: true
        },
        object: {
          type: 'string' //"recipient"
        },
        created: {
          type: 'datetime' //1392367798
        },
        livemode: {
          type: 'boolean' //false
        },
        type: {
          type: 'string' //"individual"
        },
        description: {
          type: 'string' //"Added through Widget"
        },
        email: {
          type: 'email' //"michael@widget"
        },
        name: {
          type: 'string' //"Mike"
        },
        verified: {
          type: 'boolean' //false
        },
        metadata: {
          type: 'json' //{}
        },
        active_account: {
          type: 'string' //null
        },
        cards: {
          type: 'json' // {}
        },
        default_card: {
          model: 'Card' //null
        },
        migrated_to: {
          type: 'string' //null
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
          type: Sequelize.STRING, //"rp_3Uh38RCOt3igvD"
          primaryKey: true,
          unique: true
        },
        object: {
          type: Sequelize.STRING //"recipient"
        },
        created: {
          type: Sequelize.DATE //1392367798
        },
        livemode: {
          type: Sequelize.BOOLEAN //false
        },
        type: {
          type: Sequelize.STRING //"individual"
        },
        description: {
          type: Sequelize.STRING //"Added through Widget"
        },
        email: {
          type: Sequelize.STRING, //"michael@widget"
          validate: {
            isEmail: true
          }
        },
        name: {
          type: Sequelize.STRING //"Mike"
        },
        verified: {
          type: Sequelize.BOOLEAN //false
        },
        metadata: sJSON('metadata'),
        active_account: {
          type: Sequelize.STRING //null
        },
        cards: sJSON('cards'),

        // default_card = card Model belongsTo
        default_card: {
          type: Sequelize.STRING //null
        },

        migrated_to: {
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

  // Stripe Webhook recipient.created
  stripeRecipientCreated(recipient, cb) {
    const StripeService = this.app.services.StripeService
    const Recipient = this.app.models.Recipient
    StripeService.dbStripeEvent('Recipient', recipient, (err, uRecipient) => {
      if (err) {
        return cb(err)
      }
      Recipient.afterStripeRecipientCreated(uRecipient, function(err, recipient){
        return cb(err, recipient)
      })
    })
  }

  afterStripeRecipientCreated(recipient, next){
    //Do somethings after recipient created
    next(null, recipient)
  }

  // Stripe Webhook recipient.updated
  stripeRecipientUpdated(recipient, cb) {
    const StripeService = this.app.services.StripeService
    const Recipient = this.app.models.Recipient
    StripeService.dbStripeEvent('Recipient', recipient, (err, uRecipient) => {
      if (err) {
        return cb(err)
      }
      Recipient.afterStripeRecipientUpdated(uRecipient, function(err, recipient){
        return cb(err, recipient)
      })
    })
  }

  afterStripeRecipientUpdated(recipient, next){
    //Do somethings after recipient updated
    next(null, recipient)
  }

  // Stripe Webhook recipient.deleted
  stripeRecipientDeleted(recipient, cb) {
    const crud = this.app.services.FootprintService
    const Recipient = this.app.models.Recipient

    crud.destroy('Recipient',recipient.id)
    .then(recipients => {
      Recipient.afterStripeRecipientDeleted(recipients[0], function(err, recipient){
        return cb(err, recipient)
      })
    })
    .catch(cb)
  }

  afterStripeRecipientDeleted (recipient, next){
    //Do somethings after recipient deleted
    next(null, recipient)
  }
}
