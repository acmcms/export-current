const ae3 = require("ae3");
const Secp256r1 = ae3.crypto.EllipticCurveSecp256r1;
const transferCreateCopier = ae3.Transfer.createCopier;

const CLIENT_ON_UPDATE_LINKING_XNS_FN = require("./ClientOnUpdateLinkingXnsFn");
const CLIENT_ON_UPDATE_MANAGEMENT_XNS_FN = require("./ClientOnUpdateManagementXnsFn");

const ComponentNdmp = module.exports = ae3.Class.create(
	"ComponentNdmp",
	require("./../AbstractComponent"),
	function(client){
		this.AbstractComponent.call(this, client);
		return this;
	},
	{
		componentName : {
			value : "ndmp"
		},
		acceptXmlNotifications : {
			value : ['ut3','cc3','um1','cl1']
		},
		
		requestXmlNotifications : {
			get : function(){
				if(this.lastUpdated && this.lastUpdated.getDate() + 4 * 60 * 60 * 1000 > Date.now()){
					return null;
				}
				return this.acceptXmlNotifications;
			}
		},
		
		onXmlNotification : {
			value : function(id, data){
				switch(id){
					case "cl1":
						return CLIENT_ON_UPDATE_LINKING_XNS_FN.call(this.client, id, data);
					case "um1":
						return CLIENT_ON_UPDATE_MANAGEMENT_XNS_FN.call(this.client, id, data);
				}
				return;
			}
		},
		
		lastUpdated : {
			/**
			 * last time data was successfully updated
			 */
			value : null
		},
		
		
		preparedMatingKeys : {
			value : null
		},
		
		prepareMatingKeys : {
			value : function(forceNew){
				if(!forceNew){
					const keys = this.preparedMatingKeys;
					if(keys){
						return keys;
					}
				}
				
				/**
				 * generate
				 */
				console.log("ndm.client::ComponentNdmp:prepareMatingKeys: '%s': generating new EC pair", this.client.clientId);

				const pair = Secp256r1.generateKeyPair();

				console.log("ndm.client::ComponentNdmp:prepareMatingKeys: '%s': new EC pair's public: %s", this.client.clientId, pair.getPublic());
				
				Object.defineProperty(this, "preparedMatingKeys", {
					value : pair,
					configurable : true,
					writable : true
				});
				
				return pair;
			}
		},
		
		
		prepareMatingLink : {
			value : function(forceNew){
				const pair = this.prepareMatingKeys(forceNew);
				if(!pair){
					throw "NDMP EC KeyPair is not available!";
				}
				const collector = ae3.Transfer.createCollector();
				collector.printByte(7);
				collector.printBinary(this.client.ndnsAlias);
				collector.printBytes(Secp256r1.formatPublicKeyAsBytesCompressed(pair.getPublic()));
				return "https://" + this.client.ndmpZone + "/#link:" + Format.binaryAsBase58(collector.toBinary());
			}
		},
		
		invalidateMatingKeys : {
			value : function(forceAll){
				Object.defineProperty(this, "preparedMatingKeys", {
					value : null,
					configurable : true,
					writable : true
				});
				if(forceAll){
					/**
					// this.client.vfs.setContentUndefined("ndmpKeyPrivate");
					// this.client.vfs.setContentUndefined("ndmpKeyPublic");
					// this.client.vfs.setContentUndefined("ndmpSvcPublic");
					**/
					this.client.vfs.setContent({
						"ndmpKeyPrivate" : {
							field : true,
							index : false,
							value : undefined
						},
						"ndmpKeyPublic" : {
							field : true,
							index : true,
							value : undefined
						},
						"ndmpSvcPublic" : {
							field : true,
							index : true,
							value : undefined
						}
					});
					Object.defineProperty(this, "confirmedMatingKeys", {
						value : null,
						configurable : true,
						writable : true
					});
				}
				return true;
			}
		},
		
		confirmedMatingKeys : {
			get : function(){
				
				// const ndmpKeyPrivate = this.client.vfs.getContentAsBinary("ndmpKeyPrivate");
				const ndmpKeyPrivate = this.client.vfs.relativeBinary("ndmpKeyPrivate");

				// const ndmpKeyPublic = this.client.vfs.getContentAsBinary("ndmpKeyPublic");
				const ndmpKeyPublic = this.client.vfs.relativeBinary("ndmpKeyPublic");
				
				// const ndmpSvcPublic = this.client.vfs.getContentAsBinary("ndmpSvcPublic");
				const ndmpSvcPublic = this.client.vfs.relativeBinary("ndmpSvcPublic");

				if(!ndmpKeyPublic || !ndmpKeyPrivate || !ndmpSvcPublic){
					Object.defineProperty(this, "confirmedMatingKeys", {
						value : null,
						configurable : true,
						writable : true
					});
					return null;
				}
				
				console.log("ndm.client::ComponentNdmp:confirmedMatingKeys: '%s': using existing EC pair", this.client.clientId);

				const privateKey = Secp256r1.parsePrivateKeyFromBytesPKCS8(ndmpKeyPrivate.nextDirectArray());
				const publicKey = Secp256r1.parsePublicKeyFromBytesCompressed(ndmpKeyPublic.nextDirectArray());
				const serviceKey = Secp256r1.parsePublicKeyFromBytesCompressed(ndmpSvcPublic.nextDirectArray());
				
				console.log("ndm.client::ComponentNdmp:confirmedMatingKeys: '%s': existing deviceEcPublic: %s", this.client.clientId, publicKey);
				console.log("ndm.client::ComponentNdmp:confirmedMatingKeys: '%s': existing serviceEcpublic: %s", this.client.clientId, serviceKey);
				
				const KeyPair = require("java.class/java.security.KeyPair");
				
				const pair = new KeyPair(publicKey, privateKey);
				
				const keys = {
					server : serviceKey,
					client : publicKey,
					pair : pair
				};
				
				Object.defineProperty(this, "confirmedMatingKeys", {
					value : keys,
					configurable : true,
					writable : true
				});
				return keys;
			}
		},
		
		confirmMating : {
			value : function(deviceEcPublic, serviceEcPublic){
				const pair = this.preparedMatingKeys;
				if(!pair){
					return false;
				}
				
				
				const devicePublic = Secp256r1.parsePublicKeyFromHexCompressed(deviceEcPublic);
				
				if(pair.getPublic() != devicePublic){
					console.log("ndm.client::ComponentNdmp:confirmMating: devicePublic mismatch %s != %s", pair.getPublic(), devicePublic);
					return false;
				}
				
				const servicePublic = Secp256r1.parsePublicKeyFromHexCompressed(serviceEcPublic);

				// TODO: define property keys, not pair only
				
				/**
				 * store
				 */
				console.log("ndm.client::ComponentNdmp:confirmMating: '%s': ndmp: storing newly confirmed EC pair", this.client.clientId);
	
				/**
				// this.client.vfs.setContentPublicTreeBinary("ndmpKeyPrivate", //
				//		transferCreateCopier(Secp256r1.formatPrivateKeyAsBytesPKCS8(pair.getPrivate())));
				// this.client.vfs.setContentPublicTreeBinary("ndmpKeyPublic", //
				//		transferCreateCopier(Secp256r1.formatPublicKeyAsBytesCompressed(devicePublic)));
				// this.client.vfs.setContentPublicTreeBinary("ndmpSvcPublic", //
				//		transferCreateCopier(Secp256r1.formatPublicKeyAsBytesCompressed(servicePublic)));
				**/

				this.client.vfs.setContent({
					"ndmpKeyPrivate" : {
						index : false,
						value : transferCreateCopier(Secp256r1.formatPrivateKeyAsBytesPKCS8(pair.getPrivate()))
					},
					"ndmpKeyPublic" : {
						index : true,
						value : transferCreateCopier(Secp256r1.formatPublicKeyAsBytesCompressed(devicePublic))
					},
					"ndmpSvcPublic" : {
						index : true,
						value : transferCreateCopier(Secp256r1.formatPublicKeyAsBytesCompressed(servicePublic))
					}
				});

				Object.defineProperty(this, "confirmedMatingKeys", {
					value : pair,
					configurable : true,
					writable : true
				});
			}
		},
		
		/**
		 * TODO: finish me
		 */
		"checkPrepareNdmpRequest" : {
			/**
			 * return false to halt
			 */
			value : function(query){
				const path = query.resourceIdentifier;
				switch(path){
				case '/auth':
				}
				return true;
			}
		},
		
	},
	{
		newInstance : {
			value : function(client){
				return new ComponentNdmp(client);
			}
		}
	}
);
