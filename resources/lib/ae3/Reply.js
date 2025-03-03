/**
 * 
 */

import ru.myx.ae3.answer.Reply;
import ru.myx.ae3.i3.web.WebInterface;

Object.defineProperties(Reply, {
	"sendReply" : {
		value : WebInterface.sendReply
	},
	"fromObject" : {
		value : WebInterface.replyFromObject
	}
});

module.exports = Reply;