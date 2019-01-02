module.exports = {
	Stats : null,
	start : function startService(){
		this.Stats = require('./Stats');
		this.Stats.startService(this);
	},
	stop : function stopService(){
		this.Stats = null;
	}
};
