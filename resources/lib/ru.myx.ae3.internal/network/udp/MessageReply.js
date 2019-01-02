function MessageReply(){
	// this.Message();
	return this;
}

MessageReply.prototype = Object.create(require('./Message').prototype, {
	MessageReply : {
		value : MessageReply
	},
	isRequest : {
		value : false
	},
	isReply : {
		value : true
	},
	toString : {
		value : function(){
			return "[MessageReply]";
		}
	}
});

MessageReply.toString = function(){
	return "MessageReply";
};

module.exports = MessageReply;