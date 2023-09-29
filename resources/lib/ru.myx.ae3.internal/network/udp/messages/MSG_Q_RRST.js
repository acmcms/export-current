const ae3 = require('ae3');
const Transfer = ae3.Transfer;

const UdpServiceHelper = (function(){ try{ return require('java.class/ru.myx.ae3.internal.net.UdpServiceHelper'); }catch(e){ return {}; } })();

const RemoteServiceStateSAPI = require("java.class/ru.myx.ae3.state.RemoteServiceStateSAPI");

const MSG_Q_RRST = module.exports = ae3.Class.create(
	/* name */
	"MSG_Q_RRST",
	/* inherit */
	require('./../Message').Request,
	/* constructor */
	/**
	 * 
	 * @param rrst binary
	 * @returns {@G}
	 */
	function(rrst, serial){
		// this.MessageRequest();
		this.rrst = RemoteServiceStateSAPI.parseQuery(rrst || [ "4001", "4004", "4005" ]);
		this.serial = serial;
		return this;
	},
	/* instance */
	{
		code : {
			value : 0x33 // '3'.charCodeAt(0)
		},
		"isRRST" : {
			value : true
		},
		encrypt : {
			value : true
		},
		build : {
			value : /* UdpServiceHelper.buildMsgRrst || */ (function(b, o){
				return this.rrst.formatToBuffer(b, o, 1280);
			})
		},
		toString : {
			value : /* UdpServiceHelper.toStringMsgRrst || */ (function(){
				return "[RRST " + this.rrst.formatAsTextString() + ", sTx:" + (this.serial||0) + "]";
			})
		}
	},
	/* static */
	{
		"parseBinaryMessage" : {
			value : function(b, o, s, L /* locals: */, rrst){
				if( (rrst = RemoteServiceStateSAPI.parseQueryFromBuffer(b, o, L) ) ){
					return new MSG_Q_RRST(rrst, s);
				}
				return undefined;
				// broken constructor syntax
				return new MSG_Q_RRST(RemoteServiceStateSAPI.parseQueryFromBuffer(b, o, L), s);
			}
		},
		"toString" : {
			value : function(){
				return "MSG_Q_RRST";
			}
		}
	}
);
