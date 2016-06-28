'use strict'
/* global describe, it */

const assert = require('assert')

describe('Discount Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Discount'])
  })
})
