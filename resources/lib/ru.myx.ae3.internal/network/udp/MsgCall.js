const ae3 = require('ae3');
const Transfer = ae3.Transfer;


const MsgCall = module.exports = ae3.Class.create(
	/* name */
	"MsgCall",
	/* inherit */
	require('./Message').Request,
	/* constructor */
	/**
	 * 
	 * @param component string
	 * @param argument binary
	 * @returns {@G}
	 */
	function MsgCall(component, argument, serial){
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
			value : function(b, o){
				var l = 0;
				// component X bytes
				var component = Transfer.createCopierUtf8(this.component);
				l += component.copy(0, b, o, 128);
				o += l;
				// ZERO byte
				b[o++] = 0;
				++ l;
				// argument X bytes
				if(this.argument){
					l += this.argument.copy(0, b, o, 1024);
				}
				return l;
			}
		},
		toString : {
			value : function(){
				if(!this.argument){
					return "[MsgCall "+ Format.jsString(this.component) + ", sTx:"+(this.serial||0)+"]";
				}
				return "[MsgCall "+ Format.jsString(this.component) + ", " + Format.bytesRound(this.argument.length()) + "B, sTx:"+(this.serial||0)+"]";
			}
		}
	},
	/* static */
	{
		"parse" : {
			value : function(b, o, s, L){
				var l = 0, component;
				for(;l < b.length; ++l){
					if(b[o + l] === 0){
						component = Transfer.wrapCopier(b, o, l++).toStringUtf8();
						break;
					}
				}
				return new MsgCall(component, Transfer.createCopier(b, o + l, L - l), s);
			}
		},
		"toString" : {
			value : function(){
				return "MsgCall";
			}
		}
	}
);
