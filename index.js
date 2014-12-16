var express    = require('express'),
    util       = require('util'),
    bodyParser = require('body-parser'),
    app        = express(),
    nodes      = {},
    threshold  = 2 * 60 * 1000; // 10 minutes

// nodes is a hash keyed by IP addresso

// cleanup process; run every 60 seconds to delete nodes older tahn threshold
(function cleanupNodes() {
  console.log('CLEANUP: cleaning up');
  var node, ip, now = Date.now();

  for( ip in nodes ) {
    node = nodes[ip];

    if ( node.datestamp < now - threshold ) {
      console.log('CLEANUP: zapping ' + ip);
      delete nodes[ip];
    }
  }

  setTimeout( cleanupNodes, 60000 );
})();

// set up body parser
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/nodes/:hostname', function( req, res ) {
  var hostname = req.params.hostname,
      data     = req.body.data,
      address  = req.connection.remoteAddress;

  console.log("Received node info for: " + address);

  nodes[address] = {
    datestamp: Date.now(),
    hostname:  hostname,
    data:      data
  };

  // ok, we got shit stored.
  res.send('ok');
});

app.get('/nodes', function( req, res ) {
  res.send(JSON.stringify(nodes));
});

app.delete('/nodes/:address', function( req, res ) {
  var address = req.params.address,
      n;

  for ( n in nodes ) {
    if ( n == address ) {
      delete nodes[n];
      break;
    }
  }

  res.send('ok');
});

var server = app.listen( 3000, function() {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
});
