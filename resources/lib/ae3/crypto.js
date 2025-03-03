/**
 * 
 */

const CryptoApiHelper = require("java.class/ru.myx.ae3.internal.crypto.CryptoApiHelper");

module.exports = Object.create(Object.prototype, {
	EllipticCurveSecp256r1 : {
		enumerable : true,
		value : require("java.class/ru.myx.crypto.EllipticCurveSecp256r1")
	},
	
	SignatureECDSA : {
		enumerable : true,
		value : require("java.class/ru.myx.crypto.SignatureECDSA")
	},
	
	"createDigestMd5" : {
		value : CryptoApiHelper.createDigestMd5
	},
	"createDigestSha256" : {
		value : CryptoApiHelper.createDigestSha256
	},
	"createDigestWhirlpool" : {
		value : CryptoApiHelper.createDigestWhirlpool
	},
	
	"signStringUtfSha256WithEcdsaAsBase58" : {
		value : CryptoApiHelper.signStringUtfSha256WithEcdsaAsBase58
	},
	
	"verifyStringUtfSha256WithEcdsaAsBase58" : {
		value : CryptoApiHelper.verifyStringUtfSha256WithEcdsaAsBase58
	},
	
	"toString" : {
		value : function(){
			return "[Object ae3.crypto API]";
		}
	}
});
