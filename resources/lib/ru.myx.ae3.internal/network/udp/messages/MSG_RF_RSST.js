const ae3 = require("ae3");
const Transfer = ae3.Transfer;

const UdpServiceHelper = (function(){ try{ return require('java.class/ru.myx.ae3.internal.net.UdpServiceHelper'); }catch(e){ return {}; } })();

const RemoteServiceStateSAPI = require("java.class/ru.myx.ae3.state.RemoteServiceStateSAPI");

const MSG_RF_RSST = module.exports = ae3.Class.create(
	/* name */
	"MSG_RF_RSST",
	/* inherit */
	require('./../Message').ReplyFinal,
	/* constructor */
	/**
	 * 
	 * @param rsst binary
	 * @returns {@G}
	 */
	function(rsst, serial){
		// this.MessageRequest();
		this.rsst = RemoteServiceStateSAPI.parseReply(rsst || [ "4001:host", "4004:model", "4005:realm" ]);
		this.serial = serial;
		return this;
	},
	/* instance */
	{
		code : {
			value : 0x34 // '4'.charCodeAt(0)
		},
		"isRSST" : {
			value : true
		},
		"isSUCCESS" : {
			value : true
		},
		encrypt : {
			value : true
		},
		build : {
			value : /* UdpServiceHelper.buildMsgRsst || */ (function(b, o){
				return this.rsst.formatToBuffer(b, o, 1280);
			})
		},
		toString : {
			value : /* UdpServiceHelper.toStringMsgRsst || */ (function(){
				return "[RSST " + this.rsst.formatAsTextString() + ", sTx:" + (this.serial||0) + "]";
			})
		}
	},
	/* static */
	{
		"parseBinaryMessage" : {
			value : function(b, o, s, L /* locals: */, rsst){
				if( (rsst = RemoteServiceStateSAPI.parseReplyFromBuffer(b, o, L) ) ){
					return new MSG_RF_RSST(rsst, s);
				}
				return undefined;
				// broken constructor syntax
				return new MSG_RF_RSST(RemoteServiceStateSAPI.parseReplyFromBuffer(b, o, L), s);
			}
		},
		"toString" : {
			value : function(){
				return "MSG_RF_RSST";
			}
		}
	}
);
