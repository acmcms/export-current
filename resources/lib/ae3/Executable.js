function runNotDefined() {
	console.sendMessage("run is not defined!");
	return false;
}

function runDefault() {
	return this.reference.run.apply(this.reference, arguments);
}

function Executable(properties) {
	if (!properties) {
		return this;
	}
	switch (properties.type) {
	case 'ae3/Executable': {
		var reference = properties.reference;
		if (!reference) {
			this.reference = null;
			this.run = runNotDefined;
			break;
		}
		if ('string' === typeof reference) {
			reference = require(properties.reference);
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

Executable.prototype = {
	run : runDefault,
	description : 'no description provided'
};

module.exports = Executable;