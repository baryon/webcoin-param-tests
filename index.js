function all (params, test) {
  all.blockchain(params.blockchain, test)
  all.net(params.net, test)
}
all.blockchain = require('./lib/blockchain.js')
all.net = require('./lib/net.js')

module.exports = all
