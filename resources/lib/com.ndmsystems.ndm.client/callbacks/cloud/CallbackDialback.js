const ae3 = require('ae3');

const CallbackDialback = module.exports = ae3.Class.create(
	"CallbackDialback",
	require("./../AbstractCallback"),
	function CallbackDialback(args){
		this.serviceName = args[1];
		this.anchorName = args[2];
		this.domainName = args[3];
		this.targetAddr = args[4];
		this.targetPort = args[5] | 0;
		this.targetPath = args[6];
		this.tunnelType = args[7] | 0;
		this.sessionToken = args[8];
		if(!this.sessionToken){
			return null;
		}
		return this;
	},
	{
		"requestCallback" : {
			value : function(query){
				console.log("ndm.client:callback:dialback: web request: %s", Format.jsDescribe(query));
				// ae3.web.WebInterface.dispatch(query);
			}
		},
		"replyCallback" : {
			value : function(reply){
				if(!reply){
					console.log("ndm.client:callback:dialback: no reply");
					this.socket.close();
					return;
				}
				switch(reply.code){
				case 101: {
					console.log("ndm.client:callback:dialback: switch protocol, reply: %s", Format.jsDescribe(reply));
					this.server = new ae3.web.HttpServerParser(this.socket, this.requestCallback.bind(this), (this.tunnelType % 1000) === 443, {});
					return;
				}
				}
				console.log("ndm.client:callback:dialback: reply: %s", Format.jsDescribe(reply));
				this.socket.close();
				return;
			}
		},
		"connectCallback" : {
			value : function(socket){
				if(!socket){
					console.log("ndm.client:callback:dialback: connect failed: %s:%s", this.targetAddr, this.targetPort + '');
					return;
				}
				if(this.tunnelType !== 443){
					socket = ae3.net.ssl.wrapClient(socket, null, this.targetAddr, this.targetPort, null);
				}
				var output = '', key;
				$output(output){
					= 'GET /'; = this.targetPath; = ' HTTP/1.1\r\n';
					= 'Host: '; = this.targetAddress; = '\r\n';
					= 'Connection: Upgrade\r\n';
					= 'Upgrade: ndm-tunnel\r\n';
					= 'Content-Length: 0\r\n';
					= 'X-Session-Token: '; = this.sessionToken; = '\r\n';
					= '\r\n';
				}

				const parser = new ae3.web.HttpReplyParser();
				parser.callback = this.replyCallback.bind(this);
				socket.source.connectTarget(parser);
				
				socket.target.absorbBuffer(ae3.Transfer.createBufferUtf8(output));
				socket.target.force();
				this.socket = socket;
				console.log("ndm.client:callback:dialback: request sent: socket: %s, length: %s", socket, output.length + '');
				return;
			}
		},
		"executeCallback" : {
			value : function(client){
				console.log(">>>>>> ndm.client:callback:cloud/dialback: connecting, %s", Format.jsObject(this));
				ae3.net.tcp.connect(this.targetAddr, this.targetPort, this.connectCallback.bind(this), {
					timeout : 5000,
					reuseTimeout : 5000,
					reuseBuffer : 32,
					optionFastRead : true,
					optionClient : true
				});
			}
		},
	}
);

