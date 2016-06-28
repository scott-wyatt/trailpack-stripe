'use strict'
/* global describe, it */

const assert = require('assert')

describe('Charge Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Charge'])
  })
})
