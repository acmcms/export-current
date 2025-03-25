const ae3 = require("ae3");
const Transfer = ae3.Transfer;

const UdpServiceHelper = (function(){ try{ return require('java.class/ru.myx.ae3.internal.net.UdpServiceHelper'); }catch(e){ return {}; } })();


const MSG_Q_CALL = module.exports = ae3.Class.create(
	/* name */
	"MSG_Q_CALL",
	/* inherit */
	require('./../Message').Request,
	/* constructor */
	/**
	 * 
	 * @param component string
	 * @param argument binary
	 * @returns {@G}
	 */
	function(component, argument, serial){
		// this.MessageRequest();
		this.component = component;
		this.argument = argument;
		this.serial = serial;
		return this;
	},
	/* instance */
	{
		code : {
			value : 0x35 // '5'.charCodeAt(0)
		},
		encrypt : {
			value : true
		},
		build : {
			value : UdpServiceHelper.buildMsgCall || (function(b, o){
				var l = o;
				// component X bytes
				l += Transfer.createCopierUtf8(this.component).copy(0, b, l, 128);
				// ZERO byte
				b[++l] = 0;
				// argument X bytes
				if(this.argument){
					l += this.argument.copy(0, b, l, 1024);
				}
				return l - o;
			})
		},
		toString : {
			value : UdpServiceHelper.toStringMsgCall || (function(){
				if(!this.argument){
					return "[CALL "+ Format.jsString(this.component) + ", sTx:"+(this.serial||0)+"]";
				}
				return "[CALL "+ Format.jsString(this.component) + ", " + Format.bytesRound(this.argument.length()) + "B, sTx:"+(this.serial||0)+"]";
			})
		}
	},
	/* static */
	{
		"parseBinaryMessage" : {
			value : function(b, o, s, L){
				var l = 0, component;
				for(;l < b.length; ++l){
					if(b[o + l] === 0){
						component = Transfer.wrapCopier(b, o, l++).toStringUtf8();
						break;
					}
				}
				return new MSG_Q_CALL(component, Transfer.createCopier(b, o + l, L - l), s);
			}
		},
		"toString" : {
			value : function(){
				return "MSG_Q_CALL";
			}
		}
	}
);
