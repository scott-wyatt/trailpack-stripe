# trailpack-stripe

[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Code Climate][codeclimate-image]][codeclimate-url]

Stripe API Trailpack for Trails

Handles and validates Stripe Webhooks. 
Stores Stripe event models.  
Makes call via Stripe API.
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
```

[npm-image]: https://img.shields.io/npm/v/trailpack-stripe.svg?style=flat-square
[npm-url]: https://npmjs.org/package/trailpack-stripe
[ci-image]: https://img.shields.io/travis/scott-wyatt/trailpack-stripe/master.svg?style=flat-square
[ci-url]: https://travis-ci.org/scott-wyatt/trailpack-stripe
[daviddm-image]: http://img.shields.io/david/scott-wyatt/trailpack-stripe.svg?style=flat-square
[daviddm-url]: https://david-dm.org/scott-wyatt/trailpack-stripe
[codeclimate-image]: https://img.shields.io/codeclimate/github/scott-wyatt/trailpack-stripe.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/scott-wyatt/trailpack-stripe

