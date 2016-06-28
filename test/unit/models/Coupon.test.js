'use strict'
/* global describe, it */

const assert = require('assert')

describe('Coupon Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Coupon'])
  })
})
