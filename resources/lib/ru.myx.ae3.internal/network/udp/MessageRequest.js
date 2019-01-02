function MessageRequest(){
	// this.Message();
	return this;
}

MessageRequest.prototype = Object.create(require('./Message').prototype, {
	MessageRequest : {
		value : MessageRequest
	},
	isRequest : {
		value : true
	},
	isReply : {
		value : false
	},
	toString : {
		value : function(){
			return "[MessageRequest]";
		}
	}
});

MessageRequest.toString = function(){
	return "MessageRequest";
};

module.exports = MessageRequest;