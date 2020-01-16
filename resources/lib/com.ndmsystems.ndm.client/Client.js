/**
 * ******************************************************************************
 * ******************************************************************************
 * NDMC (Network Device Management Client) library.
 * ******************************************************************************
 * ******************************************************************************
 */



const http = require("http");
const ae3 = require('ae3');
const vfs = ae3.vfs;

const ClientRequest = require('./ClientRequest');


const DIGITS_ONLY_REGEXP = /\D/g;

/**
 * NDMC constructor
 */
function Client(folder, ndssHost, ndssPort, license, serviceKey, ddnsHost){
	if(!folder.isContainer()){
		if(!ndssHost || !ndssPort || !license || !serviceKey){
			throw "folder is not a container: "+folder;
		}
		if(!folder.doSetContainer()){
			throw "con't create container: "+folder;
		}
	}
	
	Object.defineProperties(this, {
		vfs : {
			value : folder
		},
		clientId : {
			value : folder.key,
			enumerable : true
		},
	});

	this.ndssHost		= ndssHost || folder.getContentAsText("ndssHost", '');
	this.ndssPort		= ndssPort || folder.getContentAsText("ndssPort", '');
	this.licenseNumber	= license || folder.getContentAsText("license", '');
	this.serviceKey		= serviceKey || folder.getContentAsText("serviceKey", '');
	this.ddnsHost		= ddnsHost || folder.getContentAsText("ddnsHost", '');
	
	if(!this.validateTagFormat(this.licenseNumber)){
		throw "Client['" + this.clientId + "'] Invalid license number: " + this.licenseNumber;
	}
	
	if(this.ddnsHost){
		ae3.web.WebInterface.localNameUpsert(this.ddnsHost, "ndmc-ddns-" + this.clientId);
	}
	
	return this;
}

/**
 * ******************************************************************************
 * ******************************************************************************
 * instance methods
 * ******************************************************************************
 * ******************************************************************************
 */




/**
 * Use .call(client, ...)
 */
function internPrepareRequest(){
	var request = new ClientRequest(this);
	internCheckRegister.call(this, request);
	// internCheckStats.call(this, request);
	return request;
}

/**
 * Use .call(client, ...)
 */
function internCheckRegister(clientRequest){
	var prev = this.vfs.getContentPrimitive("lastRegistered", null);
	if(!prev || prev.getTime() + 3550000 < Date.now()){
		internAppendRegister.call(this, clientRequest);
	}
	return true;
}

/**
 * Use .call(client, ...)
 */
function internCheckStats(clientRequest){
	const Stats = require('ae3.stats/Stats');
	var start = Stats.validateOrCreateStartKey(this.vfs.getContentPrimitive("lastExported"), false);
	var stats = Stats.listRuntimeSystemStats(start, 1000 + 1, false);
	if(!stats || !stats.length){
		return false;
	}
	var next = stats && stats.length > limit && stats[stats.length-1].id;

	// console.log(">>>>>>> " + Format.jsDescribe(stats));
	throw "CHECKPOINT";
	
	var data = {};
	
	var body = '';
	$output(body){
		%><stats layout="table"><%
			%><columns><%
			%></columns><%
		%></stats><%
	}
	
	clientRequest.append({
		name		: "export",
		path		: "/dumpStats",
		get			: {
			license		: this.licenseNumber,
		},
		body : body,
		onSuccess	: (function exportSuccess(map){
			this.vfs.setContentPublicTreePrimitive("lastExported", next);
		}).bind(this),
		onError	: (function exportSuccess(code, text){
			console.error("ndm.client '%s': Stats dump is not supported by server, code=%s", this.clientId, code);
		}).bind(this),
	});
	return true;
}

/**
 * Use .call(client, ...)
 */
