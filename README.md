# trailpack-stripe

[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Code Climate][codeclimate-image]][codeclimate-url]

Stripe API Trailpack for Trails

Handles and validates Stripe Webhooks.  It checks the time the webhooks were received and keeps the DB in sync.

Optionally, it can perform `Round Trip` validation of every Stripe webhook that hits the endpoint.

Stores Stripe event models with lifecyle handler for after a Stripe event occurs.  

Makes call via Stripe API using a Stripe Service.

Supports waterline and sequelize.

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

[npm-image]: https://img.shields.io/npm/v/trailpack-stripe.svg?style=flat-square
[npm-url]: https://npmjs.org/package/trailpack-stripe
[ci-image]: https://img.shields.io/travis/scott-wyatt/trailpack-stripe/master.svg?style=flat-square
[ci-url]: https://travis-ci.org/scott-wyatt/trailpack-stripe
[daviddm-image]: http://img.shields.io/david/scott-wyatt/trailpack-stripe.svg?style=flat-square
[daviddm-url]: https://david-dm.org/scott-wyatt/trailpack-stripe
[codeclimate-image]: https://img.shields.io/codeclimate/github/scott-wyatt/trailpack-stripe.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/scott-wyatt/trailpack-stripe

