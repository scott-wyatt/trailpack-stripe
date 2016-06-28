'use strict'
/* global describe, it */

const assert = require('assert')

describe('Dispute Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Dispute'])
  })
})