function internAppendRegister(clientRequest, reason){
	clientRequest.append({
		name		: "register",
		path		: "/register",
		get			: {
			license		: this.licenseNumber,
			origin		: 'device',
			reason		: reason || 'periodic',
			version		: ___ECMA_IMPL_VERSION_STRING___,
			fw			: ___ECMA_IMPL_VERSION_STRING___,
			sn			: ___ECMA_IMPL_HOST_NAME___,
			v			: 2,
			address		: ae3.net.localAddress,
			xns			: ['ub1', 'ut1']
		},
		onSuccess	: (function(map){
			// const address = map.address;
			const notify = map.notify;
			var n, id;
			console.log("ndm.client '%s': registration result OK, got notifications: %s", this.clientId, (!!notify));
			if(notify){
				for(n of Array(notify)){
					console.log("ndm.client '%s': got notification: %s", this.clientId, Format.jsObjectReadable(n));
					id = n.id;
					if(id === 'ub1'){
						this.ddnsName = n.name;
						this.ddnsZone = n.domain;
						this.ddnsAddr = n.address;
						id = this.ddnsHost;
						if(this.ddnsName && this.ddnsZone){
							this.ddnsHost = this.ddnsName + '.' + this.ddnsZone;
							ae3.web.WebInterface.localNameUpsert(this.ddnsHost, "ndmc-ddns-" + this.clientId);
							if(id !== this.ddnsHost){
								this.vfs.setContentPublicTreePrimitive("ddnsHost", this.ddnsHost);
								if(id){
									ae3.web.WebInterface.localNameRemove(id, "ndmc-ddns-" + this.clientId);
								}
							}
						}else{
							if(id){
								this.ddnsHost = null;
								this.vfs.setContentUndefined("ddnsHost");
								ae3.web.WebInterface.localNameRemove(id, "ndmc-ddns-" + this.clientId);
							}
						}
					}else//
					if(id === 'ut1'){
						this.ndnsAlias = Format.hexAsBinary(n.alias);
						this.ndnsSecret = Format.hexAsBinary(n.secret);
						this.ndnsSettings = n.settings;
						id = this.ndmpHost;
						if(n.alias && n.settings && n.settings.domain){
							this.ndmpZone = n.settings.domain;
							this.ndmpHost = n.alias.substring(0, 24) + '.' + this.ndmpZone;
							console.log("ndm.client '%s': 'ut1' notification handler, system name: %s", this.clientId, this.ndmpHost);
						}
						if(id !== this.ndmpHost){
							if(this.ndmpHost){
								this.vfs.setContentPublicTreePrimitive("ndmpHost", this.ndmpHost);
								ae3.web.WebInterface.localNameUpsert(this.ndmpHost, "ndmc-ndmp-" + this.clientId);
							}else{
								this.vfs.setContentUndefined("ndmpHost");
								ae3.web.WebInterface.localNameRemove(id, "ndmc-ddns-" + this.clientId);
							}
						}
						const uClient = this.udpCloudClient;
						if(uClient){
							if(uClient.secret != this.ndnsSecret){
								uClient.destroy();
								(this.udpCloudClient = new this.UdpCloudClient(this, this.ndnsAlias.slice(0, 12), this.ndnsSecret, 0)).start();
							}
						}else{
							(this.udpCloudClient = new this.UdpCloudClient(this, this.ndnsAlias.slice(0, 12), this.ndnsSecret, 0)).start();
						}
					}
				}
			}
			
			this.vfs.setContentPublicTreePrimitive("lastRegistered", new Date());
		}).bind(this),
		onError	: (function exportSuccess(code, text){
			console.error("ndm.client '%s':Registration failed, code=%s", this.clientId, code);
		}).bind(this),
	});
}








