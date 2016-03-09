var tape = require('tape')
var Blockchain = require('blockchain-spv')
var levelup = require('levelup')
var memdown = require('memdown')

module.exports = function (params, test) {
  test = test || tape

  test('create SPV Blockchain', (t) => {
    var db = levelup(Math.random().toString(36), { db: memdown })
    var chain = new Blockchain(params, db)
    t.pass('did not throw')
    t.ok(chain, 'Blockchain created')
    t.end()
  })
}
