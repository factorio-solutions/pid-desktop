var net = require('net');

var client = new net.Socket();
client.connect(5060, process.argv[2], function() { //'192.168.136.127'
	console.log('Connected');
	client.write('Hello, server! Love, Client.');
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	// client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});