Object.defineProperties(Client.prototype, {
	Client : {
		value : Client
	},
	UdpCloudClient : {
		value : require('./UdpCloudClient')
	},
	validateTagFormat : {
		value : function validateTagFormat(licenseNumber){
			return licenseNumber.replace(DIGITS_ONLY_REGEXP, "").length === 15;
		}
	},
	next : {
		value : function(console){
			var now = Date.now();
			var prev = this.vfs.getContentPrimitive("lastRegistered", null);
			if(!prev){
				return now;
			}
			return Math.max(now, prev.getTime() + 3600000);
		}
	},
	run : {
		value : function(){
			if(this.started !== true){
				return;
			}
			var request = internPrepareRequest.call(this);
			/**
			 * it will do nothing if nothing is pending
			 */
			return request.launch();
		}
	},
	doRegister : {
		value : function(reason){
			if(this.started !== true){
				return;
			}
			var request = internPrepareRequest.call(this);
			/**
			 * will overwrite 'register' if pending
			 */
			internAppendRegister.call(this, request, reason);
			return request.launch();
		}
	},
	start : {
		value : function(){
			if(this.started === true){
				return;
			}
			this.started = true;
			const uClient = this.udpCloudClient;
			if(uClient){
				this.udpCloudClient = null;
				uClient.destroy();
			}

			setTimeout((function(){
				this.doRegister('boot');
			}).bind(this), 100);
		}
	},
	destroy : {
		value : function(){
			if(this.started === false){
				return;
			}
			this.started = false;
			const uClient = this.udpCloudClient;
			if(uClient){
				this.udpCloudClient = null;
				uClient.destroy();
			}
		}
	},
	equals : {
		value : function(that){
			if(this.ndssHost != that.ndssHost){
				return false;
			}
			if(this.ndssPort != that.ndssPort){
				return false;
			}
			if(this.licenseNumber != that.licenseNumber){
				return false;
			}
			if(this.serviceKey != that.serviceKey){
				return false;
			}
			return true;
		}
	},
	ndssUrl : {
		get : function buildNdssUrl(){
			var port = Number(this.ndssPort);
			return ((port == 80 || port == 8080 || port == 17080) ? "http://" : "https://") + this.ndssHost + ':' + (port || 443);
		}
	},
	ndmpKeyPair :{
		value : function(force){
			//  try use existing, if any
			if(!force){
				// const ndmpKeyPublic = this.vfs.getContentAsBinary("ndmpKeyPublic");
				const ndmpKeyPublic = this.vfs.relativeBinary("ndmpKeyPublic");
				// const ndmpKeyPrivate = this.vfs.getContentAsBinary("ndmpKeyPrivate");
				const ndmpKeyPrivate = this.vfs.relativeBinary("ndmpKeyPrivate");
				if(ndmpKeyPublic && ndmpKeyPrivate){
					console.log("ndm.client '%s': ndmp: using existing EC pair", this.clientId);

					const KeyFactory = require("java.class/java.security.KeyFactory");
					const keyFactory = KeyFactory.getInstance("EC");
					
					const X509EncodedKeySpec = require("java.class/java.security.spec.X509EncodedKeySpec");
					const publicKeySpec = new X509EncodedKeySpec(ndmpKeyPublic.nextDirectArray());
					const publicKey = keyFactory.generatePublic(publicKeySpec);
					
					console.log("ndm.client '%s': ndmp: existing EC pair's public: %s", this.clientId, publicKey);
					
					const PKCS8EncodedKeySpec = require("java.class/java.security.spec.PKCS8EncodedKeySpec");
					const privateKeySpec = new PKCS8EncodedKeySpec(ndmpKeyPrivate.nextDirectArray());
					const privateKey = keyFactory.generatePrivate(privateKeySpec);
					
					const KeyPair = require("java.class/java.security.KeyPair");
					return new KeyPair(publicKey, privateKey);
					
				}
			}
			
			// generate & store
			{
				
				/**
				 * generate
				 */
				console.log("ndm.client '%s': ndmp: generating new EC pair", this.clientId);
				
				const ECGenParameterSpec = require("java.class/java.security.spec.ECGenParameterSpec");
				const kpgparams = new ECGenParameterSpec("secp256r1");
				
				const KeyPairGenerator = require("java.class/java.security.KeyPairGenerator");
				const g = KeyPairGenerator.getInstance("EC");
				g.initialize(kpgparams);
				
				const pair = g.generateKeyPair();
				console.log("ndm.client '%s': ndmp: new EC pair's public: %s", this.clientId, pair.getPublic());
				
				/**
				 * store
				 */
				
				const X509EncodedKeySpec = require("java.class/java.security.spec.X509EncodedKeySpec");
				const x509EncodedKeySpec = new X509EncodedKeySpec(pair.getPublic().getEncoded());

				const PKCS8EncodedKeySpec = require("java.class/java.security.spec.PKCS8EncodedKeySpec");
				const pkcs8EncodedKeySpec = new PKCS8EncodedKeySpec(pair.getPrivate().getEncoded());
	
				this.vfs.setContentPublicTreeBinary("ndmpKeyPublic", ae3.Transfer.createCopier(x509EncodedKeySpec.getEncoded()));
				this.vfs.setContentPublicTreeBinary("ndmpKeyPrivate", ae3.Transfer.createCopier(pkcs8EncodedKeySpec.getEncoded()));
				
				return pair;
			}
		}
	},
	ndmpPrepareValidationLink : {
		value : function(webShareName, forceNew){
			const pair = this.ndmpKeyPair(forceNew);
			if(!pair){
				throw "NDMP EC KeyPair is not available!";
			}
			const collector = ae3.Transfer.createCollector();
			collector.printByte(7);
			collector.printBinary(this.ndnsAlias);
			collector.printBytes(pair.getPublic().encoded);
			return "https://" + this.ndmpZone + "/#link:" + Format.binaryAsBase58(collector.toBinary());
		}
	},
	ndmpInvalidateLink : {
		value : function(force){
			if(!force){
				return false;
			}
			this.vfs.setContentUndefined("ndmpKeyPublic");
			this.vfs.setContentUndefined("ndmpKeyPrivate");
			return true;
		}
	},
	toString : {
		value : function(){
			return "[NdmcClient " + Format.jsString(this.licenseNumber) + "/" + Format.jsString(this.clientId)+"]";
		}
	},
	auth : {
		get : function(){
			return this.serviceKey
				?	{
					get : {
						__auth_type : "ndss3",
						license : this.licenseNumber
					},
					post : {
						pw : this.serviceKey
					}
				}
				:	{
					get : {
						license : this.licenseNumber
					}
				}
			;
		}
	}
});



