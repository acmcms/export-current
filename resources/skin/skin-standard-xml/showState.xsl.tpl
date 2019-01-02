<%FINAL: 'text/xsl' %><?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns="http://www.w3.org/1999/xhtml">
	<xsl:output method="html" indent="no"/>
	<xsl:template match="done">
		<html class="zoom-document-html">
			<head>
				<title>Updating...</title>
				<link rel="stylesheet" type="text/css" href="/!/skin/skin-standard-html/client/css/default.css" />
				<link rel="stylesheet" type="text/css" href="/!/skin/skin-standard-xml/style.css" />
				<xsl:if test="@forward">
					<meta http-equiv="refresh" content="0;URL='{@forward}'" />
				</xsl:if>
				<xsl:if test="not(@forward)">
					<meta http-equiv="refresh" content="0;URL='?done=true'" />
				</xsl:if>
				<script src="/!/skin/skin-jsclient/js/Effects/Busy.js"></script>
				<script>
					function onLoad(){
						var layout = document.getElementById("layout") || document.body;
						new Effects.Busy(layout);
					}
				</script>
			</head>
			<body onload="onLoad()" class="zoom-document-body">
				<h2>Updating...</h2>
				<p>
					<h5>You will be automatically redirected now...<br />
					Jump to: <a href="index">root index menu...</a></h5>
				</p>
			</body>
		</html>
	</xsl:template>
	<xsl:template match="updated">
		<html>
			<head>
				<title><xsl:value-of select="@title"/></title>
				<link rel="stylesheet" type="text/css" href="/!/skin/skin-standard-html/client/css/default.css" />
				<link rel="stylesheet" type="text/css" href="/!/skin/skin-standard-xml/style.css" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
			</head>
			<body>
				<xsl:apply-templates select="client"/>
				<h1><xsl:value-of select="@title"/></h1>
				<h2>Successfully Updated</h2>
				<xsl:apply-templates select="*[local-name() != 'client']"/>
				<h5>Jump to: <xsl:if test="@jumpUrl"><a href="{@jumpUrl}"><xsl:value-of select='@jumpTitle'/></a> or </xsl:if><a href="index">root index menu...</a></h5>
			</body>
		</html>
	</xsl:template>
	<xsl:template match="success">
		<html>
			<head>
				<title><xsl:value-of select="@title"/></title>
				<link rel="stylesheet" type="text/css" href="/!/skin/skin-standard-html/client/css/default.css" />
				<link rel="stylesheet" type="text/css" href="/!/skin/skin-standard-xml/style.css" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
			</head>
			<body>
				<xsl:apply-templates select="client"/>
				<h1><xsl:value-of select="@title"/></h1>
				<h2>Success</h2>
				<xsl:apply-templates select="*[local-name() != 'client']"/>
				<h5>Jump to: <xsl:if test="@jumpUrl"><a href="{@jumpUrl}"><xsl:value-of select='@jumpTitle'/></a> or </xsl:if><a href="index">root index menu...</a></h5>
			</body>
		</html>
	</xsl:template>
	<xsl:template match="failed">
		<html>
			<head>
				<title><xsl:value-of select="@title"/></title>
				<link rel="stylesheet" type="text/css" href="/!/skin/skin-standard-html/client/css/default.css" />
				<link rel="stylesheet" type="text/css" href="/!/skin/skin-standard-xml/style.css" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
			</head>
			<body>
				<xsl:apply-templates select="client"/>
				<h1><xsl:value-of select="@title"/></h1>
				<h2>Update Failed</h2>
				<xsl:apply-templates select="*[local-name() != 'client']"/>
				<h5>Jump to: <a href="index">root index menu...</a></h5>
			</body>
		</html>
	</xsl:template>
	<xsl:template match="denied">
		<html>
			<head>
				<title><xsl:value-of select="@title"/></title>
				<link rel="stylesheet" type="text/css" href="/!/skin/skin-standard-html/client/css/default.css" />
				<link rel="stylesheet" type="text/css" href="/!/skin/skin-standard-xml/style.css" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
			</head>
			<body>
				<xsl:apply-templates select="client"/>
				<h1><xsl:value-of select="@title"/></h1>
				<h2>Access Denied</h2>
				<xsl:apply-templates select="*[local-name() != 'client']"/>
				<h5>Jump to: <a href="index">root index menu...</a></h5>
			</body>
		</html>
	</xsl:template>
	<xsl:template match="invalid">
		<html>
			<head>
				<title><xsl:value-of select="@title"/></title>
				<link rel="stylesheet" type="text/css" href="/!/skin/skin-standard-html/client/css/default.css" />
				<link rel="stylesheet" type="text/css" href="/!/skin/skin-standard-xml/style.css" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
			</head>
			<body>
				<xsl:apply-templates select="client"/>
				<h1><xsl:value-of select="@title"/></h1>
				<h2>Invalid Argument</h2>
				<xsl:apply-templates select="*[local-name() != 'client']"/>
				<h5>Jump to: <a href="index">root index menu...</a></h5>
			</body>
		</html>
	</xsl:template>
	<xsl:template match="client">
		<xsl:apply-templates select="client"/>
		<div class="user">
			<table class="collapse">
				<tr>
					<td><img src="/__i/famfamfam.com/silk/user.png" alt="user:"/></td>
					<td><xsl:if test="@userId"><xsl:value-of select="@userId"/> as </xsl:if><xsl:value-of select="@id"/><xsl:if test="@admin='true'"> (admin)</xsl:if></td>
					<xsl:if test="@geo">
						<td><img src="/__f/16x16/{@geo}" title="{@ip} @ {@geo}"/></td>
					</xsl:if>
					<xsl:if test="@command">
						<td><a class="command" href="{@command}"><img border="0" src="/!/public/resources/data/images/famfamfam.com/silk/{@icon}.png"/></a></td>
					</xsl:if>
				</tr>
			</table>
		</div>
	</xsl:template>
	<xsl:template match="reason">
		Reason:<br/>
		<code>
			<xsl:value-of select="."/>
		</code>
	</xsl:template>
	<xsl:template match="detail">
		<code>
			<xsl:value-of select="."/>
		</code>
	</xsl:template>
</xsl:stylesheet><%/FINAL%>