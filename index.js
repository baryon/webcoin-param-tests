function all (params, test) {
  all.blockchain(params, test)
  all.net(params, test)
}
all.blockchain = require('./lib/blockchain.js')
all.net = require('./lib/net.js')

module.exports = all
