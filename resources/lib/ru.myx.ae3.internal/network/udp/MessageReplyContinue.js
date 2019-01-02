function MessageReplyContinue(){
	// this.MessageReply();
	return this;
}

MessageReplyContinue.prototype = Object.create(require('./MessageReply').prototype, {
	MessageReplyContinue : {
		value : MessageReplyContinue
	},
	isReplyContinue : {
		value : true
	},
	toString : {
		value : function(){
			return "[MessageReplyContinue]";
		}
	}
});

MessageReplyContinue.toString = function(){
	return "MessageReplyContinue";
};

module.exports = MessageReplyContinue;