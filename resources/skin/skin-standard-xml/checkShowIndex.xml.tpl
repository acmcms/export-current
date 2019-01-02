<%FINAL: 'text/xml' %><?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/!/skin/skin-standard-xml/show.xsl"?>
<index title="NDLS::index (Network Device Licensing Server)" layout="menu" zoom="document">
	<%= Format.xmlElement('client', {
		id : 'ndm-myx',
		admin : true,
		menu : {src:"/!/skin/skin-standard-xml/checkSubmenu.html?format=html-js"},
		help : {src:"resource/documentation.xml#listProducts", title:"Documentation"}
	}) %>
	<command key="checkShowIndex" title="Check Show Index" ui="true" hidden="false" admin="false"/>
	<command key="checkShowList" title="Check Show List (hidden/admin)" ui="false" hidden="true" admin="true"/>
	<command key="checkShowList" title="Check Show List (common)" ui="true" hidden="false" admin="false"/>
	<command key="checkShowList" title="Check Show List (admin)" ui="true" hidden="false" admin="true"/>
	<command key="readAccount" title="Account Management: read account" ui="false" hidden="true" admin="true"/>
	<command key="updateAccount" title="Account Management: update account" ui="false" hidden="true" admin="true"/>
	<command key="changeEmail" title="Account Management: change email" ui="true" hidden="false" admin="false"/>
	<command key="checkLicense" title="License: check license" ui="true" hidden="false" admin="false"/>
	<command key="addBrand" title="Brand Management: add brand" ui="false" hidden="true" admin="true"/>
	<command key="listBrands" title="Brand Management: list brands" ui="true" hidden="false" admin="true"/>
	<command key="dropBrand" title="Brand Management: drop brand" ui="false" hidden="true" admin="true"/>
	<command key="addProduct" title="Product Management: add product" ui="false" hidden="true" admin="false"/>
	<command key="listProducts" title="Product Management: list products" ui="true" hidden="false" admin="false"/>
	<command key="readProduct" title="Product Management: view product detail" ui="false" hidden="true" admin="false"/>
	<command key="updateProduct" title="Product Management: update product" ui="false" hidden="true" admin="false"/>
	<command key="prepareInitial" title="Order Management: prepare order" ui="true" hidden="false" admin="false"/>
	<command key="placeOrder" title="Order Management: place order" ui="false" hidden="true" admin="false"/>
	<command key="listOrders" title="Order Management: list orders" ui="true" hidden="false" admin="false"/>
	<command key="readOrder" title="Order Management: read order" ui="false" hidden="true" admin="false"/>
	<command key="ndssTransfer" title="Order Management: NDSS transfer" ui="false" hidden="true" admin="false"/>
	<command key="createInvoice" title="Invoice Management: create invoice" ui="false" hidden="true" admin="true"/>
	<command key="approveInvoice" title="Invoice Management: approve invoice" ui="false" hidden="true" admin="false"/>
	<command key="acceptApproval" title="Invoice Management: accept approval: generate licenses" ui="false" hidden="true" admin="true"/>
	<command key="addServer" title="General Management: add server" ui="false" hidden="true" admin="true"/>
	<command key="listServers" title="General Management: list servers" ui="true" hidden="false" admin="true"/>
	<command key="updateServer" title="General Management: update server" ui="false" hidden="true" admin="true"/>
	<command key="dropServer" title="General Management: drop server" ui="false" hidden="true" admin="true"/>
	<command key="listActions" title="Tracking Management: list actions" ui="true" hidden="false" admin="true"/>
	<command key="readAction" title="Tracking Management: read action" ui="false" hidden="true" admin="false"/>
	<command key="setupStats" title="Administration: setup Stats" ui="true" hidden="false" admin="true"/>
	<command key="setupDocs" title="Administration: setup Docs (Access Key for Online Documentation)" ui="true" hidden="false" admin="true"/>
	<command key="resource/root-ca.crt" title="NDM&#39;s Root Certificate" ui="false" hidden="true" admin="false"/>
	<command key="resource/documentation.xml" title="Documentation" ui="true" hidden="false" admin="false"/>
</index>
<%/FINAL%>