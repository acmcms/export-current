#
# URI: /!/skin/skin-standard-xml/
#

<%FINAL: 'text/xml' %><?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="layout.xsl"?>
<xml>
	<title>Skin: Standard-XML Documentation</title>
	<article>
		<name>How do I use XSL templates provided?</name>
		<text>
			<paragraph>Skin provides several generic XSL templates that could be
			useful while building XML based web-services.</paragraph>
			<code><![CDATA[
				return {
					layout	: 'xml',
					xsl		: '/!/skin/skin-standard-xml/show.xsl',
					content	: '<index/>'
				};
			]]></code>
		</text>
	</article>
	<article>
		<name>Is there any examples provided?</name>
		<text>
			<paragraph>We do have some generic pages with XML data and XSL templates 
			specified. <a href="checkShowIndex.xml">Click here</a> to get there. 
			Use 'view page source' to see XML.</paragraph>
		</text>
	</article>
	<article>
		<name>Template: layout.xsl</name>
		<text>
			<paragraph>Skin provides several generic XSL templates that could be
			useful while building XML based web-services.</paragraph>
			<code><![CDATA[
				return {
				};
			]]></code>
		</text>
	</article>
	<article>
		<name>Template: showAuth.xsl</name>
		<text>
			<paragraph>Skin provides several generic XSL templates that could be
			useful while building XML based web-services.</paragraph>
			<code><![CDATA[
				return {
				};
			]]></code>
		</text>
	</article>
	<article>
		<name>Template: show.xsl</name>
		<text>
			<paragraph>Skin provides several generic XSL templates that could be
			useful while building XML based web-services.</paragraph>
			<code><![CDATA[
				return {
				};
			]]></code>
		</text>
	</article>
	<article>
		<name>Template: showState.xsl</name>
		<text>
			<paragraph>Skin provides several generic XSL templates that could be
			useful while building XML based web-services.</paragraph>
			<code><![CDATA[
				return {
				};
			]]></code>
		</text>
	</article>
</xml><%/FINAL%>