const ae3 = require("ae3");

/**
 * https://ndss.ndmsystems.com/documentation#dialback-callback
 */
const TcpConnect = ae3.net.tcp.connect;
const TransferCreateBufferUtf8 = ae3.Transfer.createBufferUtf8;
const SslWrapClient = ae3.net.ssl.wrapClient;
const FormatSprintf = Format.sprintf;
const HttpReplyParser = ae3.web.HttpReplyParser;
const SslUnwrap = ae3.net.ssl.unwrap;
const SslWrapServer = ae3.net.ssl.wrapServer;
const HttpServerParser = ae3.web.HttpServerParser;

const TUNNEL_BY_SERVER_PORT = {}; {
	/** tunnel is raw, tunnel data is tls **/
	[443,5083,5443,8083,8443,65083]
		.reduce(function(r,x){ 
			r[x] = "raw"; 
			return r; 
		},TUNNEL_BY_SERVER_PORT)
	;

	/** tunnel is tls, tunnel data is raw **/
	[0,80,81,280,591,777,5080,8080,8090,65080]
		.reduce(function(r,x){ 
			r[x] = "tls"; 
			return r; 
		},TUNNEL_BY_SERVER_PORT)
	;
}

const CONNECT_CONFIGURATION = {
	connectTimeout : 5000,
	reuseTimeout : 5000,
	reuseBuffer : 32,
	optionFastRead : true,
	optionClient : true
};

const HTTP_CONFIGURATION = {
	factory : "HTTP",
	ignoreTargetPort : true,
	reverseProxied : true,
	ifModifiedSince : "before"
};

const HTTPS_CONFIGURATION = {
	factory : "HTTPS",
	ignoreTargetPort : true,
	reverseProxied : true,
	ifModifiedSince : "before"
};




