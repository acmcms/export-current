const Driver = require('java.class/ru.myx.ae3.vfs.s4.lcl.psgr.PsgrLocalS4');
const QueryString = require('querystring');

/**
 * s4 driver
 * 
 * @param args
 * @returns {Boolean}
 */
exports.create = function create(args){
	if(args && args.length > 1){
		return console.fail("extra arguments: " + Format.jsObject(args));
	}
	var properties = args && args.length ? QueryString.parse(args) : {};
	var driver = new Driver();
	properties.host		&& (driver.host		= properties.host);
	properties.port		&& (driver.port		= properties.port);
	properties.database	&& (driver.database	= properties.database);
	properties.user		&& (driver.host		= properties.host);
	properties.password	&& (driver.password	= properties.password);
	return driver;
};
