static pre-configured settings could be added here.

use <client_instance_name>.json files with structure shown in the following example:

devel.json:
{
	"type" : "ndm.client/Connection",
	"name" : "devel",
	"service" : {
		"host" : "ndss.operator.net",
		"key" : "839861479136193",
		"pass" : "mn4hjy3y87fid33"
	},
	"override" : {
		"allowPlainHandshake" : false,
		"forcePlainHandshake" : false,
		"forceCertificateValidation" : false,
		"tlsClientRequired" : false,
		"terminateOnClient" : false,
		"useCloudWebuiCdnUri" : "https://static.operator.net/base/v-1.0/"
		"-- pecularities" : "^^^"
	},
	"uhp" : {
		"enable" : true
	}
}