const CallbackDialback = module.exports = ae3.Class.create(
	"CallbackDialback",
	require("./../AbstractCallback"),
	function(args){
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
		this.clientAddress = args[9];
		this.handshakeData = args[10];
		return this;
	},
	{
		"prepareCallback" : {
			value : function(component){
				const override = component.client.overrideSettings;
				
				this.doCloudWrap = !override.terminateOnClient;
				
				switch(TUNNEL_BY_SERVER_PORT[this.tunnelType]){
				case "raw":
					if(override.forcePlainHandshake || (!this.handshakeData && override.allowPlainHandshake)){
						this.doClientWrap = false;
						this.doClientUnwrap = false;
						this.doServerWrap = true;
						return true;
					}
					if(!this.handshakeData && override.forceCertificateValidation){
						console.log(
							"ndm.client::CallbackDialback:prepareCallback: refused: no handshakeData, target: %s:%s", 
							this.targetAddr,
							this.targetPort
						);
						return 0x03;
					}
					this.doClientWrap = true;
					this.doClientUnwrap = true;
					this.doServerWrap = true;
					return true;
				case "tls":
					if(!this.handshakeData && override.forceCertificateValidation){
						console.log(
							"ndm.client::CallbackDialback:prepareCallback: refused: no handshakeData, target: %s:%s", 
							this.targetAddr,
							this.targetPort
						);
						return 0x03;
					}
					this.doClientWrap = true;
					this.doClientUnwrap = false;
					this.doServerWrap = false;
					return true;
				}
				console.log(
					"ndm.client::CallbackDialback:prepareCallback: refused: tunnelType: %s, target: %s:%s",
					this.tunnelType, 
					this.targetAddr,
					this.targetPort
				);
				return 0x64;
			}
		},
		"executeCallback" : {
			value : function(component){
				console.log("ndm.client::CallbackDialback:executeCallback: connecting, %s", Format.jsObject(this));
				TcpConnect(
					this.targetAddr, 
					this.targetPort, 
					this.connectCallback.bind(this), 
					CONNECT_CONFIGURATION
				);
			}
		},
		"connectCallback" : {
			value : function(socket){
				if(!socket){
					console.log("ndm.client::CallbackDialback:connectCallback: tcp connect failed: %s:%s", this.targetAddr, this.targetPort);
					return;
				}
				
				console.log("ndm.client::CallbackDialback:connectCallback: tcp connected, %s:%s %s", this.targetAddr, this.targetPort, this.tunnelType);

				if(this.doClientWrap){
					console.log("ndm.client::CallbackDialback:connectCallback: wrap client socket (TLS), tunnelType: %s, %s", this.tunnelType, this.socket);
					socket = SslWrapClient(socket, null, this.targetAddr, this.targetPort, null);
				}

				const output = FormatSprintf(
					"GET /%s HTTP/1.1\r\n" +
					"Host: %s\r\n" +
					"Connection: Upgrade\r\n" + 
					"Upgrade: ndm-tunnel\r\n" +
					"Content-Length: 0\r\n" +
					"X-Session-Host: %s.%s\r\n" +
					"X-Session-Token: %s\r\n" +
					"%s" +
					"\r\n",
					this.targetPath,
					this.targetAddress,
					this.anchorName,
					this.domainName,
					this.sessionToken,
					this.doCloudWrap ? "X-Server-Tls: true\r\n" : ""
				);

				const parser = new HttpReplyParser();
				parser.callback = this.replyCallback.bind(this);
				socket.source.connectTarget(parser);
				
				socket.target.absorbBuffer(TransferCreateBufferUtf8(output));
				socket.target.force();
				
				this.socket = socket;
				
				console.log("ndm.client::CallbackDialback:connectCallback: request sent: socket: %s, length: %s", socket, output.length);
				return;
			}
		},
		"replyCallback" : {
			value : function(reply){
				if(!reply){
					console.log("ndm.client::CallbackDialback:replyCallback: no reply");
					this.socket.close();
					return;
				}
				switch(reply.code){
				case 101:

					if(this.doCloudWrap && reply.attributes["X-Server-Tls"]){
						
						console.log("ndm.client::CallbackDialback:replyCallback: switch protocol, use cloud wrap, reply: %s, %s", Format.jsDescribe(reply), this.socket);
						
					}else{
						
						console.log("ndm.client::CallbackDialback:replyCallback: switch protocol, reply: %s, %s", Format.jsDescribe(reply), this.socket);
						
						if(this.doClientUnwrap){
							console.log("ndm.client::CallbackDialback:replyCallback: unwrap client socket (TLS), tunnelType: %s, %s", this.tunnelType, this.socket);
							this.socket = SslUnwrap(this.socket);
						}
						
						if(this.doServerWrap){
							console.log("ndm.client::CallbackDialback:replyCallback: wrap server socket (TLS), tunnelType: %s, %s", this.tunnelType, this.socket);
							this.socket = SslWrapServer(//
								this.socket, //
								// todo: move to execute "once"?
								ae3.net.ssl.getDomainStore(//
									this.anchorName + "." + this.domainName, //
									CallbackDialback.PROTOCOLS, //
									CallbackDialback.CIPHERS//
								)//
							);
						}
						
					}
					
					this.server = new HttpServerParser( //
							this.socket, //
							this.requestCallback.bind(this), //
							this.doServerWrap, //
							this.doServerWrap ? HTTPS_CONFIGURATION : HTTP_CONFIGURATION //
					);
					console.log("ndm.client::CallbackDialback:replyCallback: http server connected, %s", this.server);
					return;
				}
				console.log("ndm.client::CallbackDialback:replyCallback: reply: %s", Format.jsDescribe(reply));
				this.socket.close();
				return;
			}
		},
		"requestCallback" : {
			value : function(query){
				if(query && this.clientAddress) {
					query = query.addAttribute("X-Forwarded-For", this.clientAddress);
					query = query.addAttribute("X-Debug", "through ndm.client::uhp::dialback");
				}
				console.log("ndm.client::CallbackDialback:requestCallback: web request: %s", Format.jsDescribe(query));
				return ae3.web.WebInterface.dispatch(query);
			}
		},
	},
	{
		"PROTOCOLS" : {
			value : [
				"TLSv1.3",
				"TLSv1.2",
				"TLSv1.1",
				"TLSv1",
				// "SSLv3",
				// "SSLv2Hello",
			]
		},
		"CIPHERS" : {
			value : [ 
				// "SSL_RSA_WITH_RC4_128_MD5",
				// "SSL_RSA_WITH_RC4_128_SHA",
				// "SSL_RSA_EXPORT_WITH_RC4_40_MD5",
				// "SSL_RSA_EXPORT_WITH_DES40_CBC_SHA"
				
				// "TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384", // RSA key only
				"TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
				"TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384",
				"TLS_RSA_WITH_AES_256_CBC_SHA256",
				// "TLS_ECDH_ECDSA_WITH_AES_256_CBC_SHA384", // RSA key only
				"TLS_ECDH_RSA_WITH_AES_256_CBC_SHA384",
				
				// "TLS_DHE_RSA_WITH_AES_256_CBC_SHA256", // insecure
				// "TLS_DHE_DSS_WITH_AES_256_CBC_SHA256", // insecure
				
				// "TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA", // RSA key only
				"TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA",
				// "TLS_ECDH_ECDSA_WITH_AES_256_CBC_SHA", // RSA key only
				"TLS_ECDH_RSA_WITH_AES_256_CBC_SHA",
				"TLS_RSA_WITH_AES_256_GCM_SHA384",
				// "TLS_RSA_WITH_AES_256_CBC_SHA", // blocks FS with IE, disabled until SERVER_ORDER in jdk8
				
				"TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256",
				// "TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA", // RSA key only
				"TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA",
				"TLS_RSA_WITH_AES_128_CBC_SHA256",
				"TLS_RSA_WITH_AES_128_GCM_SHA256",
				// "TLS_ECDH_ECDSA_WITH_AES_128_CBC_SHA",  // RSA key only
				"TLS_ECDH_RSA_WITH_AES_128_CBC_SHA",
				// "TLS_RSA_WITH_AES_128_CBC_SHA", // IE8-10 prefers it otherwise

				// "TLS_DHE_RSA_WITH_AES_256_CBC_SHA", // old OpenSSL - insecure
				// "TLS_DHE_DSS_WITH_3DES_EDE_CBC_SHA", // IE - DSS key - insecure and no DSS key
				
				// "TLS_RSA_WITH_3DES_EDE_CBC_SHA", // 112 bit, for IE8/XP, makes others choose it, disabled until SERVER_ORDER in jdk8
				// "SSL_RSA_WITH_3DES_EDE_CBC_SHA", // 112 bit, for IE8/XP, makes others choose it, disabled until SERVER_ORDER in jdk8
				
				// "TLS_ECDHE_ECDSA_WITH_3DES_EDE_CBC_SHA", // RSA key only
				// "TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA", // obsolete
				
				// "TLS_DHE_RSA_WITH_AES_128_CBC_SHA", // insecure
				
				// "TLS_DHE_RSA_WITH_3DES_EDE_CBC_SHA", // insecure: Android2, OpenSSL0.9, Safari5 
				// "SSL_DHE_RSA_WITH_3DES_EDE_CBC_SHA", // insecure: Android2, OpenSSL0.9, Safari5 
			]
		}
	}
);
