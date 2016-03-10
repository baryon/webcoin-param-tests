var Blockchain = require('blockchain-spv')
var levelup = require('levelup')
var memdown = require('memdown')

module.exports = function (params, test) {
  test('create SPV Blockchain', (t) => {
    var db = levelup(Math.random().toString(36), { db: memdown })
    try {
      var chain = new Blockchain(params.blockchain, db)
      t.pass('did not throw')
      t.ok(chain, 'Blockchain created')
    } catch (err) {
      t.error(err, 'error thrown')
    }
    t.end()
  })
}
