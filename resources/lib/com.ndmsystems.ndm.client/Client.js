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

const MakeRsstDomainFn = require("java.class/ru.myx.ae3.state.RemoteServiceStateSAPI").makeRemoteServiceStateDomain;

const ClientRequest = require('./ClientRequest');


const DIGITS_ONLY_REGEXP = /\D/g;


const NATIVE_IMPL = (function(){
	try{
		return require("java.class/com.ndmsystems.ndmc.NdmLicenseStatic");
	}catch(e){
		return {};
	}
})();


const Client = module.exports = ae3.Class.create(
	"Client",
	undefined,
	function Client(folder, ndssHost, license, serviceKey){
		if(!folder.isContainer()){
			if(!ndssHost || !license || !serviceKey){
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
			stateDomain : {
				value : MakeRsstDomainFn(null)
			},
			components : {
				value : {
					"base"  : require("./components/base/ComponentBase").newInstance(this),
					"cloud" : require("./components/cloud/ComponentCloud").newInstance(this),
					"ndmp"  : require("./components/ndmp/ComponentNdmp").newInstance(this),
					"ndns"  : require("./components/ndns/ComponentNdns").newInstance(this),
				}
			}
		});
		
		
		Object.defineProperties(this, {
			notificationHandlers : {
				value : Object.values(this.components).reduce(function(previousValue, currentValue){
					if(currentValue){
						for(let xns of (currentValue.acceptXmlNotifications || [])){
							(previousValue[xns] ||= []).push(currentValue);
						}
					}
					return previousValue;
				}, {})
			}
		});
		

		this.ndssHost		= ndssHost || folder.getContentAsText("ndssHost", "");
		this.licenseNumber	= license || folder.getContentAsText("license", "");
		this.serviceKey		= serviceKey || folder.getContentAsText("serviceKey", "");
		this.ndmpHost		= ""; // ddnsHost || folder.getContentAsText("ndmpHost", "");
		this.ddnsHost		= ""; // ddnsHost || folder.getContentAsText("ddnsHost", "");
		
		if(!this.validateLicenseFormat(this.licenseNumber)){
			throw "Client['" + this.clientId + "'] Invalid license number: " + this.licenseNumber;
		}
		
		console.log("ndm.client::Client::init: client object created, %s", this);

		return this;
	},
	{
		UdpCloudClient : {
			value : require('./UdpCloudClient')
		},
		validateLicenseFormat : {
			value : NATIVE_IMPL.validateLicenseFormat || function(licenseNumber){
				return licenseNumber.replace(DIGITS_ONLY_REGEXP, "").length === 15;
			}
		},
		next : {
			value : function(console){
				const now = Date.now();
				const prev = this.vfs.getContentPrimitive("lastRegistered", null);
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
			get : function(){
				return "https://" + this.ndssHost;
			}
		},
		toString : {
			value : function(){
				return "[NdmClient " + this.licenseNumber + "/" + this.clientId+"]";
			}
		},
		auth : {
			get : function(){
				return this.serviceKey
					?	{
						get : {
							__auth_type : "e4",
							license : this.licenseNumber
						},
						headers : {
							"Authorization" : "NDSS4 " + ae3.Transfer.createCopierUtf8(this.serviceKey).toStringBase64()
						},
						post : {
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
	},
	{
		validateLicenseFormat : {
			value : function(licenseNumber){
				return licenseNumber.replace(DIGITS_ONLY_REGEXP, "").length === 15;
			}
		},
		storeRaw : {
			value : function(vfsClient, clientId, ndssHost, licenseNumber, serviceKey){
				const txn = vfs.createTransaction();
				try{
					if(ndssHost !== undefined){
						vfsClient.setContentPublicTreePrimitive("ndssHost", String(ndssHost));
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
		},
		createRobotClientRequest : {
			value : function(ndssHost, robotPass){
				if(!ndssHost){
					throw new Error("ndssHost in undefined!");
				}
				if(!robotPass){
					throw new Error("robotPass in undefined!");
				}
				return new ClientRequest(new RobotClient(ndssHost, robotPass));
			}
		},
		createDeviceClientRequest : {
			value : function(ndssHost, licenseNumber, serviceKey){
				return new ClientRequest(new DeviceClient(ndssHost, licenseNumber, serviceKey));
			}
		}
	}
);




/**
 * Use .call(client, ...)
 */
function internPrepareRequest(){
	const request = new ClientRequest(this);
	
	/** check pending registration **/
	const prev = this.vfs.getContentPrimitive("lastRegistered", null);
	if(!prev || prev.getTime() + 3550000 < Date.now()){
		internAppendRegister.call(this, clientRequest);
	}
	
	// internCheckStats.call(this, request);
	return request;
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

	// console.log("ndm.client::Client::internCheckStats: " + Format.jsDescribe(stats));
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
		onSuccess	: (function(map){
			this.vfs.setContentPublicTreePrimitive("lastExported", next);
		}).bind(this),
		onError	: (function(code, text){
			console.error("ndm.client::Client::internCheckStats: '%s': Stats dump is not supported by server, code=%s", this.clientId, code);
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
			xns			: Object.keys(Object.values(this.components).reduce(function(previousValue, currentValue){
				if(currentValue){
					for(let xns of (currentValue.requestXmlNotifications || [])){
						previousValue[xns] = true;
					}
				}
				return previousValue;
			}, {}))
		},
		onSuccess	: (function(map){
			// const address = map.address;
			const notify = map.notify;
			var notification, handlers, handler, id;
			console.log("ndm.client::Client::register:onSuccess: '%s': registration OK, got notifications: %s", this.clientId, (!!notify));
			if(notify){
				for(notification of Array(notify)){
					console.log("ndm.client::Client::register:onSuccess: '%s': notification: %s", this.clientId, Format.jsObject(notification));
					id = notification.id;
					handlers = this.notificationHandlers[id];
					if(handlers){
						for(handler of Array(handlers)){
							handler.onXmlNotification(id, notification);
						}
					}
				}
			}
			
			this.vfs.setContentPublicTreePrimitive("lastRegistered", new Date());
		}).bind(this),
		onError	: (function(code, text){
			console.error("ndm.client::Client::register:onError: '%s': Registration failed, code=%s", this.clientId, code);
		}).bind(this),
	});
}






/**
 * ******************************************************************************
 * ******************************************************************************
 * static API
 * ******************************************************************************
 * ******************************************************************************
 */


const RobotClient = ae3.Class.create(
	"RobotClient",
	undefined,
	function(ndssHost, robotPass){
		this.ndssHost = ndssHost;
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
);


const DeviceClient = ae3.Class.create(
	"DeviceClient",
	undefined,
	function(ndssHost, licenseNumber, serviceKey){
		if(!ndssHost){
			throw new Error("ndssHost in undefined!");
		}
		if(!licenseNumber){
			throw new Error("licenseNumber in undefined!");
		}
		this.ndssHost = ndssHost;
		this.auth = {
			get : {
				__auth_type : "e4",
				license : licenseNumber
			},
			headers : {
				"Authorization" : "NDSS4 " + ae3.Transfer.createCopierUtf8(serviceKey).toStringBase64()
			},
			post : {
			}
		};
		return this;
	}
);
