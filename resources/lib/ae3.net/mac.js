import ru.myx.ae3.net.ethernet.MacAddress;
import ru.myx.ae3.net.ethernet.MacVfsPoolManager;

module.exports = Object.create(Object.prototype, {
	/**
	 * classes
	 */
		
	MacAddress : {
		enumerable : true,
		value : MacAddress
	},
	MacSingle : {
		enumerable : true,
		value : MacAddress.macSingleClass
	},
	MacRange : {
		enumerable : true,
		value : MacAddress.macRangeClass
	},
	MacRanges : {
		/** TODO: this is current, choose best, refactor */
		enumerable : true,
		value : MacAddress.macSetClass
	},
	MacSet : {
		/** TODO: use MacRanges */
		enumerable : true,
		value : MacAddress.macSetClass
	},
	MacCollection : {
		/** TODO: use MacRanges */
		enumerable : true,
		value : MacAddress.macSetClass
	},
	VfsPoolManager : {
		/** FIXME: unfinished */
		enumerable : true,
		value : MacVfsPoolManager
	},
	
	/**
	 * require("ae3").net.mac.NULL_ADDRESS == ''
	 * 
	 * require("ae3").net.mac.NULL_ADDRESS.longString == '00:00:00:00:00:00/0'
	 * 
	 * require("ae3").net.mac.NULL_ADDRESS.compactString == ''
	 * 
	 * require("ae3").net.mac.NULL_ADDRESS.macCount == 0
	 */
	NULL_ADDRESS : {
		enumerable : true,
		value : MacAddress.NULL_ADDRESS
	},
	/**
	 * require("ae3").net.mac.EXAMPLE_RANGE.longString == '00:53:00:00:00:00-00:53:ff:ff:ff:fe'
	 * 
	 * require("ae3").net.mac.EXAMPLE_RANGE.compactString == '005300000000/4294967295'
	 * 
	 * require("ae3").net.mac.EXAMPLE_RANGE.macCount == 4294967295
	 */
	EXAMPLE_RANGE : {
		enumerable : true,
		value : MacAddress.EXAMPLE_RANGE
	},
	/**
	 * require("ae3").net.mac.EXAMPLE_RANGES.longString == '00:53:00:00:00:00-00:53:ff:ff:ff:fe + 90:10:00:00:00:00-90:10:ff:ff:ff:f'
	 * 
	 * require("ae3").net.mac.EXAMPLE_RANGES.compactString == '005300000000/4294967295+901000000000/4294967295'
	 * 
	 * require("ae3").net.mac.EXAMPLE_RANGES.macCount == 4294967295
	 * 
	 */
	EXAMPLE_RANGES : {
		enumerable : true,
		value : MacAddress.EXAMPLE_RANGES
	},
	
	/**
	 * methods
	 */
	
	parse : {
		enumerable : true,
		/**
		 * mac = require("ae3").net.mac
		 * 
		 * mac.parse('00:12:AA:12:45:01')
		 * 
		 * mac.parse('0012AA124501')
		 * 
		 * mac.parse('00:12:AA:12:45:01')
		 * mac.parse('00:12:AA:12:45:01').macCount
		 * mac.parse('00:12:AA:12:45:01').longString
		 * mac.parse('00:12:AA:12:45:01').macAt(0)
		 * mac.parse('00:12:AA:12:45:01').macAt(1)
		 * 
		 * mac.parse('00:12:AA:12:45:01/1').longString
		 * mac.parse('00:12:AA:12:45:01-00:12:AA:12:45:01').longString
		 */
		value : MacAddress.macSingleClass.parseOrDie
	},

	parseRange : {
		enumerable : true,
		/**
		 * mac = require("ae3").net.mac
		 * 
		 * mac.parseRange('00:12:AA:12:45:01')
		 * mac.parseRange('00:12:AA:12:45:01').macCount
		 * mac.parseRange('00:12:AA:12:45:01').macAt(0)
		 * mac.parseRange('00:12:AA:12:45:01').macAt(1)
		 * mac.parseRange('00:12:AA:12:45:01').longString
		 * mac.parseRange('00:12:AA:12:45:01').compactString
		 * 
		 * mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02')
		 * mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02').macCount
		 * mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02').macAt(0)
		 * mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02').macAt(1)
		 * mac.parseRange('00:12:AA:12:45:01-00:12:AA:12:45:02').macAt(2)
		 * 
		 * mac.parseRange('0012AA124501')
		 * mac.parseRange('0012AA124501/99')
		 * 
		 * // https://code.wireshark.org/review/gitweb?p=wireshark.git;a=blob_plain;f=manuf
		 * mac.parseRange('10:7B:EF:00:00:00/16000000')
		 * mac.parseRange('10:7D:1A:00:00:00 / 16777216').longString
		 * 
		 * mac.parseRange('10:7B:EF:00:00:00 - 10:7B:EF:FF:FF:FF')
		 * mac.parseRange('10:7B:EF:00:00:00 - 10:7B:EF:FF:FF:FF').longString
		 * mac.parseRange('10:7B:EF:00:00:00 - 10:7B:EF:FF:FF:FF').macCount
		 * 
		 */
		value : MacAddress.macRangeClass.parseOrDie
	},

	parseRanges : {
		enumerable : true,
		/**
		 * mac = require("ae3").net.mac
		 * 
		 * mac.parseRanges('00:12:AA:12:45:01')
		 * mac.parseRanges('00:12:AA:12:45:01').macCount
		 * mac.parseRanges('00:12:AA:12:45:01').macAt(0)
		 * mac.parseRanges('00:12:AA:12:45:01').macAt(1)
		 * mac.parseRanges('00:12:AA:12:45:01').longString
		 * mac.parseRanges('00:12:AA:12:45:01').compactString
		 * 
		 * mac.parseRanges('00:12:AA:12:45:01 - 00:12:AA:12:45:02')
		 * mac.parseRanges('00:12:AA:12:45:01 - 00:12:AA:12:45:02').macCount
		 * mac.parseRanges('00:12:AA:12:45:01 - 00:12:AA:12:45:02').macAt(0)
		 * mac.parseRanges('00:12:AA:12:45:01 - 00:12:AA:12:45:02').macAt(1)
		 * mac.parseRanges('00:12:AA:12:45:01 - 00:12:AA:12:45:02').macAt(2)
		 * 
		 * mac.parseRanges('00:12:AA:12:45:01 + 00:12:AA:12:45:02')
		 * mac.parseRanges('00:12:AA:12:45:01 + 00:12:AA:12:45:02').macCount
		 * mac.parseRanges('00:12:AA:12:45:01 + 00:12:AA:12:45:02').macAt(0)
		 * mac.parseRanges('00:12:AA:12:45:01 + 00:12:AA:12:45:02').macAt(1)
		 * mac.parseRanges('00:12:AA:12:45:01 + 00:12:AA:12:45:02').macAt(2)
		 * 
		 * mac.parseRanges('0012AA124501')
		 * mac.parseRanges('0012AA124501 / 99')
		 * 
		 * // https://code.wireshark.org/review/gitweb?p=wireshark.git;a=blob_plain;f=manuf
		 * mac.parseRanges('10:7B:EF:00:00:00/16000000')
		 * mac.parseRanges('10:7B:EF:00:00:00-10:7B:EF:FF:FF:FF')
		 * mac.parseRanges('10:7B:EF:00:00:00-10:7B:EF:FF:FF:FF+10:7D:1A:00:00:00/16777216').macCount
		 * mac.parseRanges('10:7B:EF:00:00:00-10:7B:EF:FF:FF:FF+10:7D:1A:00:00:00/16777216').compactString
		 * mac.parseRanges('10:7B:EF:00:00:00-10:7B:EF:FF:FF:FF + 10:7D:1A:00:00:00/16777216').longString
		 * mac.parseRanges('10:7B:EF:00:00:00 - 10:7B:EF:FF:FF:FF + 10:7D:1A:00:00:00 / 16777216').longString
		 * 
		 * mac.parseRanges('10:7B:EF:00:00:00-10:7B:EF:FF:FF:FF').macCount
		 * 
		 * 
		 * mac.parseRanges('00:12:AA:12:45:01/3+77:31:CE:27:95:02/2')
		 * mac.parseRanges('00:12:AA:12:45:01/3+77:31:CE:27:95:02/2').macCount
		 * mac.parseRanges('00:12:AA:12:45:01/3+77:31:CE:27:95:02/2').longString
		 * mac.parseRanges('00:12:AA:12:45:01/3+77:31:CE:27:95:02/2').compactString
		 * 
		 * mac.parseRanges('00:12:AA:12:45:01/3+77:31:CE:27:95:02/2').macAt(0)
		 * mac.parseRanges('00:12:AA:12:45:01/3+77:31:CE:27:95:02/2').macAt(1)
		 * mac.parseRanges('00:12:AA:12:45:01/3+77:31:CE:27:95:02/2').macAt(2)
		 * 
		 * mac.parseRanges('00:12:AA:12:45:01/3+77:31:CE:27:95:02/2').macAt(3)
		 * mac.parseRanges('00:12:AA:12:45:01/3+77:31:CE:27:95:02/2').macAt(4)
		 * 
		 * mac.parseRanges('00:12:AA:12:45:01/3+77:31:CE:27:95:02/2').macAt(5)
		 */
		value : MacAddress.macSetClass.parseOrDie
	},

	"toString" : { 
		value : function(){
			return "[Object ae3.net.mac API]";
		} 
	}
});