/**
 * ******************************************************************************
 * ******************************************************************************
 * static API
 * ******************************************************************************
 * ******************************************************************************
 */

/**
 * function filterDescriptors(file) { return file.key.endsWith(".json"); }
 * 
 * function mapFileToDescriptor(file) { return JSON.parse(file); }
 * 
 * function reduceFilesToDescriptorMap(targetMap, file) {
 * targetMap[file.key.substring(0, file.key.length - 5)] = JSON.parse(file);
 * return targetMap; }
 * 
 * 
 */


Object.defineProperties(Client, {
	validateTagFormat : {
		value : function validateTagFormat(licenseNumber){
			return licenseNumber.replace(DIGITS_ONLY_REGEXP, "").length === 15;
		}
	},
	storeRaw : {
		value : function(vfsClient, clientId, ndssHost, ndssPort, licenseNumber, serviceKey){
			const txn = vfs.createTransaction();
			try{
				if(ndssHost !== undefined){
					vfsClient.setContentPublicTreePrimitive("ndssHost", String(ndssHost));
				}
				if(ndssPort !== undefined){
					vfsClient.setContentPublicTreePrimitive("ndssPort", Number(ndssPort));
				}
				if(licenseNumber !== undefined){
					vfsClient.setContentPublicTreePrimitive("license", String(licenseNumber));
				}
				if(serviceKey !== undefined){
					vfsClient.setContentPublicTreePrimitive("serviceKey", String(serviceKey));
				}
				return true;
			}catch(e){
				txn && (txn.cancel(), txn = null);
				throw e;
			}finally{
				txn && txn.commit();
			}
		}
	}
});


function RobotClient(ndssHost, ndssPort, robotPass){
	this.ndssHost = ndssHost;
	this.ndssPort = ndssPort;
	this.auth = {
		get : {
			__auth_type : "ndss-client"
		},
		post : {
			pass : robotPass
		}
	};
	return this;
}
/**
 * no need yet
 */
// RobotClient.prototype = Client.prototype;

function createRobotClientRequest(ndssHost, ndssPort, robotPass){
	if(!ndssHost){
		throw new Error("ndssHost in undefined!");
	}
	if(!ndssPort){
		throw new Error("ndssPort in undefined!");
	}
	if(!robotPass){
		throw new Error("robotPass in undefined!");
	}
	return new ClientRequest(new RobotClient(ndssHost, ndssPort, robotPass));
}
Client.createRobotClientRequest = createRobotClientRequest;


function DeviceClient(ndssHost, ndssPort, licenseNumber, serviceKey){
	if(!ndssHost){
		throw new Error("ndssHost in undefined!");
	}
	if(!ndssPort){
		throw new Error("ndssPort in undefined!");
	}
	if(!licenseNumber){
		throw new Error("licenseNumber in undefined!");
	}
	this.ndssHost = ndssHost;
	this.ndssPort = ndssPort;
	this.auth = {
		get : {
			__auth_type : "ndss3",
			license : licenseNumber
		},
		post : {
			pw : serviceKey
		}
	};
	return this;
}
/**
 * no need yet
 */
// DeviceClient.prototype = Client.prototype;



function createDeviceClientRequest(ndssHost, ndssPort, licenseNumber, serviceKey){
	return new ClientRequest(new DeviceClient(ndssHost, ndssPort, licenseNumber, serviceKey));
}
Client.createDeviceClientRequest = createDeviceClientRequest;

function Epoch2Client(ndssHost, ndssPort, licenseNumber){
	this.ndssHost = ndssHost;
	this.ndssPort = ndssPort;
	this.auth = {
		get : {
			license : licenseNumber
		}
	};
	return this;
}
/**
 * no need yet
 */
// Epoch2Client.prototype = Client.prototype;



function createEpoch2ClientRequest(ndssHost, ndssPort, licenseNumber){
	return new ClientRequest(new Epoch2Client(ndssHost, ndssPort, licenseNumber));
}
Client.createEpoch2ClientRequest = createEpoch2ClientRequest;


/**
 * ******************************************************************************
 * ******************************************************************************
 * module interface is our constructor
 * ******************************************************************************
 * ******************************************************************************
 */
module.exports = Client;