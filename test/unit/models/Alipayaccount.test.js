'use strict'
/* global describe, it */

const assert = require('assert')

describe('Alipayaccount Model', () => {
  it('should exist', () => {
    assert(global.app.api.models['Alipayaccount'])
    assert(global.app.orm['Alipayaccount'])
  })
})
