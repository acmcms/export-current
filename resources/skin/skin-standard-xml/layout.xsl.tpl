<%FINAL: 'text/xml' %><%FORMAT: 'xml' %><?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output method="html" media-type="text/html" indent="no"/>
	<xsl:variable name="namespacePrefix" select="/xml/@namespacePrefix"/>
	<xsl:template match="/xml">
		<html>
		<head>
			<link rel="stylesheet" type="text/css" href="/!/skin/skin-standard-html/client/css/default.css" />
			<link rel="stylesheet" type="text/css" href="/!/skin/skin-standard-xml/style.css" />
			<style>
				html{
					font-size: 100%;
					overflow-y: scroll;
				}
			</style>
			<title><xsl:value-of select="title"/></title>
		</head>
		<body>
			<h1><xsl:value-of select="title"/></h1>
			<a name="top"></a>
			<xsl:if test="article">
				<p>Articles:</p>
				<ul>
					<xsl:for-each select="article">
						<li><a href="#{name}"><xsl:value-of select="name"/></a></li>
					</xsl:for-each>
				</ul>
			</xsl:if>
			<xsl:if test="method">
				<p>API Methods:</p>
				<ul>
					<xsl:for-each select="method">
						<li><a href="#{name}"><xsl:value-of select="$namespacePrefix"/><xsl:value-of select="name"/></a></li>
					</xsl:for-each>
				</ul>
			</xsl:if>
			<xsl:if test="object">
				<p>Object classes:</p>
				<ul>
					<xsl:for-each select="object">
						<li><a href="#{name}"><xsl:value-of select="$namespacePrefix"/><xsl:value-of select="name"/></a></li>
					</xsl:for-each>
				</ul>
			</xsl:if>
			<hr/>
			<xsl:apply-templates/>
			<h5>Jump to: <a href="../index">root index menu...</a></h5>
		</body>
		</html>
	</xsl:template>
	<xsl:template match="xml/title">
	</xsl:template>
	<xsl:template match="paragraph">
		<p class="paragraph"><xsl:copy-of select="."/></p>
	</xsl:template>
	<xsl:template match="command">
		<code class="command"><xsl:value-of select="."/></code>
	</xsl:template>
	<xsl:template match="output">
		<pre class="output"><xsl:value-of select="."/></pre>
	</xsl:template>
	<xsl:template match="text">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="summary">
		<div><xsl:apply-templates/></div><p></p>
	</xsl:template>
	<xsl:template match="name">
	</xsl:template>
	<xsl:template match="fields">
		<h3>Properties (fields):</h3>
		<table border="1">
			<tr><th>Name</th><th>Description</th></tr>
			<xsl:for-each select="field">
				<tr><td><xsl:value-of select="name"/></td><td><xsl:copy-of select="description"/></td></tr>
			</xsl:for-each>
		</table>
		<p></p>
	</xsl:template>
	<xsl:template match="article">
		<a name="{name}"></a>
		<h2><xsl:value-of select="name"/></h2>
		<xsl:apply-templates/>
		<div class="ui-label ui-right"><a href="#top">top ^^^</a></div>
		<hr style="clear:both"/>
	</xsl:template>
	<xsl:template match="anchor">
		<a name="{.}"></a>
	</xsl:template>
	<xsl:template match="method">
		<a name="{name}"></a>
		<h2>method <xsl:value-of select="$namespacePrefix"/><xsl:value-of select="name"/></h2>
		<xsl:for-each select="label"><div class="ui-label ui-left"><a href="#{.}"><xsl:value-of select="."/></a></div></xsl:for-each>
		<br style="clear:both"/>
		<p><xsl:apply-templates select="summary"/></p>
		<div>parameters:</div>
		<ul>
			<xsl:for-each select="parameter">
				<li>
					<b><xsl:value-of select="@name"/></b>: <xsl:value-of select="@value"/>
				</li>
			</xsl:for-each>
		</ul>
		<div>api urls:</div>
		<ul>
			<xsl:for-each select="url">
				<li>
					<xsl:value-of select="@title"/>:<br/><code><xsl:value-of select="@value"/></code>
				</li>
			</xsl:for-each>
		</ul>
		<p></p>
		<div>responses:</div>
		<ul>
			<xsl:for-each select="result">
				<li>
					<xsl:copy-of select="."/>
					<br/>
				</li>
			</xsl:for-each>
		</ul>
		<div class="ui-label ui-right"><a href="#top">top ^^^</a></div>
		<hr style="clear:both"/>
	</xsl:template>
	<xsl:template match="object">
		<a name="{name}"></a>
		<h2>object <xsl:value-of select="$namespacePrefix"/><xsl:value-of select="name"/></h2>
		<xsl:apply-templates/>
		<div class="ui-label ui-right"><a href="#top">top ^^^</a></div>
		<hr style="clear:both"/>
	</xsl:template>
</xsl:stylesheet><%/FORMAT%><%/FINAL%>