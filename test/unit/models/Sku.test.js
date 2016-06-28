'use strict'
/* global describe, it */

const assert = require('assert')

describe('Sku Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Sku'])
  })
})
