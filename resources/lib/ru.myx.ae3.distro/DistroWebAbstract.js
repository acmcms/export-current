
function DistroWebAbstract(){
	this.AbstractWebPage();
	return this;
}

DistroWebAbstract.prototype = Object.create(require('ae3.web/AbstractWebPage').prototype, {
	DistroWebAbstract : {
		value : DistroWebAbstract
	},
	run : {
		get : function(){
			return this;
		}
	},
	access : {
		value : "public"
	},
	ui : {
		value : true
	},
	depthLimit : {
		value : undefined
	},
	toString : {
		value : function(){
			return "[DistroWebAbstract]";
		}
	}
});

module.exports = DistroWebAbstract;