/**
 * 
 * @param props : {
 * 	pathPrefix
 * 	systemName
 * 	
 * }
 */
function StatsMonitoringPage(props){
	this.IndexPage();
	this.systemName = props.systemName || 'AE3';
	this.link = 'string' === typeof props.pathPrefix ? props.pathPrefix : 'monitoring/';
	this.link && !this.link.endsWith('/') && (this.link += '/');

	this.pageTitle = (this.systemName) + "::" + this.link + "index (System Monitoring)";

	const WapiCurrentValuesClass = require("ru.myx.ae3.internal/web/stats-monitoring/CurrentValues");
	const WapiRuntimeMonitoringLogClass = require("ru.myx.ae3.internal/web/stats-monitoring/RuntimeMonitoringLog");
	const WapiRuntimeStatsLogClass = require("ru.myx.ae3.internal/web/stats-monitoring/RuntimeStatsLog");
	const WapiFullStatusClass = require("ru.myx.ae3.internal/web/stats-monitoring/FullStatus");

	this.commands = {
		/**
		 * interface
		 */
		index:{
			icon : "house",
			title : "System Monitoring",
			run : this,
			access : "user",
		},
		"../":{
			icon : "application_get",
			title : "Root index menu",
			access : "public",
			ui : true,
		},
		"runtimeStatsLog?backwards=true":{
			icon : "table",
			title : "Runtime Stats Log (Backwards)",
			run : new WapiRuntimeStatsLogClass(this.systemName, this.link),
			access : "user",
			ui : true,
			preview : {
				depthLimit : 2,
				variant : 'document-url',
				src : '/' + this.link + 'runtimeStatsLog?backwards=true&short=true&limit=5'
			}
		},
		runtimeMonitoringLog:{
			icon : "table",
			title : "Runtime Monitoring (Only) Log",
			run : new WapiRuntimeMonitoringLogClass(this.systemName, this.link),
			access : "user",
		},
		runtimeStatsLog:{
			icon : "table",
			title : "Runtime Stats Log",
			run : new WapiRuntimeStatsLogClass(this.systemName, this.link),
			access : "user",
		},
		currentValues:{
			icon : "report",
			title : "Current Values",
			run : new WapiCurrentValuesClass(this.systemName, this.link),
			access : "user",
			ui : true,
		},
		fullStatus:{
			icon : "report",
			title : "Full System Status",
			run : new WapiFullStatusClass(this.systemName, this.link),
			access : "user",
			ui : true,
		},
	};
	this.run = this;

	/**
	 * TODO: menu and links break otherwise when embedded deep
	 */
	this.link && !this.link.startsWith('/') && (this.link = '/' + this.link);

	return this;
}

StatsMonitoringPage.prototype = Object.create(require('./IndexPage').prototype, {
	icon : {
		value : "chart_curve"
	},
	title : {
		value : "System Monitoring"
	},
	access : {
		value : "admin"
	},
	ui : {
		value : true
	},
	group : {
		value : true
	},
	toString : {
		value : function(){
			return '[StatsMonitoringPage]';
		}
	}
});


Object.defineProperties(StatsMonitoringPage, {
	create : {
		value : function createStatsMonitoring(props, auth){
			const Index = new StatsMonitoringPage(props);
			
			auth ||= props.auth;
			auth && (Index.auth = auth);

			return Index;
		}
	},
	toString : {
		value : function(){
			return '[StatsMonitoringPageClass]';
		}
	}
});


module.exports = StatsMonitoringPage;