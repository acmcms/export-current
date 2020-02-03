const ae3 = require("ae3");
const Secp256r1 = ae3.net.ssl.EllipticCurveSecp256r1;

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
			value : ['ut1']
		},
		
		requestXmlNotifications : {
			get : function(){
				if(this.lastUpdated && this.lastUpdated.getDate() + 4 * 60 * 60 * 1000 > Date.now()){
					return null;
				}
				return this.acceptXmlNotifications;
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
					let keys = this.preparedMatingKeys;
					if(keys){
						return keys;
					}
				}
				
				/**
				 * generate
				 */
				console.log("ndm.client '%s': ndmp: generating new EC pair", this.client.clientId);

				const pair = Secp256r1.generateKeyPair();

				console.log("ndm.client '%s': ndmp: new EC pair's public: %s", this.client.clientId, pair.getPublic());
				
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
					this.client.vfs.setContentUndefined("ndmpKeyPublic");
					this.client.vfs.setContentUndefined("ndmpKeyPrivate");
					this.client.vfs.setContentUndefined("ndmpSvcPublic");
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
				// const ndmpKeyPublic = this.client.vfs.getContentAsBinary("ndmpKeyPublic");
				const ndmpKeyPublic = this.client.vfs.relativeBinary("ndmpKeyPublic");
				
				// const ndmpKeyPrivate = this.client.vfs.getContentAsBinary("ndmpKeyPrivate");
				const ndmpKeyPrivate = this.client.vfs.relativeBinary("ndmpKeyPrivate");
				
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
				
				console.log("ndm.client '%s': ndmp: using existing EC pair", this.client.clientId);

				const privateKey = Secp256r1.parsePrivateKeyFromBytesPKCS8(ndmpKeyPrivate.nextDirectArray());
				const publicKey = Secp256r1.parsePublicKeyFromBytesCompressed(ndmpKeyPublic.nextDirectArray());
				const serviceKey = Secp256r1.parsePublicKeyFromBytesCompressed(ndmpSvcPublic.nextDirectArray());
				
				console.log("ndm.client '%s': ndmp: existing deviceEcPublic: %s", this.client.clientId, publicKey);
				console.log("ndm.client '%s': ndmp: existing serviceEcpublic: %s", this.client.clientId, serviceKey);
				
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
					console.log(">>>>>> ComponentNDMP: devicePublic mismatch %s != %s", pair.getPublic(), devicePublic);
					return false;
				}
				
				const servicePublic = Secp256r1.parsePublicKeyFromHexCompressed(serviceEcPublic);

				// TODO: define property keys, not pair only
				
				/**
				 * store
				 */
				console.log("ndm.client '%s': ndmp: storing newly confirmed EC pair", this.client.clientId);
	
				this.client.vfs.setContentPublicTreeBinary("ndmpKeyPrivate", //
						ae3.Transfer.createCopier(Secp256r1.formatPrivateKeyAsBytesPKCS8(pair.getPrivate())));
				this.client.vfs.setContentPublicTreeBinary("ndmpKeyPublic", //
						ae3.Transfer.createCopier(Secp256r1.formatPublicKeyAsBytesCompressed(devicePublic)));
				this.client.vfs.setContentPublicTreeBinary("ndmpSvcPublic", //
						ae3.Transfer.createCopier(Secp256r1.formatPublicKeyAsBytesCompressed(servicePublic)));

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