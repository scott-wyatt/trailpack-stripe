'use strict'
/* global describe, it */

const assert = require('assert')

describe('Product Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Product'])
  })
})
