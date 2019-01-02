function runNotDefined() {
	console.sendMessage("run is not defined!");
	return false;
}

function getColumnAttributes() {
	return this.reference.getColumnAttributes.apply(this.reference, arguments);
}

function Group(settings) {
	if (!settings) {
		return this;
	}
	switch (settings.type) {
	case 'ae3.stats/Group': {
		var reference = settings.reference;
		if (!reference) {
			this.reference = null;
			this.run = runNotDefined;
			break;
		}
		if ('string' === typeof reference) {
			reference = require(settings.reference);
		} else //
		if ('require' === reference['class']) {
			reference = require(reference.reference);
		}
		this.reference = reference;
		reference.description && (this.description = reference.description);
		break;
	}
	}
	return this;
}

Group.prototype = {
	columns : {},
	description : 'no description provided'
};

module.exports = Group;