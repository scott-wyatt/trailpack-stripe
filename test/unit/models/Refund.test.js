'use strict'
/* global describe, it */

const assert = require('assert')

describe('Refund Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Refund'])
  })
})
