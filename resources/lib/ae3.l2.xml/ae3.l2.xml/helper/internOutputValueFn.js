/**
 * 
 */

const formatXmlElements = Format.xmlElements;

/**
 * this must be bint to XmlSkinHelper instance
 */
function internOutputValue(key, value){
	return formatXmlElements(key, this.internReplaceValue(value));
}

module.exports = internOutputValue;
