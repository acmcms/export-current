
module.exports = function(date, evtType, ectIcon, evtData, relId){
	this.date = date;
	this.type = evtType;
	this.icon = evtIcon;
	this.data = evtData;
	this.relId = relId;
	return this;
};
