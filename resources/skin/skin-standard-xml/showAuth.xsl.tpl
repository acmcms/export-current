<%FINAL: 'text/xml' %><?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns="http://www.w3.org/1999/xhtml">
	<xsl:output method="html" indent="no"/>
	<xsl:template match="authentication-failed">
		<html class="zoom-document-html">
			<head>
				<title>Authentication failed</title>
				<link rel="stylesheet" type="text/css" href="/!/skin/skin-standard-html/client/css/default.css" />
				<link rel="stylesheet" type="text/css" href="/!/skin/skin-standard-xml/style.css" />
			</head>
			<body class="zoom-document-body">
				<h1>Authentication failed</h1>
				<p>
					This service requires all clients to sign-in. There was an authentication failure:
					<ul>
						<li>
							<a href="?login">Login / Retry</a>
						</li>
					</ul>
				</p>
			</body>
		</html>
	</xsl:template>
	<xsl:template match="authentication-success">
		<html class="zoom-document-html">
			<head>
				<title>Authentication succeed</title>
				<link rel="stylesheet" type="text/css" href="/!/skin/skin-standard-html/client/css/default.css" />
				<link rel="stylesheet" type="text/css" href="/!/skin/skin-standard-xml/style.css" />
				<meta http-equiv="pragma" CONTENT="no-cache" />
				<meta http-equiv="refresh" content="1;URL='?__auth=force'" />
				<script src="/!/skin/skin-jsclient/js/Effects/Busy.js"></script>
				<script>
					function onLoad(){
						var layout = document.getElementById("layout") || document.body;
						new Effects.Busy(layout);
					}
				</script>
			</head>
			<body onload="onLoad()" class="zoom-document-body">
				<h1>Authentication succeed</h1>
				<p>
					<b>You are successfully authenticated</b>.<br />
					<xsl:if test="@uid">Authenticated as: <xsl:value-of select="@uid"/><br/></xsl:if>
					
					<h5>You will be automatically redirected to the root menu...<br />
					Jump to: <a href="index">root index menu...</a></h5>
				</p>
			</body>
		</html>
	</xsl:template>
	<xsl:template match="authentication-logout">
		<html class="zoom-document-html">
			<head>
				<title>Login Credentials Invalidated</title>
				<link rel="stylesheet" type="text/css" href="/!/skin/skin-standard-html/client/css/default.css" />
				<link rel="stylesheet" type="text/css" href="/!/skin/skin-standard-xml/style.css" />
				<meta http-equiv="pragma" CONTENT="no-cache" />
				<meta http-equiv="refresh" content="1;URL='{redirect}'" />
				<script src="/!/skin/skin-jsclient/js/Effects/Busy.js"></script>
				<script>
					function onLoad(){
						var layout = document.getElementById("layout") || document.body;
						new Effects.Busy(layout);
					}
				</script>
			</head>
			<body onload="onLoad()" class="zoom-document-body">
				<h1>Login Credentials Invalidated</h1>
				<p>
					<b>You are successfully logged out</b>.<br />
					<xsl:if test="@uid">Authenticated as: <xsl:value-of select="@uid"/><br/></xsl:if>
					
					<h5>You will be automatically redirected to the root menu...<br />
					Jump to: <a href="index">root index menu...</a></h5>
				</p>
			</body>
		</html>
	</xsl:template>
	<xsl:template match="authenticate">
		<html class="zoom-document-html">
			<head>
				<title>Authentication required</title>
				<link rel="stylesheet" type="text/css" href="/!/skin/skin-standard-html/client/css/default.css" />
				<link rel="stylesheet" type="text/css" href="/!/skin/skin-standard-xml/style.css" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
			</head>
			<body class="zoom-document-body">
				<h1>Authentication required</h1>
				<p>
					This service requires all clients to sign-in. <!--  Choose one of the following options:  -->
					<ul>
						<xsl:if test="secure">
							<table class="collapse">
								<tr>
									<td>
										<img src="/!/public/resources/data/images/famfamfam.com/silk/lock_go.png" style="vertical-align:baseline; margin-right: 2pt"/>
									</td>
									<td>
										<a href="{secure}">Switch to secure connection</a> - navigate to encrypted page,
									</td>
								</tr>
							</table>
						</xsl:if>
						<xsl:if test="certificate">
							<table class="collapse">
								<tr>
									<td>
										<img src="/!/public/resources/data/images/famfamfam.com/silk/accept.png" style="vertical-align:baseline; margin-right: 2pt"/>
									</td>
									<td>
										This <a href="{certificate}">certificate</a> is to be trusted for secure connection with this server,
									</td>
								</tr>
							</table>
						</xsl:if>
						<xsl:if test="not(secure)">
							<table class="collapse">
								<tr>
									<td>
										<img src="/!/public/resources/data/images/famfamfam.com/silk/key_go.png" style="vertical-align:baseline; margin-right: 2pt"/>
									</td>
									<td>
										<a href="?login">Login using basic http authentication</a> - your browser's form<!-- ,
									</td>
								</tr>
							</table>
							<table class="collapse">
								<tr>
									<td>
										<img src="/!/public/resources/data/images/famfamfam.com/silk/key.png" style="vertical-align:baseline; margin-right: 2pt"/>
									</td>
									<td>
										or using form below:
										<form method="POST">
											login: <input type="text" name="login" value="" />
											password: <input type="password" name="password" value="" />
											<input type="submit" value="login" />
										</form> -->
									</td>
								</tr>
							</table>
						</xsl:if>
					</ul>
				</p>
				<xsl:if test="@jumpUrl">
					<h5>Jump to: <a href="{@jumpUrl}"><xsl:value-of select='@jumpTitle'/></a></h5>
				</xsl:if>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet><%/FINAL%>