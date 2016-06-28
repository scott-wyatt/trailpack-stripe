'use strict'
/* global describe, it */

const assert = require('assert')

describe('Invoiceitem Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Invoiceitem'])
  })
})
