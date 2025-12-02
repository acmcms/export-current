/**
 * ******************************************************************************
 * ******************************************************************************
 * NDMC (Network Device Management Client) library.
 * ******************************************************************************
 * ******************************************************************************
 */


const ae3 = require("ae3");
const vfs = ae3.vfs;

const MakeRsstDomainFn = require("java.class/ru.myx.ae3.state.RemoteServiceStateSAPI").makeRemoteServiceStateDomain;

const ClientRequest = require("./ClientRequest");
const RequestBaseRegister = require("./components/base/RequestBaseRegister");


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
	function Client(folder, serviceSettings, overrideSettings){
		if(!folder.isContainer()){
			if(!serviceSettings){
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
			overrideSettings : {
				value : overrideSettings || {}
			}
		});

		Object.defineProperties(this, {
			components : {
				value : {
					"base"  : require("./components/base/ComponentBase").newInstance(this),
					"cloud" : require("./components/cloud/ComponentCloud").newInstance(this),
					"ndns"  : require("./components/ndns/ComponentNdns").newInstance(this),
					"ndmp"  : require("./components/ndmp/ComponentNdmp").newInstance(this),
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
		

		this.ndssHost		= serviceSettings?.host ?? serviceSettings?.ndssHost ?? folder.getContentAsText("ndssHost", "");
		this.licenseNumber	= serviceSettings?.key ?? serviceSettings?.license ?? folder.getContentAsText("license", "");
		this.serviceKey		= serviceSettings?.pass ?? serviceSettings?.serviceKey ?? folder.getContentAsText("serviceKey", "");
		this.hardwareId		= serviceSettings?.hwid ?? serviceSettings?.hardwareId ?? folder.getContentAsText("hardwareId", "ae3ndmc") ?? "ae3ndmc";
		this.ndmpHost		= ""; // ?? cache ?? // ddnsHost || folder.getContentAsText("ndmpHost", "");
		this.ddnsHost		= ""; // ?? cache ?? // ddnsHost || folder.getContentAsText("ddnsHost", "");
		
		if(this.serviceKey && this.licenseNumber && this.ndssHost){
			Object.defineProperty(this, "auth", {
				value : {
					"get" : {
						__auth_type : this.serviceKey ? "e4" : undefined,
						license : this.licenseNumber,
						version: ___ECMA_IMPL_VERSION_STRING___,
						fw: this.clientId + "@" + ___ECMA_IMPL_VERSION_STRING___,
						hw: this.hardwareId,
						sn: ___ECMA_IMPL_HOST_NAME___,
					},
					"headers" : {
						"Authorization" : "NDSS4 " + ae3.Transfer.createCopierUtf8(this.serviceKey).toStringBase64()
					},
					"post" : {
					}
				}
			});
		}
		
		if(!this.validateLicenseFormat(this.licenseNumber)){
			throw "Client['" + this.clientId + "'] Invalid license number: " + this.licenseNumber;
		}
		
		console.log("ndm.client::Client::init: client object created, %s, overrides: %s", this, Format.jsObject(this.overrideSettings));

		return this;
	},
	{
		UdpCloudClient : {
			value : require("./UdpCloudClient")
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
		createClientRequest : {
			value : function(){
				return internPrepareRequest.call(this);
			}
		},
		doRegister : {
			value : function(reason){
				if(this.started !== true){
					return;
				}
				const request = internPrepareRequest.call(this);
				/**
				 * will overwrite 'register' if pending
				 */
				RequestBaseRegister.append.call(this, request, reason);
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
					this.doRegister("boot");
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
			/**
			 * should be reset with actual map upon constructor return
			 */
			value : null
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
					txn?.commit();
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
		RequestBaseRegister.append.call(this, request);
	}
	
	// internCheckStats.call(this, clientRequest);
	return request;
}

/**
 * Use .call(client, ...)
 */
function internCheckStats(clientRequest){
	const Stats = require('ae3.stats/Stats');
	var start = Stats.validateOrCreateStartKey(this.vfs.getContentPrimitive("lastExported"), false);
	var stats = Stats.listRuntimeSystemStats(start, 1000 + 1, false);
	if(!stats?.length){
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
