'use strict'
/* global describe, it */

const assert = require('assert')

describe('Recipient Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Recipient'])
  })
})
