<%FINAL: 'text/xml' %><?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/!/skin/skin-standard-xml/show.xsl"?>
<list title="NDLS::listProducts (List Products)" jumpUrl="addProduct?back=listProducts" jumpTitle="add new product...">
	<%= Format.xmlElement('client', {
		id : context.query.parameters.authUserId || 'ndm-myx',
		userId : context.query.parameters.authUserId ? 'ndm-myx' : undefined,
		admin : !context.query.parameters.authUserId,
		menu : {src:"/!/skin/skin-standard-xml/checkSubmenu.html?format=html-js"},
		help : {src:"resource/documentation.xml#listProducts", title:"Documentation"}
	}) %>
	<rawHeadData>
		<script type="text/javascript" language="javascript" src="/!/skin/skin-standard-html/$files/jquery-1.8.3.min.js"></script>
		<script type="text/javascript" language="javascript" src="/resource/jquery.dataTables.min.js"></script>
		<script type="text/javascript">$(document).ready(function() {$('#list').dataTable({"bPaginate": false});} );</script>
	</rawHeadData>
	<columns>
		<column id="issuerId" title="Issuer ID" type="string" variant="link" prefix="listProducts?authUserId=" icon="table_link"/>
		<column id="vendorId" title="Vendor ID" type="string" variant="link" prefix="listProducts?authUserId=" icon="table_link"/>
		<column id="productName" title="Product Name" type="string" variant222="title" extraClass222="hl-ui-title"/>
		<column id="partNumber" title="Part Number" type="string"/>
		<column id="ndmHwId" title="HW ID" type="string"/>
		<column id="ndmFwId" title="FW ID" type="string"/>
		<column id="ndssId" title="NDSS" type="string"/>
		<column id="licensePrice" title="Price" type="number" variant="price"/>
		<column id="modified" title="Modified" type="date" variant="date"/>
		<command title="View Product Detail" icon="zoom_in" prefix="readProduct?back=listProducts&amp;key=" field="key"/>
		<command title="Edit Product" icon="application_form_edit" prefix="updateProduct?back=listProducts&amp;key=" field="key"/>
		<command title="Order Licenses" icon="cart_put" prefix="prepareInitial?productId=" field="key"/>
		<command title="Drop Product" icon="cross" prefix="dropProduct?back=listProducts&amp;key=" field="key"/>
	</columns>
	<item hl="false" key="ndm,borek;14300-0637;mv_rb" issuerId="ndm" vendorId="borek" brandId="ndm,borek" productName="MN104R4H-2T2R VDSL" partNumber="14300-0637" ndmHwId="mv_rb" ndmFwId="0x18140000 (??)" ndssId="11.lexus" cookieString="id=&amp;src=MyX" modified="2012-12-29T12:55:43.845Z"/>
	<item hl="false" key="ndm,mstc;14300-05E0;none" issuerId="ndm" vendorId="mstc" brandId="ndm,mstc" productName="Freeport" partNumber="14300-05E0" ndmHwId="none" ndmFwId="" ndssId="11.lexus" cookieString="id=105&amp;src=MyX" modified="2012-12-29T12:55:43.778Z"/>
	<item hl="false" key="ndm,mstc;14300-0637-S;fv_ra" issuerId="ndm" vendorId="mstc" brandId="ndm,mstc" productName="Metanoia VDSL Gateway" partNumber="14300-0637-S" ndmHwId="fv_ra" ndmFwId="" ndssId="11.lexus" cookieString="id=122&amp;src=MyX" modified="2012-12-29T12:55:43.785Z"/>
	<item hl="false" key="ndm,mstc;14300-0637;none" issuerId="ndm" vendorId="mstc" brandId="ndm,mstc" productName="RT-V4L1USBn" partNumber="14300-0637" ndmHwId="none" ndmFwId="" ndssId="11.lexus" cookieString="id=134&amp;src=MyX" modified="2012-12-29T12:55:43.798Z"/>
	<item hl="false" key="ndm,ndm;ae3-ndmc;ae3impl" issuerId="ndm" vendorId="ndm" brandId="ndm,ndm" productName="AE3 Java Client" partNumber="ae3-ndmc" ndmHwId="ae3impl" ndmFwId="678" ndssId="devel" cookieString="-start ndmc" modified="2013-01-11T12:31:46.468Z"/>
	<item hl="false" key="ndm,lexus;91-003-222012B;kn_ra" issuerId="ndm" vendorId="lexus" brandId="ndm,lexus" productName="K (NBG-419N)" partNumber="91-003-222012B" ndmHwId="kn_ra" ndmFwId="0x15420000" ndssId="11.lexus" cookieString="id=1&amp;src=MyX" modified="2012-12-29T12:55:43.620Z"/>
	<item hl="false" key="ndm,lexus;91-003-225005B;kg_ra" issuerId="ndm" vendorId="lexus" brandId="ndm,lexus" productName="K 4G" partNumber="91-003-225005B" ndmHwId="kg_ra" ndmFwId="0x15410000" ndssId="11.lexus" cookieString="id=3&amp;src=MyX" modified="2012-12-29T12:55:43.646Z"/>
	<item hl="false" key="ndm,lexus;NBG4114-RU0101F;kg_rb" issuerId="ndm" vendorId="lexus" brandId="ndm,lexus" productName="K 4G" partNumber="NBG4114-RU0101F" ndmHwId="kg_rb" ndmFwId="0x15510000" ndssId="11.lexus" cookieString="id=192&amp;src=MyX" modified="2012-12-29T12:55:43.839Z"/>
	<item hl="false" key="ndm,lexus;91-003-230005B;kng_ra" issuerId="ndm" vendorId="lexus" brandId="ndm,lexus" productName="K Giga" partNumber="91-003-230005B" ndmHwId="kng_ra" ndmFwId="0x15460000" ndssId="11.lexus" cookieString="id=53&amp;src=MyX" modified="2012-12-29T12:55:43.741Z"/>
	<item hl="false" key="ndm,lexus;NBG4615V2-RU0101F;kng_rb" issuerId="ndm" vendorId="lexus" brandId="ndm,lexus" productName="K Giga II" partNumber="NBG4615V2-RU0101F" ndmHwId="kng_rb" ndmFwId="0x15620000" ndssId="11.lexus" cookieString="id=184&amp;src=MyX" modified="2012-12-29T12:55:43.826Z"/>
	<item hl="false" key="ndm,lexus;NBG4215-RU0101F;kn_rb" issuerId="ndm" vendorId="lexus" brandId="ndm,lexus" productName="K II (NBG4215 V2)" partNumber="NBG4215-RU0101F" ndmHwId="kn_rb" ndmFwId="0x15520000" ndssId="11.lexus" cookieString="id=183&amp;src=MyX" modified="2012-12-29T12:55:43.818Z"/>
	<item hl="false" key="ndm,lexus;91-003-240005B;kl_ra" issuerId="ndm" vendorId="lexus" brandId="ndm,lexus" productName="K Lite" partNumber="91-003-240005B" ndmHwId="kl_ra" ndmFwId="0x17040000" ndssId="11.lexus" cookieString="id=2&amp;src=MyX" modified="2012-12-29T12:55:43.638Z"/>
	<item hl="false" key="ndm,lexus;NBG4104-RU0101F;kl_rb" issuerId="ndm" vendorId="lexus" brandId="ndm,lexus" productName="K Lite" partNumber="NBG4104-RU0101F" ndmHwId="kl_rb" ndmFwId="0x04410000" ndssId="11.lexus" cookieString="id=191&amp;src=MyX" modified="2012-12-29T12:55:43.833Z"/>
	<item hl="false" key="ndm,lexus;NBG5615-RU0101F;ku_ra" issuerId="ndm" vendorId="lexus" brandId="ndm,lexus" productName="K Ultra" partNumber="NBG5615-RU0101F" ndmHwId="ku_ra" ndmFwId="0x15620000 (??)" ndssId="11.lexus" cookieString="id=179&amp;src=MyX" modified="2012-12-29T12:55:43.812Z"/>
	<item hl="false" key="ndm,lexus;14300-05BB-S;none" issuerId="ndm" vendorId="lexus" brandId="ndm,lexus" productName="K VDSL" partNumber="14300-05BB-S" ndmHwId="none" ndmFwId="" ndssId="11.lexus" cookieString="id=90&amp;src=MyX" modified="2012-12-29T12:55:43.772Z"/>
	<item hl="false" key="ndm,lexus;14300-0637;none" issuerId="ndm" vendorId="lexus" brandId="ndm,lexus" productName="RT-V4L1USBn" partNumber="14300-0637" ndmHwId="none" ndmFwId="" ndssId="11.lexus" cookieString="id=144&amp;src=MyX" modified="2012-12-29T12:55:43.805Z"/>
	<item hl="false" key="ndm,lexus;34000-05BA;none" issuerId="ndm" vendorId="lexus" brandId="ndm,lexus" productName="Билайн N150L" partNumber="34000-05BA" ndmHwId="none" ndmFwId="" ndssId="11.lexus" cookieString="id=46&amp;src=MyX" modified="2012-12-29T12:55:43.734Z"/>
	<item hl="false" key="ndm,lexus;14300-05BB;none" issuerId="ndm" vendorId="lexus" brandId="ndm,lexus" productName="Домолинк Freeport" partNumber="14300-05BB" ndmHwId="none" ndmFwId="" ndssId="11.lexus" cookieString="id=44&amp;src=MyX" modified="2012-12-29T12:55:43.728Z"/>
	<item hl="false" key="lexus,lexus;37-004-804410Y;none" issuerId="lexus" vendorId="lexus" brandId="lexus,lexus" productName="M8FO4FS4" partNumber="37-004-804410Y" ndmHwId="none" ndmFwId="" ndssId="11.lexus" cookieString="id=7&amp;src=MyX" modified="2012-12-29T12:55:43.679Z"/>
	<item hl="false" key="lexus,lexus;37-004-808010Y;none" issuerId="lexus" vendorId="lexus" brandId="lexus,lexus" productName="M8FO8" partNumber="37-004-808010Y" ndmHwId="none" ndmFwId="" ndssId="11.lexus" cookieString="id=6&amp;src=MyX" modified="2012-12-29T12:55:43.672Z"/>
	<item hl="false" key="lexus,lexus;37-004-110010Y;none" issuerId="lexus" vendorId="lexus" brandId="lexus,lexus" productName="M8T1E1" partNumber="37-004-110010Y" ndmHwId="none" ndmFwId="" ndssId="11.lexus" cookieString="id=5&amp;src=MyX" modified="2012-12-29T12:55:43.662Z"/>
	<item hl="false" key="lexus,lexus;91-016-015009B;none" issuerId="lexus" vendorId="lexus" brandId="lexus,lexus" productName="NSA210 EE" partNumber="91-016-015009B" ndmHwId="none" ndmFwId="" ndssId="11.lexus" cookieString="id=39&amp;src=MyX" modified="2012-12-29T12:55:43.720Z"/>
	<item hl="false" key="lexus,lexus;91-016-021007B;none" issuerId="lexus" vendorId="lexus" brandId="lexus,lexus" productName="NSA221 EE" partNumber="91-016-021007B" ndmHwId="none" ndmFwId="" ndssId="11.lexus" cookieString="id=8&amp;src=MyX" modified="2012-12-29T12:55:43.685Z"/>
	<item hl="false" key="lexus,lexus;AMG1202-T10A-RU01F;none" issuerId="lexus" vendorId="lexus" brandId="lexus,lexus" productName="P660HN Lite EE (Annex A)" partNumber="AMG1202-T10A-RU01F" ndmHwId="none" ndmFwId="" ndssId="11.lexus" cookieString="id=9&amp;src=MyX" modified="2012-12-29T12:55:43.691Z"/>
	<item hl="false" key="lexus,lexus;AMG1302-T10A-RU01V1F;none" issuerId="lexus" vendorId="lexus" brandId="lexus,lexus" productName="P660HTN EE (Annex A)" partNumber="AMG1302-T10A-RU01V1F" ndmHwId="none" ndmFwId="" ndssId="11.lexus" cookieString="id=132&amp;src=MyX" modified="2012-12-29T12:55:43.792Z"/>
	<item hl="false" key="lexus,lexus;37-004-400011E;none" issuerId="lexus" vendorId="lexus" brandId="lexus,lexus" productName="X8004" partNumber="37-004-400011E" ndmHwId="none" ndmFwId="" ndssId="11.lexus" cookieString="id=4&amp;src=MyX" modified="2012-12-29T12:55:43.654Z"/>
	<item hl="false" key="lexus,lexus;37-004-400001U;none" issuerId="lexus" vendorId="lexus" brandId="lexus,lexus" productName="X8004 E-iCard 1-year Update" partNumber="37-004-400001U" ndmHwId="none" ndmFwId="" ndssId="11.lexus" cookieString="id=66&amp;src=MyX" modified="2012-12-29T12:55:43.763Z"/>
	<item hl="false" key="lexus,lexus;37-004-401100M;none" issuerId="lexus" vendorId="lexus" brandId="lexus,lexus" productName="X8004 E-iCard Contact-Center Engine + 1 User" partNumber="37-004-401100M" ndmHwId="none" ndmFwId="" ndssId="11.lexus" cookieString="id=36&amp;src=MyX" modified="2012-12-29T12:55:43.698Z"/>
	<item hl="false" key="lexus,lexus;37-004-401000M;none" issuerId="lexus" vendorId="lexus" brandId="lexus,lexus" productName="X8004 E-iCard Contact-Center User" partNumber="37-004-401000M" ndmHwId="none" ndmFwId="" ndssId="11.lexus" cookieString="id=37&amp;src=MyX" modified="2012-12-29T12:55:43.707Z"/>
	<item hl="false" key="lexus,lexus;37-004-400010M;none" issuerId="lexus" vendorId="lexus" brandId="lexus,lexus" productName="X8004 E-iCard External Line" partNumber="37-004-400010M" ndmHwId="none" ndmFwId="" ndssId="11.lexus" cookieString="id=55&amp;src=MyX" modified="2012-12-29T12:55:43.748Z"/>
	<item hl="false" key="lexus,lexus;37-004-410000M;none" issuerId="lexus" vendorId="lexus" brandId="lexus,lexus" productName="X8004 E-iCard Integration Kernal" partNumber="37-004-410000M" ndmHwId="none" ndmFwId="" ndssId="11.lexus" cookieString="id=38&amp;src=MyX" modified="2012-12-29T12:55:43.713Z"/>
	<item hl="false" key="lexus,lexus;37-004-400001M;none" issuerId="lexus" vendorId="lexus" brandId="lexus,lexus" productName="X8004 E-iCard Internal Line" partNumber="37-004-400001M" ndmHwId="none" ndmFwId="" ndssId="11.lexus" cookieString="id=58&amp;src=MyX" modified="2012-12-29T12:55:43.756Z"/>
	<help  />
</list>
<%/FINAL%>