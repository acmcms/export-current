function MessageReplyFinal(){
	// this.MessageReply();
	return this;
}

MessageReplyFinal.prototype = Object.create(require('./MessageReply').prototype, {
	MessageReplyFinal : {
		value : MessageReplyFinal
	},
	isReplyFinal : {
		value : true
	},
	toString : {
		value : function(){
			return "[MessageReplyFinal]";
		}
	}
});

MessageReplyFinal.toString = function(){
	return "MessageReplyFinal";
};

module.exports = MessageReplyFinal;