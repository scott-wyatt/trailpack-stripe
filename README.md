# trailpack-stripe

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-download]][npm-url]
[![Build status][ci-image]][ci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Code Climate][codeclimate-image]][codeclimate-url]

Stripe API Trailpack for Trails

Handles and validates [Stripe Webhooks](https://stripe.com/docs/webhooks).  
It checks the time the webhooks were received and keeps the DB in sync by adding a `lastStripeEvent` attribute to each event.

Optionally, it can perform `Round Trip` validation of every Stripe webhook that hits the endpoint.

Stores Stripe event models with lifecyle handler for after a Stripe event occurs.  

Makes call via Stripe API using a Stripe Service.

Supports [trailpack-waterline](https://github.com/trailsjs/trailpack-waterline), [trailpack-sequelize](https://github.com/trailsjs/trailpack-sequelize), and [trailpack-js-data](https://github.com/scott-wyatt/trailpack-js-data) as ORMs.

### Why Store Models from Stripe?
Stripe has a great API, but performing complex queries through it are not really possible.
By storing events and models from Stripe, you get the ability to do complex queries and analytics.
This also allows you to interact qucikly with an entry that you've just created instead of waiting for Stripe Webhooks.

## Install

With yo:
```sh
$ yo trails:trailpack trailpack-stripe
```

With npm:
```sh
$ npm install --save trailpack-stripe
```

## Configure

```js
// config/main.js
module.exports = {
  packs: [
    // ... other trailpacks
    require('trailpack-stripe')
  ]
}

// config/stripe
module.exports = {
  // Public Key
  public: process.env.STRIPE_PUBLIC || '<test_public_key>',
  // Secret Key
  secret: process.env.STRIPE_SECRET || '<test_secret_key>',
  // Validate Events with Stripe
  validate: process.env.STRIPE_VALIDATE || false
}

```

Then on Stripe

```
 In Account settings Webhooks
 Point webhook to <yourdomain>/stripe/webhook
 Enable whatever webhooks you desire

```

## Usage Examples
Get a Full list of API calls [here](https://stripe.com/docs/api)

```js
var const StripeService = this.app.services.StripeService

// Create a Customer
StripeService.customers.create({
  description: 'Customer for test@example.com',
  source: "tok_189fGA2eZvKYlo2C3pWnuPIc" // obtained with Stripe.js
}, (err, customer) => {
  // asynchronously called
  // Stripe will issue a webhook after this is called and add it to the database.
  // However, you may wish to interact with the customer before the webhook is delivered
  // In which case we can ignore the webhook by adding `lastStripeEvent` manually
  customer.lastStripeEvent = new Date(customer.created * 1000)
  this.app.services.FootprintService.create('Customer',customer)
  
})

// Retreive a Customer
StripeService.customers.retrieve(
  "cus_8jZwX4LTADczc2",
  (err, customer) => {
    // asynchronously called
  }
)
```

[npm-image]: https://img.shields.io/npm/v/trailpack-stripe.svg?style=flat-square
[npm-url]: https://npmjs.org/package/trailpack-stripe
[npm-download]: https://img.shields.io/npm/dt/trailpack-stripe.svg
[ci-image]: https://img.shields.io/travis/scott-wyatt/trailpack-stripe/master.svg?style=flat-square
[ci-url]: https://travis-ci.org/scott-wyatt/trailpack-stripe
[daviddm-image]: http://img.shields.io/david/scott-wyatt/trailpack-stripe.svg?style=flat-square
[daviddm-url]: https://david-dm.org/scott-wyatt/trailpack-stripe
[codeclimate-image]: https://img.shields.io/codeclimate/github/scott-wyatt/trailpack-stripe.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/scott-wyatt/trailpack-stripe

