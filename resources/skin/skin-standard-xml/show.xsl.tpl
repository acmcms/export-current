<%FINAL: 'text/xml' %><%FORMAT: 'xml' %><?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:layout="urn:schemas-myx-ae3:xslt-layouts"
	xmlns="http://www.w3.org/1999/xhtml"
	version="1.0"
	>
	
	<xsl:output method="html" indent="no"/>
	<xsl:decimal-format name="decimal" decimal-separator='.' grouping-separator=' ' />

	<xsl:variable name="clean" select="*/client/@format='clean'"/>

	<xsl:param name="zoom">
		<xsl:choose>
			<xsl:when test="$clean">
				<xsl:text>window</xsl:text>
			</xsl:when>
			<xsl:when test="*/client/@format='document'">
				<xsl:text>document</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>window</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:param>

	<xsl:param name="standalone" select="*/client/@standalone='true'"/>
	<xsl:param name="depth" select="1"/>

	<xsl:variable name="sudo"><xsl:if test="*/client/@userId"><xsl:value-of select="*/client/@id"/></xsl:if></xsl:variable>
	<xsl:variable name="base">
		<xsl:choose>
			<xsl:when test="*/client/@webRoot">
				<xsl:value-of select="*/client/@webRoot"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text></xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="silk"><xsl:value-of select='$base'/>/__i/famfamfam.com/silk/</xsl:variable>

	<xsl:template match="/">
		<html class="zoom-{$zoom}-html" id="html">
			<xsl:comment> zoom: <xsl:value-of select='$zoom'/> </xsl:comment>
			<xsl:comment> sudo: <xsl:value-of select='$sudo'/> </xsl:comment>
			<xsl:comment> stdl: <xsl:value-of select='$standalone'/> </xsl:comment>
			<xsl:comment> make: 20241403T21236Z </xsl:comment>
			<xsl:for-each select="*">
				<head>
					<title>
						<xsl:value-of select='@title | title'/>
						<xsl:if test="@sub-title">
							::
							<xsl:value-of select='@sub-title | title/@sub-title'/>
						</xsl:if>
					</title>
					<xsl:if test="@baseURI">
						<base href="{@baseURI}"/>
					</xsl:if>
					<xsl:choose>
						<xsl:when test="client/@develRoot">
							<link rel="stylesheet" type="text/css" href="{client/@develRoot}/skin-standard-html/client/css/default.css" />
							<link rel="stylesheet" type="text/css" href="{client/@develRoot}/skin-standard-xml/style.css" />
						</xsl:when>
						<xsl:otherwise>
							<link rel="stylesheet" type="text/css" href="{$base}/!/skin/skin-standard-html/client/css/default.css" />
							<link rel="stylesheet" type="text/css" href="{$base}/!/skin/skin-standard-xml/style.css" />
						</xsl:otherwise>
					</xsl:choose>
					<script type="text/javascript" src="{$base}/!/skin/skin-jsclient/js/require.js"></script>
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<style>
						.id{
							font-weight: bold;
							text-align: left;
						}
						.index, .admin {
							text-align: center;
						}
						<xsl:if test="$clean">
							HTML{
								overflow-y:scroll;
								padding:0;
								margin:0;
							}
							BODY{
								font-size:80%;
								padding:0.2em;
								margin:0;
							}
						</xsl:if>
					</style>
					<script>
						if(!window.console || !console.log){
							(window.console || (window.console = {})).log = requireScript("debug.js");
						}else{
							window.debug || (window.debug = function(x){ console.log(x); });
						}
					</script>
					<script>
						var base = '<xsl:value-of select="$base"/>', srot = base + '/!/skin/', irot = base + '/__i/famfamfam.com/silk/';
						var ready = [];
						
						var initAll = function(){
							require.script([
								srot + "skin-jsclient/js/Layouts/Layout.js",
								srot + "skin-jsclient/js/Layouts/Date.js",
								srot + "skin-standard-xml/$files/dates.js",
								srot + "skin-standard-xml/$files/input-label-block-visibility.js",
							], function(){
								initDates();
								initInputDisableInvisible();
							});
							
							<xsl:if test="client/time">
								require.script(srot + "skin-jsclient/js/lib/timecontrol.js");
							</xsl:if>
	
							<xsl:if test="client/menu and not($clean)">
								require.style(srot + "skin-standard-xml/$files/menu.css");
								
								require.script('lib/menu.js', function(Menu){
								
									/* menu properties */
									Menu.loadingItem.icon = "hourglass";
									Menu.loadingItem.title = "Loading...";
									Menu.iconPrefix = irot; 
									Menu.iconSuffix = ".png";
									 
									var span = document.getElementById('ui-main-menu-button');
									/* attach menu */
									Menu.attachMenu( span, { 
										icon : span.getAttribute("icon") || "asterisk_orange", 
										title : span.getAttribute("title"), 
										menusource : span.getAttribute("src")
									} );
									
								});
							</xsl:if>
							
							for(var i = ready.length; i;){
								ready[--i]();
							}
							
							ready = {
								push:function(x){
									setTimeout(x, 15);
								}
							};
							initAll = function(){};
						};
						
						var doConfirm = function(o){
							if(confirm(o.getAttribute('ui-cfm') || 'Are you sure?')){
								var u = o.getAttribute('href');
								window.location.href = u + (u.indexOf('?') === -1 ? '?' : '&amp;') + 'confirmation=yes';
							}
							return false;
						};
					</script>
					<xsl:value-of disable-output-escaping="yes" select="rawHeadData[not($clean)]"/>
				</head>
				<body onload="initAll()" class="zoom-{$zoom}-body" id="body">
					<xsl:if test="client/@ae3 = 'r'">
						<style>
							HTML#html, BODY#body {
								position: relative;
								height: 100%;
								width: 100%;
								margin: 0;
								padding: 0;
								border: 0;
								overflow: hidden;
							}
						</style>
						<template id="web-app">
							<h1>AAAA!</h1>
						</template>
						<script>
							var root = document.getElementById("web-app");
							root.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;background-color:#aaa;overflow:hidden;z-index:1";
	
							document.body.style.margin = 0;
							document.body.innerHTML = '';
							document.body.appendChild(document.importNode(root.content, true));
							
							window.stop ? window.stop() : document.close();
						</script>
					</xsl:if>
					<xsl:if test="client/@ae3 = 'true'">
						<style>
							HTML#html, BODY#body {
								position: relative;
								height: 100%;
								width: 100%;
								margin: 0;
								padding: 0;
								border: 0;
								overflow: hidden;
							}
						</style>
						<script type="text/javascript" src="{$base}/!/skin/skin-jsclient/js/ae3.js"></script>
						<script>
							var root = document.createElement("div");
							root.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;background-color:#aaa;overflow:hidden";
	
							document.body.style.margin = 0;
							document.body.appendChild(root);
					
							ae3.someParameter = "someValue";
							ae3.intl = {
								language : "ru",
								languages : ["en", "ru"]
							};
							
							setTimeout(function(){
								ae3 = new ae3(root);
								ae3.defaultIconBase = irot;
								/* document.getElementById("njT").style.zIndex = 0; */
								ae3.display();
							},0);
							window.stop ? window.stop() : document.close();
	
							if(false){
					
							require.script("ae3.js", function(ae3){
								ae3.someParameter = "someValue";
								ae3.intl = {
									language : "ru",
									languages : ["en", "ru"]
								};
								
								setTimeout(function(){
									ae3 = new ae3(root);
									ae3.defaultIconBase = irot;
									/* document.getElementById("njT").style.zIndex = 0; */
									ae3.display();
								},0);
								window.stop ? window.stop() : document.close();
							});
							document.close();
							
							}
						</script>
					</xsl:if>
					<xsl:if test="not($clean)">
						<div class="pg-root">
							<div class="pg-north">
								<div class="tbar-dn ui-secondary">
									<xsl:for-each select="client">
										<xsl:if test="@id or @icon or @command or time">
											<div class="user">
												<xsl:if test="@id or @icon or @command">
													<table class="collapse">
														<tr>
															<td style="vertical-align: middle"><img src="{$silk}user.png" alt="user:" class="icon" style="padding-right: 2pt"/></td>
															<td style="vertical-align: middle"><xsl:if test="@userId"><xsl:value-of select="@userId"/> as </xsl:if><xsl:value-of select="@id"/><xsl:if test="@admin='true'"> (admin)</xsl:if></td>
															<xsl:if test="@geo">
																<td style="vertical-align: middle"><img src="{$base}/__f/16x16/{@geo}" title="{@ip} @ {@geo}" class="geo-flag" style="padding-left: 2pt"/></td>
															</xsl:if>
															<xsl:if test="@command">
																<td style="vertical-align: middle"><a class="command" href="{@command}"><img src="{$silk}{@icon}.png" class="icon"/></a></td>
															</xsl:if>
														</tr>
													</table>
												</xsl:if>
												<xsl:if test="time">
													<script>
														TimeControl.timezoneDefault = {
															id:"${timeZoneInfo.id}",
															master:"${timeZoneInfo.masterId}",
															short:"${timeZoneInfo.short}",
															name:"${timeZoneInfo.name}",
															offset:${timeZoneInfo.offsetMinutes},
															raw:${timeZoneInfo.offsetMinutesRaw}
														};
														TimeControl.initialize('<xsl:value-of select="time/@mode"/>');
													</script>
												</xsl:if>
											</div>
										</xsl:if>
										<xsl:if test="menu">
											<div class="menu no-print"><a href="/index" class="ui-button"><button id="ui-main-menu-button" class="menu-button no-print" title="{menu/@title}" icon="{menu/@icon}" src="{menu/@src}&amp;___output=html-js"><noscript>
												<xsl:if test="menu/group">
													<xsl:call-template name="noscript-submenu">
														<xsl:with-param name="item" select="menu/group"/>
													</xsl:call-template>
												</xsl:if>
												<xsl:if test="not(menu/group)">
													<div class="ui-menu-noscript count-1">
														<div class="ui-menu-ns-scrn" alt="" title=""><table class="collapse" style="min-width: 100%; white-space: nowrap;"><tr><td>
															<a href="/index" class="ui-cmd-link">
																<div class="ui-cell hl-bn- hl-ui- hl-hd- idx-box-cell">
																	<div class="ui-cmd-icon">
																		<img src="{$silk}house.png" class="icon"/>
																	</div>
																	<div class="ui-cmd-text">
																		Jump: Root Index
																	</div>
																</div>
															</a>
														</td></tr></table></div>
													</div>
												</xsl:if>
												<div class="menu-element">
													<img src="{$silk}house.png" />
													<span>&#x25BC;</span>
												</div>
											</noscript></button></a></div>
										</xsl:if>
										<xsl:apply-templates select="client"/>
									</xsl:for-each>
									<h1 class="ui-pagetitle"><xsl:value-of select='@title | title'/></h1>
									<xsl:if test="@sub-title or title/@sub-title">
										<h3 style="display:none"><xsl:value-of select='@sub-title | title/@sub-title'/></h3>
									</xsl:if>
									<div class="ui-clear"/>
									<xsl:apply-templates select="prefix[$zoom = 'window']"/>
								</div>
							</div>
							<div class="pg-gapc" />
							<div class="pg-main">
								<xsl:if test="$zoom = 'window'">
									<div class="ui-document-out">
										<div class="ui-document-in">
											<xsl:if test="@sub-title or title/@sub-title">
												<!-- <div class="tbar-up ui-blk-caption"><xsl:value-of select='@sub-title | title/@sub-title'/></div> -->
											</xsl:if>
											<xsl:apply-templates select="."/>
										</div>
										<br/><div class="ui-clear" />
									</div>
								</xsl:if>
								<xsl:if test="$zoom != 'window'">
									<xsl:apply-templates select="."/>
									<br/><div class="ui-clear" />
								</xsl:if>
							</div>
							<div class="pg-gapc" />
							<div style2="position:absolute;bottom:0;left:0;width:100%;" class="pg-south">
								<!-- not while ^^^ absolute!   xsl:apply-templates select="suffix[$zoom = 'window']"/ -->
								<div class="tbar-up ui-secondary">
									<table style="width:100%" border="0">
										<tr>
											<td align="left">
												<h5 style="padding:0;margin:0;" class="ui-cmd-link-group">
													<xsl:for-each select="command[@ui = 'jump'] | client/command[@ui = 'jump']">
														<xsl:call-template name="command">
															<xsl:with-param name="format" select="."/>
															<xsl:with-param name="zoom" select="'compact'"/>
															<xsl:with-param name="depth" select="2"/>
														</xsl:call-template>
													</xsl:for-each>
													<xsl:for-each select="../list/next[@uri and (@pending != 'false' or not(@pending))]">
														<a href="{@uri}" class="ui-cmd-link-compact">
															<xsl:value-of select="@title"/>
															<xsl:if test="not(@title)"> next page... </xsl:if>
														</a>
													</xsl:for-each>
													<xsl:if test="@jumpUrl">
														<a href="{@jumpUrl}" class="ui-cmd-link-compact"><xsl:value-of select='@jumpTitle'/></a> 
													</xsl:if>
													<xsl:if test="not(@no-index or @layout = 'menu' or local-name() = 'index')">
														<a href="index" class="ui-cmd-link-compact">index menu...</a>
													</xsl:if>
												</h5>
											</td>
											<xsl:if test="client/@date">
												<td class="hl-ui-small" align="right">
													<date><xsl:value-of select="client/@date"/></date>
												</td>
											</xsl:if>
										</tr>
									</table>
								</div>
							</div>
						</div>
					</xsl:if>
					<xsl:if test="$clean">
						<xsl:apply-templates select="."/>
					</xsl:if>
				</body>
			</xsl:for-each>
		</html>
	</xsl:template>

	<xsl:template name="input-attributes">
		<xsl:param name="format" />

		<xsl:if test="not($format/@disabled = 'true')">
			<xsl:attribute name="x-ui-input">true</xsl:attribute>
		</xsl:if>
		<xsl:if test="$format/@disabled = 'true'">
			<xsl:attribute name="disabled">disabled</xsl:attribute>
		</xsl:if>
		<xsl:if test="not($format/@required = 'false')">
			<xsl:attribute name="required">required</xsl:attribute>
		</xsl:if>
		<xsl:if test="$format/@step">
			<xsl:attribute name="step"><xsl:value-of select="$format/@step"/></xsl:attribute>
		</xsl:if>
		<xsl:if test="$format/@min">
			<xsl:attribute name="min"><xsl:value-of select="$format/@min"/></xsl:attribute>
		</xsl:if>
		<xsl:if test="$format/@max">
			<xsl:attribute name="max"><xsl:value-of select="$format/@max"/></xsl:attribute>
		</xsl:if>
		<xsl:if test="$format/@size">
			<xsl:attribute name="size"><xsl:value-of select="$format/@size"/></xsl:attribute>
		</xsl:if>
		<xsl:if test="$format/@pattern">
			<xsl:attribute name="pattern"><xsl:value-of select='$format/@pattern'/></xsl:attribute>
		</xsl:if>
	</xsl:template>
	
	<xsl:template name="split-list">
		<xsl:param name="format" />
		<xsl:param name="values" select="''" />
		<xsl:param name="separator" select="','" />

		<xsl:choose>
			<xsl:when test="$separator = ''">
			</xsl:when>
			<xsl:when test="$values = ''">
				<!-- zoom: row /-->
				<div class="ui-clear"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:variable name="head" select="substring-before(concat($values, $separator), $separator)" />
				<xsl:variable name="tail" select="substring-after($values, $separator)" />
	
				<span class="ui-sequence-item-compact ui-label ui-left {$format/@itemCssClass}">
					<xsl:value-of select="$head"/>
				</span>
	
				<xsl:call-template name="split-list">
					<xsl:with-param name="format" select="$format" />
					<xsl:with-param name="values" select="$tail" />
					<xsl:with-param name="separator" select="$separator" />
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="formatted">
		<xsl:param name="format" />
		<xsl:param name="value" />
		<xsl:param name="zoom" />
		<xsl:param name="parentInputValue" />
		<xsl:choose>
			<xsl:when test="not($value) and $format and ($format/@value or $format/value)">
				<xsl:call-template name="formatted">
					<xsl:with-param name="format" select="$format"/>
					<xsl:with-param name="value" select="$format/@value | $format/value"/>
					<xsl:with-param name="zoom" select="$zoom"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="not($value) and $format and ($format/@default or $format/default)">
				<xsl:call-template name="formatted">
					<xsl:with-param name="format" select="$format"/>
					<xsl:with-param name="value" select="$format/@default | $format/default"/>
					<xsl:with-param name="zoom" select="$zoom"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$format/@type='input'">
				<xsl:variable name="inputValue">
					<xsl:choose>
						<xsl:when test="$format/@field">
							<xsl:variable name="id" select="$format/@field"/>
							<xsl:value-of select="$value[$id = '.'] | $value/../@*[local-name() = $id]"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="$value"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:variable>
				<xsl:choose>
					<xsl:when test="$format/@variant = 'checkbox'">
						<input type="checkbox" name="{$format/@name}" value="{$inputValue}" x-ui-debug="formatted/input/checkbox {$parentInputValue}">
							<xsl:if test="$format/@selected = '*' or $format/@selected = $inputValue or $value/../@*[$format/@selected and local-name() = $format/@selected]">
								<xsl:attribute name="checked">checked</xsl:attribute>
							</xsl:if>
							<xsl:call-template name="input-attributes">
								<xsl:with-param name="format" select="$format" />
							</xsl:call-template>
						</input>
					</xsl:when>
					<xsl:when test="$format/@variant = 'radio'">
						<input type="radio" name="{$format/@name}" value="{$inputValue}" x-ui-debug="formatted/input/radio {$parentInputValue}">
							<xsl:if test="$format/@selected = $inputValue or $parentInputValue = $inputValue">
								<xsl:attribute name="checked">checked</xsl:attribute>
							</xsl:if>
							<xsl:call-template name="input-attributes">
								<xsl:with-param name="format" select="$format" />
							</xsl:call-template>
						</input>
					</xsl:when>
					<xsl:otherwise>
						<input type="{$format/@variant}" name="{$format/@name}" value="{$inputValue}" x-ui-debug="formatted/input/other">
							<xsl:call-template name="input-attributes">
								<xsl:with-param name="format" select="$format" />
							</xsl:call-template>
						</input>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$format/@variant='boolean'">
				<xsl:choose>
					<xsl:when test="$value = '1' or $value = 'true' or $value = 'TRUE' or $value = 'yes' or $value = 'YES'">
						<xsl:attribute name="x-boolean">true</xsl:attribute>
						YES
					</xsl:when>
					<xsl:when test="$value = '0' or $value = 'false' or $value = 'FALSE' or $value = 'no' or $value = 'NO'">
						<xsl:attribute name="x-boolean">false</xsl:attribute>
						NO
					</xsl:when>
					<xsl:otherwise>
						<xsl:attribute name="x-boolean"/>
						<xsl:value-of select="$value"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$format/@variant='username'">
				<div class="ui-cmd-icon">
					<img src="{$silk}user.png" class="icon"/>
				</div>
				<div class="ui-cmd-text">
					<xsl:value-of select='$value'/>
				</div>
			</xsl:when>
			<xsl:when test="$format/@variant='groupname'">
				<div class="ui-cmd-icon">
					<img src="{$silk}group.png" class="icon"/>
				</div>
				<div class="ui-cmd-text">
					<xsl:value-of select='$value'/>
				</div>
			</xsl:when>
			<xsl:when test="$format/@variant='email'">
				<div class="ui-cmd-icon">
					<img src="{$silk}email.png" class="icon"/>
				</div>
				<div class="ui-cmd-text">
					<xsl:value-of select='$value'/>
				</div>
			</xsl:when>
			<xsl:when test="$format/@variant='code'">
				<div class="code {$format/@cssClass}">
					<xsl:value-of select='$value'/>
				</div>
			</xsl:when>
			<xsl:when test="$format/@variant='geo' or $format/@variant='geo-row'">
				<xsl:choose>
					<xsl:when test="$value = '**' or $value = ''">
						??
					</xsl:when>
					<xsl:when test="$format/@variant='geo-row'">
						<table border="0" class="collapse">
							<tr>
								<td style="vertical-align: middle"><xsl:value-of select='$value'/>,</td>
								<td style="vertical-align: middle"><img src="/__f/16x16/{$value}" title="{$value}" class="geo-flag" style="padding-left:2pt"/></td>
							</tr>
						</table>
					</xsl:when>
					<xsl:otherwise>
						<img src="/__f/16x16/{$value}" title="{$value}" class="geo-flag"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$format/@variant='select'">
				<xsl:if test="not($format/option[@value = $value] | $format/options[@value = $value])">
					<div class="ui-cmd-icon ui-cmd-icon-char ui-icon-unknown"></div>
					<div class="ui-cmd-text">
						<xsl:if test="$format/@type='boolean'">
							<xsl:attribute name="x-{$format/@type}"><xsl:value-of select='$value'/></xsl:attribute>
						</xsl:if>
						<xsl:value-of select="$value"/>
					</div>
				</xsl:if>
				<xsl:for-each select="$format/option[@value = $value] | $format/options[@value = $value]">
					<xsl:if test="@titleShort and @title and ($zoom='column' or $zoom='cell' or $zoom='compact')">
						<xsl:attribute name="title"><xsl:value-of select='@title'/></xsl:attribute>
					</xsl:if>
					<xsl:if test="@icon or $format/@icon">
						<div class="ui-cmd-icon">
							<img src="{$silk}{@icon | $format/@icon[not(@icon)]}.png" class="icon"/>
						</div>
					</xsl:if>
					<div class="ui-cmd-text">
						<xsl:choose>
							<xsl:when test="@titleShort and ($zoom='column' or $zoom='cell' or $zoom='compact')">
								<xsl:value-of select='@titleShort'/>
							</xsl:when>
							<xsl:when test="title[@layout]">
								<xsl:apply-templates select="title"/>
							</xsl:when>
							<xsl:when test="title">
								<xsl:apply-templates select="title/*"/>
							</xsl:when>
							<xsl:otherwise>
								<xsl:if test="$format/@type='boolean'">
									<xsl:attribute name="x-{$format/@type}"><xsl:value-of select='$value'/></xsl:attribute>
								</xsl:if>
								<xsl:value-of select='@title | $value[not(@title)]'/>
							</xsl:otherwise>
						</xsl:choose>
					</div>
				</xsl:for-each>
			</xsl:when>
			<xsl:when test="$format/@variant='split-list'">
				<xsl:call-template name="split-list">
					<xsl:with-param name="format" select="$format"/>
					<xsl:with-param name="values" select="$value"/>
					<xsl:with-param name="separator" select="$format/@separator"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$format/@variant='map'">
				<table class="items">
					<tr><th>#</th><th>key</th><th>value</th></tr>
					<xsl:for-each select="$value/*">
						<tr>
							<td><xsl:value-of select="position()"/></td>
							<td><xsl:value-of select='name(.)'/></td>
							<td>
								<xsl:call-template name="formatted">
									<xsl:with-param name="format" select="."/>
									<xsl:with-param name="value" select="."/>
								</xsl:call-template>
							</td>
						</tr>
					</xsl:for-each>
				</table>
			</xsl:when>
			<xsl:when test="$format/@variant='form'">
				<xsl:for-each select="$format">
					<form action="{@action}" class="ui-form-{$zoom} {$format/@cssClass}">
						<xsl:variable name="fields" select="fields | $format[not(fields)]"/>
						<xsl:if test="@method = 'post' or $fields/field/@type = 'file' or $fields/field/@type = 'editor' or $fields/field/@type = 'password'">
							<xsl:attribute name="method">post</xsl:attribute>
							<xsl:attribute name="enctype">multipart/form-data</xsl:attribute>
						</xsl:if>
						<xsl:attribute name="target">
							<xsl:choose>
								<xsl:when test="@target">
									<xsl:value-of select="@target" />
								</xsl:when>
								<xsl:otherwise>_top</xsl:otherwise>
							</xsl:choose>
						</xsl:attribute>
						<xsl:if test="$sudo != ''"><input type="hidden" name="authUserId" value="{$sudo}" /></xsl:if>
						<xsl:call-template name="edit">
							<xsl:with-param name="format" select="$format"/>
							<xsl:with-param name="values" select="$value"/>
							<xsl:with-param name="zoom" select="$zoom"/>
						</xsl:call-template>
					</form>
				</xsl:for-each>
			</xsl:when>
			<xsl:when test="$format/@variant='edit'">
				<xsl:call-template name="edit">
					<xsl:with-param name="format" select="$format"/>
					<xsl:with-param name="values" select="$value"/>
					<xsl:with-param name="zoom" select="$zoom"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$format/@variant='view'">
				<xsl:call-template name="view">
					<xsl:with-param name="format" select="$format"/>
					<xsl:with-param name="values" select="$value"/>
					<xsl:with-param name="zoom" select="$zoom"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$format/@variant='list'">
				<xsl:call-template name="list">
					<xsl:with-param name="list" select="$format"/>
					<xsl:with-param name="rows" select="$value/item | $value/*[local-name() = $format/@elementName]"/>
					<xsl:with-param name="zoom" select="$zoom"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$format/@variant='rows'">
				<xsl:call-template name="rows">
					<xsl:with-param name="elements" select="$format/rows/*"/>
					<xsl:with-param name="format" select="$format"/>
					<xsl:with-param name="value" select="$value"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$format/@variant='sequence'">
				<xsl:call-template name="sequence">
					<xsl:with-param name="elements" select="$format/sequence/*"/>
					<xsl:with-param name="format" select="$format"/>
					<xsl:with-param name="value" select="$value"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$format/@variant='layout'">
				<xsl:apply-templates select="$value"/>
			</xsl:when>
			<xsl:when test="$format/@variant='document-url'">
				<xsl:variable name="href">
					<xsl:choose>
						<xsl:when test="$format/@id = '.' and $format/@field = '.' and $value">
							<xsl:value-of select="$format/@prefix"/><xsl:value-of select="$value"/>
						</xsl:when>
						<xsl:when test="$format/@id = '.' and $format/@field and $value">
							<xsl:value-of select="$format/@prefix"/><xsl:value-of select="$value/@*[local-name() = $format/@field] | $value/*[local-name() = $format/@field]"/>
						</xsl:when>
						<xsl:when test="$format/@field = '.' and $value">
							<xsl:value-of select="$format/@prefix"/><xsl:value-of select="$value"/>
						</xsl:when>
						<xsl:when test="$format/@field and $value">
							<xsl:value-of select="$format/@prefix"/><xsl:value-of select="$value/../@*[local-name() = $format/@field] | $value/../*[local-name() = $format/@field]"/>
						</xsl:when>
						<xsl:when test="$format/@url">
							<xsl:value-of select="$format/@url"/>
						</xsl:when>
						<xsl:when test="$format/@href">
							<xsl:value-of select="$format/@href"/>
						</xsl:when>
						<xsl:when test="$value/@url">
							<xsl:value-of select="$value/@url"/>
						</xsl:when>
						<xsl:when test="$value/@src">
							<xsl:value-of select="$format/@prefix"/><xsl:value-of select="$value/@src"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="$format/@prefix"/><xsl:value-of select="$value"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:variable>
				<xsl:choose>
					<xsl:when test="$standalone">
						<xsl:apply-templates select="document($href)/*">
							<xsl:with-param name="zoom" select="$zoom"/>
						</xsl:apply-templates>
					</xsl:when>
					<xsl:otherwise>
						<noscript>
							<iframe 
								sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
								src="{$href}&amp;format=clean" 
								seamless="seamless" 
								style="display:block;position:relative;width:100%;max-height:100%;min-height:3em;border:0;padding:0;margin:0;overflow:auto">
							</iframe>
							<div class="ui-secondary">
								<div class="ui-cmd-icon">
									<img src="{$silk}link_go.png" class="icon"/>
								</div>
								<div class="ui-cmd-text">
									<a target="_top" href="{$href}" class="ui-cmd-link">open...</a>
								</div>
							</div>
						</noscript>
						<div id="{generate-id($value)}{generate-id($format)}" style="position:relative;font-size:85%"/>
						<script><![CDATA[
						
							ready.push((function(){
								var target = document.getElementById(this.id);
								if(!target){
									alert("no element: " + this.id);
									return;
								}
								target.style.minHeight = "4em";
								
								var ob = {
									/* earlier if possible */
									progress : window.Effects && Effects.Busy && new Effects.Busy(target),
									waiting : true
								};
								
								var div = document.createElement('div'), st = div.style;
								st.position='absolute';
								st.width=0;
								st.height=0;
								target.appendChild(div);
								
								var src = this.src;
								
								require("Utils.Comms", function(Comms){
									Comms.createFrame(div, src, function(x){
										ob.waiting = false;
										ob.progress && (ob.progress.destroy(), ob.progress = null);
										for(var c = x.body.firstChild, n; c; c = n){
											n = c.nextSibling;
											target.appendChild(c);
										}
										target.removeChild(div);
										target.style.minHeight = undefined;
									});
								});
								
								require("Effects.Busy", function(Busy){
									ob.waiting && !ob.progress && (ob.progress = new Busy(target));
								});

							}).bind({ ]]>
								id:"<xsl:value-of select='generate-id($value)'/><xsl:value-of select='generate-id($format)'/>",
								src:"<xsl:value-of select='$href'/>&amp;format=clean"
							<![CDATA[ }));
							
						]]></script>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$format/@variant='date'">
				<date><xsl:value-of select="$value"/></date>
			</xsl:when>
			<xsl:when test="$format/@variant='video'">
				<xsl:choose>
					<xsl:when test="$format/@template='youtube'">
						<div style="position:relative;min-width:320px;width:100%;padding-bottom:55%;float:left;height:0;">
							<iframe style="width:100%;height:100%;position:absolute" src="//www.youtube.com/embed/{$value}" frameborder="0" allowfullscreen="true"></iframe>
						</div>
					</xsl:when>
					<xsl:otherwise>
						<div style="position:relative;min-width:320px;width:100%;padding-bottom:55%;float:left;height:0;">
							<video style="width:100%;height:100%;position:absolute" controls="true">
								<source src="{$value}" />
								Your browser does not support the video tag.
							</video>
						</div>
						<xsl:value-of select="$value"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$format/@variant='icon'">
				<img src="{$silk}{$format/@icon}.png" class="icon"/>
			</xsl:when>
			<xsl:when test="$format/@variant='link'">
				<xsl:variable name="href">
					<xsl:choose>
						<xsl:when test="$format/@field = '.'">
							<xsl:value-of select="$value"/>
						</xsl:when>
						<xsl:when test="$format/@field">
							<xsl:variable name="id" select="$format/@field"/>
							<xsl:value-of select="$value/../@*[local-name() = $id] | $value/../*[local-name() = $id]"/>
						</xsl:when>
						<xsl:when test="$format/@href">
							<xsl:value-of select="$format/@href"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="$value"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:variable>
				<xsl:choose>
					<xsl:when test="$format/@icon">
						<div class="ui-cmd-icon">
							<img src="{$silk}{$format/@icon}.png" class="icon"/>
						</div>
						<div class="ui-cmd-text">
							<a>
								<xsl:if test="not($format/@field) or $href != ''">
									<xsl:attribute name="href"><xsl:value-of select="$format/@prefix"/><xsl:value-of select="$href"/><xsl:value-of select="$format/@suffix"/></xsl:attribute>
								</xsl:if>
								<xsl:if test="$format/@anchor">
									<xsl:attribute name="name"><xsl:value-of select="$format/@anchor"/></xsl:attribute>
								</xsl:if>
								<xsl:apply-templates select="$value"/>
							</a>
						</div>
					</xsl:when>
					<xsl:otherwise>
						<a>
							<xsl:if test="not($format/@field) or $href">
								<xsl:attribute name="href"><xsl:value-of select="$format/@prefix"/><xsl:value-of select="$href"/><xsl:value-of select="$format/@suffix"/></xsl:attribute>
							</xsl:if>
							<xsl:if test="$format/@anchor">
								<xsl:attribute name="name"><xsl:value-of select="$format/@anchor"/></xsl:attribute>
							</xsl:if>
							<xsl:apply-templates select="$value"/>
						</a>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$format/@variant='period' and string(number($value))!='NaN'">
				<xsl:attribute name="data-type">numeric</xsl:attribute>
				<xsl:variable name="scaleSetting">
					<xsl:choose>
						<xsl:when test="$format/@scale and $format/@scale!=''">
							<xsl:value-of select="number($format/@scale)"/>
						</xsl:when>
						<xsl:otherwise>
							1
						</xsl:otherwise>
					</xsl:choose>
				</xsl:variable>
				<xsl:variable name="scale" select="number($scaleSetting)"/>
				<xsl:variable name="number" select="number($value) * $scale"/>
				<xsl:choose>
					<xsl:when test="$number &gt; 99900000"><span title="{$value} of {$scale} ms time units"><xsl:value-of select="format-number($number div 86400000, '### ##0.0', 'decimal')"/>&#160;d</span></xsl:when>
					<xsl:when test="$number &gt; 86400000"><span title="{$value} of {$scale} ms time units"><xsl:value-of select="format-number($number div 86400000, '### ##0.00', 'decimal')"/>&#160;d</span></xsl:when>
					<xsl:when test="$number &gt; 7200000"><span title="{$value} of {$scale} ms time units"><xsl:value-of select="format-number($number div 3600000, '### ##0.0', 'decimal')"/>&#160;h</span></xsl:when>
					<xsl:when test="$number &gt; 3600000"><span title="{$value} of {$scale} ms time units"><xsl:value-of select="format-number($number div 3600000, '### ##0.00', 'decimal')"/>&#160;h</span></xsl:when>
					<xsl:when test="$number &gt; 300000"><span title="{$value} of {$scale} ms time units"><xsl:value-of select="format-number($number div 60000, '### ##0.0', 'decimal')"/>&#160;m</span></xsl:when>
					<xsl:when test="$number &gt; 120000"><span title="{$value} of {$scale} ms time units"><xsl:value-of select="format-number($number div 60000, '### ##0.0', 'decimal')"/>&#160;m</span></xsl:when>
					<xsl:when test="$number &gt; 60000"><span title="{$value} of {$scale} ms time units"><xsl:value-of select="format-number($number div 60000, '### ##0.00', 'decimal')"/>&#160;m</span></xsl:when>
					<xsl:when test="$number &gt; 5500"><span title="{$value} of {$scale} ms time units"><xsl:value-of select="format-number($number div 1000, '### ##0.0', 'decimal')"/>&#160;s</span></xsl:when>
					<xsl:when test="$number &gt; 2200"><span title="{$value} of {$scale} ms time units"><xsl:value-of select="format-number($number div 1000, '### ##0.00', 'decimal')"/>&#160;s</span></xsl:when>
					<xsl:otherwise><span title="{$value} of {$scale} ms time units"><xsl:value-of select="format-number($number, '### ##0', 'decimal')"/>&#160;ms</span></xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$format/@variant='integer' and string(number($value))!='NaN'">
				<xsl:attribute name="data-type">numeric</xsl:attribute>
				<xsl:value-of select="format-number(number($value),'### ##0', 'decimal')" />
			</xsl:when>
			<xsl:when test="$format/@variant='price' and string(number($value))!='NaN'">
				<xsl:attribute name="data-type">numeric</xsl:attribute>
				<xsl:value-of select="format-number(number($value),'### ##0.00', 'decimal')"/>
			</xsl:when>
			<xsl:when test="$format/@variant='decimal' and string(number($value))!='NaN'">
				<xsl:attribute name="data-type">numeric</xsl:attribute>
				<xsl:value-of select="format-number(number($value),'### ##0.000', 'decimal')"/>
			</xsl:when>
			<xsl:when test="$format/@variant='bytes' and string(number($value))!='NaN'">
				<xsl:attribute name="data-type">numeric</xsl:attribute>
				<xsl:variable name="number" select="number($value)"/>
				<xsl:choose>
					<xsl:when test="$number &gt; 115343360000"><xsl:value-of select="format-number($number div 1073741824, '### ##0', 'decimal')"/>GB</xsl:when>
					<xsl:when test="$number &gt; 11534336000"><xsl:value-of select="format-number($number div 1073741824, '### ##0.0', 'decimal')"/>GB</xsl:when>
					<xsl:when test="$number &gt; 1153433600"><xsl:value-of select="format-number($number div 1073741824, '### ##0.00', 'decimal')"/>GB</xsl:when>
					<xsl:when test="$number &gt; 112640000"><xsl:value-of select="format-number($number div 1048576, '### ##0', 'decimal')"/>MB</xsl:when>
					<xsl:when test="$number &gt; 11264000"><xsl:value-of select="format-number($number div 1048576, '### ##0.0', 'decimal')"/>MB</xsl:when>
					<xsl:when test="$number &gt; 1126400"><xsl:value-of select="format-number($number div 1048576, '### ##0.00', 'decimal')"/>MB</xsl:when>
					<xsl:when test="$number &gt; 110000"><xsl:value-of select="format-number($number div 1024, '### ##0', 'decimal')"/>KB</xsl:when>
					<xsl:when test="$number &gt; 11000"><xsl:value-of select="format-number($number div 1024, '### ##0.0', 'decimal')"/>KB</xsl:when>
					<xsl:when test="$number &gt; 1100"><xsl:value-of select="format-number($number div 1024, '### ##0.00', 'decimal')"/>KB</xsl:when>
					<xsl:otherwise><xsl:value-of select="format-number($number, '### ##0', 'decimal')"/>B</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$value/@formatted">
				<xsl:apply-templates select="$value/@formatted"/>
			</xsl:when>
			<xsl:when test="$value and $value!=''">
				<xsl:apply-templates select="$value"/>
			</xsl:when>
			<xsl:otherwise>
				&#160;
			</xsl:otherwise>
		</xsl:choose>
		<xsl:if test="($format/@name or $format/@field) and $value and $format/@type='constant'">
			<xsl:variable name="fieldName"><xsl:value-of select="$format/@field"/><xsl:value-of select="$format/@name[not($format/@field)]"/></xsl:variable>
			<xsl:if test="$fieldName and $fieldName != '' and $fieldName != '.' and not($format/@disabled = 'true')">
				<input type="hidden" name="{$fieldName}" value="{$value}" x-ui-input="true" />
			</xsl:if>
		</xsl:if>
	</xsl:template>

	<xsl:template match="formatted | *[@layout='formatted']">
		<xsl:param name="zoom"><xsl:value-of select="@zoom" /><xsl:if test="not(@zoom)"><xsl:value-of select="$zoom" /></xsl:if></xsl:param>
		<span>
			<xsl:call-template name="formatted">
				<xsl:with-param name="format" select="."/>
				<xsl:with-param name="value" select="@value | value | text()[not(@value) and not(value)]"/>
				<!-- xsl:with-param name="value" select="(@value | value | text())[1]"/ -->
				<xsl:with-param name="zoom" select="$zoom"/>
			</xsl:call-template>
		</span>
	</xsl:template>

	<xsl:template name="list">
		<xsl:param name="list" />
		<xsl:param name="rows" />
		<xsl:param name="zoom" />
		<xsl:param name="parentInputValue" />

		<xsl:variable name="columns" select="$list/columns | $rows/../columns[not($list/columns)]"/>

		<xsl:variable name="titleColumn" select="$columns/column[@disposition = 'title'][position() = 1]"/>
		<xsl:variable name="rowspanCount" select="1 + count($titleColumn)"/>
		<xsl:variable name="colspanCount" select="1 + (count($columns/column) - 2) * count($titleColumn)"/>
		<xsl:variable name="line1" select="$columns/column[not(@variant = 'hidden') and ((@id = $titleColumn/@id) or not($titleColumn))]"/>
		<xsl:variable name="line2" select="$columns/column[not(@variant = 'hidden') and (not(@id = $titleColumn/@id) and ($titleColumn))]"/>

		<xsl:if test="$zoom = 'document'">
			<xsl:apply-templates select="$list/prefix[not($clean) or @important = 'true']"/>
		</xsl:if>

		<div class="ui-table-screen-{$zoom}" x-ui-debug="list {$zoom} {$parentInputValue}">
		<div class="ui-table-container">
		<div class="table-list">
		<table class="table ui-list-table-{$zoom}">
			<xsl:if test="$list/@cssId">
				<xsl:attribute name="id">
					<xsl:value-of select="$list/@cssId" />
				</xsl:attribute>
			</xsl:if>
			<thead>
				<tr class="ui-cell hl-bn-none">
					<th class="index" rowspan="{$rowspanCount}">#</th>
					<xsl:for-each select="$line1">
						<th class="{@id} {@extraClass}" colspan="{$colspanCount}">
							<xsl:if test="@icon">
								<div class="ui-cmd-icon">
									<img src="{$silk}{@icon}.png" class="icon"/>
								</div>
								<div class="ui-cmd-text">
									<xsl:call-template name="formats-title">
										<xsl:with-param name="format" select="."/>
									</xsl:call-template>
								</div>
							</xsl:if>
							<xsl:if test="not(@icon)">
								<xsl:call-template name="formats-title">
									<xsl:with-param name="format" select="."/>
								</xsl:call-template>
							</xsl:if>
						</th>
					</xsl:for-each>
					<xsl:for-each select="$columns/command">
						<th class="{@id}" rowspan="{$rowspanCount}" x-ui-debug="list/column {@id}">
							<a class="command" title="{@title}">
								<img src="{$silk}{@icon}.png" class="icon"/>
							</a>
						</th>
					</xsl:for-each>
				</tr>
				<xsl:if test="count($line2) &gt; 0">
					<tr class="ui-cell hl-bn-none" x-ui-debug="list/head/line2">
						<xsl:for-each select="$line2">
							<th class="{@id} {@extraClass}" x-ui-debug="list/line2/column {@id}">
								<xsl:call-template name="formats-title">
									<xsl:with-param name="format" select="."/>
								</xsl:call-template>
							</th>
						</xsl:for-each>
					</tr>
				</xsl:if>
			</thead>
			<tbody class="table-list-tbody">
				<xsl:for-each select="$rows">
					<xsl:variable name="row" select="."/>
					<tr class="ui-cell hl-bn-{@hl}">
						<td class="index" rowspan="{$rowspanCount}">
							<xsl:value-of select="position()"/>
						</td>
						<xsl:for-each select="$line1">
							<td class="{@id} {@extraClass} cell-tp-{@type}" colspan="{$colspanCount}">
								<xsl:variable name="cellColumn" select="."/>
								<xsl:variable name="cellZoom"><xsl:value-of select="@zoom" /><xsl:if test="not(@zoom)">compact</xsl:if></xsl:variable>
								<xsl:for-each select="$row[$cellColumn/@id = '.'] | $row/@*[local-name() = $cellColumn/@id] | $row/*[local-name() = $cellColumn/@id] | $row[not($cellColumn/@id)]">
									<xsl:call-template name="formatted">
										<xsl:with-param name="format" select="$cellColumn"/>
										<xsl:with-param name="value" select="."/>
										<xsl:with-param name="parentInputValue" select="$parentInputValue"/>
										<xsl:with-param name="zoom" select="$cellZoom"/>
									</xsl:call-template>
								</xsl:for-each>
							</td>
						</xsl:for-each>
						<xsl:for-each select="$columns/command">
							<xsl:variable name="id" select="@field"/>
							<xsl:variable name="href" select="$row[$id = '.'] | $row/@*[local-name() = $id] | $row/*[local-name() = $id]"/>
							<xsl:variable name="suffix">
								<xsl:choose>
									<xsl:when test="suffix/@type = 'page-attribute'">
										<xsl:variable name="name" select="suffix/@name"/>
										<xsl:value-of select="//@*[local-name() = $name]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="@suffix"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:variable>
							<td class="{@icon}" rowspan="{$rowspanCount}">
								<xsl:if test="$href and $href!=''">
									<a class="command" target="_top" href="{@prefix}{$href}{$suffix}" title="{@title}"><img src="{$silk}{@icon}.png" class="icon"/></a>
								</xsl:if>
							</td>
						</xsl:for-each>
					</tr>
					<xsl:if test="$line2">
						<tr class="ui-cell hl-bn-{@hl}">
							<xsl:for-each select="$line2">
								<td class="{@id} {@extraClass} cell-tp-{@type}">
									<xsl:variable name="cellColumn" select="."/>
									<xsl:variable name="cellZoom"><xsl:value-of select="@zoom" /><xsl:if test="not(@zoom)">compact</xsl:if></xsl:variable>
									<xsl:for-each select="$row[$cellColumn/@id = '.'] | $row/@*[local-name() = $cellColumn/@id] | $row/*[local-name() = $cellColumn/@id] | $row[not($cellColumn/@id)]">
										<xsl:call-template name="formatted">
											<xsl:with-param name="format" select="$cellColumn"/>
											<xsl:with-param name="value" select="."/>
											<xsl:with-param name="parentInputValue" select="$parentInputValue"/>
											<xsl:with-param name="zoom" select="$cellZoom"/>
										</xsl:call-template>
									</xsl:for-each>
								</td>
							</xsl:for-each>
						</tr>
					</xsl:if>
				</xsl:for-each>
			</tbody>
		</table>
		</div>
		</div>
		</div>

		<xsl:if test="$list/help or $list/command or $list/submit">
			<div class="submit" x-ui-debug="list/actions {$parentInputValue}">
				<xsl:call-template name="command-bar">
					<xsl:with-param name="parent" select="$list"/>
				</xsl:call-template>
			</div>
		</xsl:if>

		<xsl:if test="$zoom != 'compact'">
			<xsl:apply-templates select="$list/suffix[not($clean) or @important = 'true']"/>
		</xsl:if>

	</xsl:template>

	<xsl:template match="list | *[@layout='list']">
		<!-- xsl:param name="value" select="."/ -->
		<xsl:param name="zoom"><xsl:value-of select="@zoom" /><xsl:if test="not(@zoom)"><xsl:value-of select="$zoom" /></xsl:if></xsl:param>
		<xsl:variable name="value" select="."/>
		<xsl:variable name="itemZoom">
			<xsl:choose>
				<xsl:when test="$zoom = 'document' or $zoom = 'window'">
					<xsl:text>row</xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<xsl:text>compact</xsl:text>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="@elementName and *[local-name() = $value/@elementName]">
				<xsl:call-template name="list">
					<xsl:with-param name="list" select="."/>
					<xsl:with-param name="rows" select="*[local-name() = $value/@elementName]"/>
					<xsl:with-param name="zoom" select="$zoom"/>
				</xsl:call-template>
				<xsl:comment> l: 901 ^ </xsl:comment>
			</xsl:when>
			<xsl:when test="@elementName">
				<xsl:call-template name="list">
					<xsl:with-param name="list" select="."/>
					<xsl:with-param name="rows" select="$value/*[local-name() = $value/@elementName]"/>
					<xsl:with-param name="zoom" select="$zoom"/>
				</xsl:call-template>
				<xsl:comment> l: 909 ^ </xsl:comment>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="list">
					<xsl:with-param name="list" select="."/>
					<xsl:with-param name="rows" select="item | $value/item[not(item)]"/>
					<xsl:with-param name="zoom" select="$zoom"/>
				</xsl:call-template>
				<xsl:comment> l: 917 ^ </xsl:comment>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="input">
		<xsl:param name="format" />
		<xsl:param name="value" />
		<xsl:param name="zoom" />
		<xsl:choose>
			<xsl:when test="$format/@type='constant'">
				<span x-ui-debug="input/constant {$zoom}"><xsl:call-template name="formatted">
					<xsl:with-param name="format" select="$format"/>
					<xsl:with-param name="value" select="$value"/>
					<xsl:with-param name="zoom" select="$zoom"/>
				</xsl:call-template></span>
			</xsl:when>
			<xsl:when test="$format/@type='price' or $format/@variant='price'">
				<input type="number" step="0.01" min="0" name="{$format/@name}" value="{$value}" x-ui-debug="input/price {$zoom}">
					<xsl:call-template name="input-attributes">
						<xsl:with-param name="format" select="$format" />
					</xsl:call-template>
				</input>
			</xsl:when>
			<xsl:when test="$format/@type='text' or $format/@type='editor' or $format/@variant='editor'">
				<textarea class="ui-fld-editor-textarea {$format/@cssClass}" name="{$format/@name}" x-ui-debug="input/textarea {$zoom}"><xsl:value-of select='$value'/></textarea>
			</xsl:when>
			<xsl:when test="$format/@type='file'">
				<input type="file" name="{$format/@name}" x-ui-debug="input/file {$zoom}" />
			</xsl:when>
			<xsl:when test="$format/@type='link'">
				<a href="{$format/@param}{$value}">
					<xsl:attribute name="target">
						<xsl:choose>
							<xsl:when test="$format/@target">
								<xsl:value-of select="$format/@target" />
							</xsl:when>
							<xsl:otherwise>_top</xsl:otherwise>
						</xsl:choose>
					</xsl:attribute>
					<xsl:apply-templates select="$value"/>
				</a>
				<xsl:if test="not($format/@disabled = 'true')">
					<input type="hidden" name="{$format/@name}" value="{$value}" x-ui-input="true" />
				</xsl:if>
			</xsl:when>
			<xsl:when test="$format/@type='boolean'">
				<select type="select" name="{$format/@name}" value="{$value}">
					<xsl:choose>
						<xsl:when test="not($value) or $value='' or $value='false' or $value='no' or $value='FALSE' or $value='NO' or $value='0'">
							<option icon="cross" value="" selected="selected">NO (false)</option>
							<option icon="tick" value="true">YES (true)</option>
						</xsl:when>
						<xsl:when test="$value='true' or $value='yes' or $value='TRUE' or $value='YES' or $value='1'">
							<option icon="tick" value="true" selected="selected">YES (true)</option>
							<option icon="cross" value="">NO (false)</option>
						</xsl:when>
						<xsl:otherwise>
							<option icon="help" value="{$value}" selected="selected">
								Unknown: <xsl:value-of select='$value'/>
							</option>
							<option icon="cross" value="">NO (false)</option>
							<option icon="tick" value="true">YES (true)</option>
						</xsl:otherwise>
					</xsl:choose>
				</select>
			</xsl:when>
			<xsl:when test="$format/@type='select'">
				<xsl:choose>
					<xsl:when test="list">
						<xsl:call-template name="list">
							<xsl:with-param name="list" select="$format/list"/>
							<xsl:with-param name="rows" select="$format/list/rows | options[not($format/list/rows)]"/>
							<xsl:with-param name="zoom" select="'row'"/>
							<xsl:with-param name="parentInputValue" select="$value"/>
						</xsl:call-template>
					</xsl:when>
					<xsl:when test="$format/@variant='tabs'">
						<div x-ui-debug="input/select/tabs {$parentInputValue}">
							<xsl:variable name="id" select="generate-id($format)"/>
							<style><xsl:for-each select="option | options">
									#m<xsl:value-of select='$id'/>-<xsl:value-of select='@value'/>:checked ~ #s<xsl:value-of select="$id"/>-<xsl:value-of select="@value"/>{ display: block; }
							</xsl:for-each></style>
							<xsl:for-each select="option | options">
								<input id="m{$id}-{@value}" type="radio" name="{$format/@name}" value="{@value}" class="el-radio st-radio-tab">
									<xsl:if test="$value = @value">
										<xsl:attribute name="checked">checked</xsl:attribute>
									</xsl:if>
									<xsl:call-template name="input-attributes">
										<xsl:with-param name="format" select="$format" />
									</xsl:call-template>
								</input><label for="m{$id}-{@value}" class="el-radio st-radio-tab"><xsl:value-of select='@title'/></label>
							</xsl:for-each>
							<xsl:for-each select="option | options">
								<div id="s{$id}-{@value}" class="el-radio-tab-item">
									<xsl:value-of select='@title'/>
									<xsl:call-template name="edit">
										<xsl:with-param name="format" select="fields"/>
										<xsl:with-param name="values" select="values"/>
										<xsl:with-param name="zoom" select="$zoom"/>
									</xsl:call-template>
								</div>
							</xsl:for-each>
						</div>
					</xsl:when>
					<xsl:when test="$format/@variant='edit'">
						<div x-ui-debug="input/select/edit">
							<xsl:variable name="id" select="generate-id($format)"/>
							<xsl:variable name="itemZoom"><xsl:value-of select="$format/@zoom" /><xsl:if test="not($format/@zoom)"><xsl:value-of select="$zoom" /></xsl:if></xsl:variable>
							<xsl:for-each select="option | options">
								<input id="m{$id}-{@value}" type="radio" name="{$format/@name}" value="{@value}" class="el-radio st-radio-sel">
									<xsl:if test="$value = @value">
										<xsl:attribute name="checked">checked</xsl:attribute>
									</xsl:if>
									<xsl:call-template name="input-attributes">
										<xsl:with-param name="format" select="$format" />
									</xsl:call-template>
								</input><label for="m{$id}-{@value}" class="el-radio st-radio-sel">
									<xsl:value-of select='@title'/>
								</label><div id="s{$id}-{@value}" class="el-radio-sel-item">
									<xsl:call-template name="edit">
										<xsl:with-param name="format" select="fields"/>
										<xsl:with-param name="values" select="values"/>
										<xsl:with-param name="zoom" select="$itemZoom"/>
									</xsl:call-template>
								</div>
							</xsl:for-each>
						</div>
					</xsl:when>
					<xsl:when test="$format/@variant='radio'">
						<div x-ui-debug="input/select/radio">
							<xsl:variable name="id" select="generate-id($format)"/>
							<style><xsl:for-each select="option | options">
									#m<xsl:value-of select='$id'/>-<xsl:value-of select='@value'/>:checked ~ #s<xsl:value-of select="$id"/>-<xsl:value-of select="@value"/>{ display: block; }
							</xsl:for-each></style>
							<xsl:for-each select="option | options">
								<input id="m{$id}-{@value}" type="radio" name="{$format/@name}" value="{@value}" class="el-radio st-radio-sel">
									<xsl:if test="$value = @value">
										<xsl:attribute name="checked">checked</xsl:attribute>
									</xsl:if>
									<xsl:call-template name="input-attributes">
										<xsl:with-param name="format" select="$format" />
									</xsl:call-template>
								</input><label for="m{$id}-{@value}" class="el-radio st-radio-sel"><xsl:value-of select='@title'/></label>
							</xsl:for-each>
						</div>
					</xsl:when>
					<xsl:otherwise>
						<select type="select" name="{$format/@name}" value="{$value}">
							<xsl:call-template name="input-attributes">
								<xsl:with-param name="format" select="$format" />
							</xsl:call-template>
							<xsl:for-each select="option | options">
								<option value="{@value}">
									<xsl:if test="$value = @value">
										<xsl:attribute name="selected">selected</xsl:attribute>
									</xsl:if>
									<xsl:if test="not(@value) or 'true' = @disabled">
										<xsl:attribute name="disabled">true</xsl:attribute>
									</xsl:if>
									<xsl:value-of select='@title'/>
								</option>
							</xsl:for-each>
						</select>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$format/@type='set'">
				<xsl:choose>
					<xsl:when test="list">
						<xsl:call-template name="list">
							<xsl:with-param name="list" select="$format/list"/>
							<xsl:with-param name="rows" select="$format/list/rows | options[not($format/list/rows)]"/>
							<xsl:with-param name="zoom" select="'row'"/>
						</xsl:call-template>
					</xsl:when>
					<xsl:otherwise>
						<table value="{$value}">
							<xsl:for-each select="option | options">
								<tr><label><td><input type="checkbox" name="{$format/@name}" value="{@value}">
									<xsl:if test="$format/@selected = '*' or $format/@selected = @value or @*[$format/@selected and local-name() = $format/@selected]">
										<xsl:attribute name="checked">checked</xsl:attribute>
									</xsl:if>
								</input></td><td><xsl:value-of select="@title"/></td></label></tr>
							</xsl:for-each>
						</table>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<input type="{$format/@type}" name="{$format/@name}" value="{$value}">
					<xsl:call-template name="input-attributes">
						<xsl:with-param name="format" select="$format" />
					</xsl:call-template>
				</input>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:for-each select="$format">
			<xsl:call-template name="hint"/>
		</xsl:for-each>
	</xsl:template>

	<xsl:template match="input">
		<xsl:param name="value" />
		<xsl:variable name="fieldName">
			<xsl:choose>
				<xsl:when test="@field"><xsl:value-of select="@field"/></xsl:when>
				<xsl:otherwise><xsl:value-of select="@name"/></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:call-template name="input">
			<xsl:with-param name="format" select="."/>
			<xsl:with-param name="value" select="$value/../*[local-name() = $fieldName] | $value/@*[local-name() = $fieldName]"/>
			<xsl:with-param name="zoom" select="$zoom"/>
		</xsl:call-template>
	</xsl:template>


	<xsl:template name="select-view">
		<xsl:param name="format" />
		<xsl:param name="values" />
		<xsl:param name="zoom" />
		<xsl:variable name="itemZoom">
			<xsl:choose>
				<xsl:when test="$zoom = 'document' or $zoom = 'window'">
					<xsl:text>row</xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<xsl:text>compact</xsl:text>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>

		<xsl:if test="$zoom = 'document'">
			<xsl:apply-templates select="$format/prefix[not($clean) or @important = 'true']"/>
		</xsl:if>

		<div class="ui-table-screen-{$zoom}">
		<div class="ui-table-container">
		<div class="table-edit">
			<div class="table ui-edit-table-{$zoom} ui-select-view">
				<xsl:variable name="id" select="generate-id($format)"/>
				<xsl:for-each select="$format/option">
					<div class="ui-cell hl-bn-user hl-hd-false hl-ui-true idx-box-cell">
						<xsl:variable name="ido" select="generate-id(.)"/>
						<input id="m{$id}-{$ido}" type="radio" name="{$id}" value="{$ido}" class="el-radio st-radio-sel">
							<xsl:if test="$values/value = @value">
								<xsl:attribute name="checked">checked</xsl:attribute>
							</xsl:if>
							<xsl:call-template name="input-attributes">
								<xsl:with-param name="format" select="$format" />
							</xsl:call-template>
						</input><label for="m{$id}-{$ido}" class="el-radio st-radio-sel">
							<xsl:value-of select='@title'/>
						</label><div id="s{$id}-{$ido}" class="el-radio-sel-item">
							<xsl:apply-templates select="."/>
						</div>
					</div>
				</xsl:for-each>
			</div>
		</div>
		</div>
		</div>
		<xsl:if test="$format/help or $format/command or $format/submit">
			<div class="submit">
				<xsl:call-template name="command-bar">
					<xsl:with-param name="parent" select="$format"/>
				</xsl:call-template>
			</div>
		</xsl:if>

		<xsl:if test="$zoom != 'compact'">
			<xsl:apply-templates select="$format/suffix[not($clean) or @important = 'true']"/>
		</xsl:if>
	</xsl:template>

	<xsl:template match="*[@layout='select-view']">
		<xsl:param name="zoom"><xsl:value-of select="@zoom" /><xsl:if test="not(@zoom)"><xsl:value-of select="$zoom" /></xsl:if></xsl:param>
		<xsl:call-template name="select-view">
			<xsl:with-param name="format" select="."/>
			<xsl:with-param name="values" select="."/>
			<xsl:with-param name="zoom" select="$zoom"/>
		</xsl:call-template>
	</xsl:template>


	<xsl:template name="rows">
		<xsl:param name="elements" />
		<xsl:param name="format" />
		<xsl:param name="value" />
		<xsl:for-each select="$elements | $value/*[not($elements) and local-name() = $format/@elementName] | $value/*[not($elements) and not($format/@elementName)]">
			<div class="{$format/@itemCssClass}">
				<xsl:apply-templates select=".">
					<xsl:with-param name="format" select="."/>
					<xsl:with-param name="value" select="$value"/>
				</xsl:apply-templates>
			</div>
		</xsl:for-each>
	</xsl:template>

	<xsl:template match="rows | *[@layout='rows']">
		<!-- xsl:param name="value" select="."/ -->
		<xsl:param name="zoom"><xsl:value-of select="@zoom" /><xsl:if test="not(@zoom)"><xsl:value-of select="$zoom" /></xsl:if></xsl:param>
		<xsl:call-template name="rows">
			<xsl:with-param name="elements" select="rows/*"/>
			<xsl:with-param name="format" select="."/>
			<xsl:with-param name="value" select="."/>
			<xsl:with-param name="zoom" select="'row'"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="sequence">
		<xsl:param name="elements" />
		<xsl:param name="format" />
		<xsl:param name="value" />
		<ui-sequence class="zoom-{$zoom}">
		<xsl:for-each select="$elements | $value/*[not($elements) and local-name() = $format/@elementName]">
			<ui-sequence-item class="{$format/@itemCssClass} zoom-{$zoom}">
				<xsl:apply-templates select=".">
					<xsl:with-param name="format" select="."/>
					<xsl:with-param name="value" select="$value"/>
				</xsl:apply-templates>
			</ui-sequence-item>
		</xsl:for-each>
		</ui-sequence>
	</xsl:template>

	<xsl:template match="sequence | *[@layout='sequence']">
		<xsl:param name="format" select="."/>
		<xsl:param name="value" select="."/>
		<xsl:param name="zoom"><xsl:value-of select="@zoom" /><xsl:if test="not(@zoom)"><xsl:value-of select="$zoom" /></xsl:if></xsl:param>

		<xsl:call-template name="sequence">
			<xsl:with-param name="elements" select="$format/sequence/* | $value/*[not($format/sequence)] | $format/*[not($value/* or $format/sequence)]"/>
			<xsl:with-param name="format" select="$format"/>
			<xsl:with-param name="value" select="$value"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="form-field">
		<xsl:param name="format" />
		<xsl:param name="value" />
		<xsl:param name="zoom" />
		<xsl:variable name="itemZoom"><xsl:value-of select="$format/@zoom" /><xsl:if test="not($format/@zoom)"><xsl:value-of select="$zoom" /></xsl:if></xsl:variable>
		<xsl:choose>
			<xsl:when test="$format/@type='hidden'">
				<xsl:if test="not($format/@disabled = 'true')">
					<input type="hidden" name="{$format/@name}" value="{$value}" x-ui-input="true" />
				</xsl:if>
			</xsl:when>
			<xsl:when test="$zoom='compact'">
				<span x-ui-debug="form-field/compact" class="ui-fldbox-{$zoom} hl-bn-{$format/@hl} {$format/@cssClass}">
				<table style="width:100%" class="collapse"><tbody><tr><td>
					<xsl:if test="$format/@title or $format/title">
						<div class="field-{$zoom} fldkey">
							<xsl:call-template name="formats-title">
								<xsl:with-param name="format" select="$format"/>
								<xsl:with-param name="suffix" select="':'"/>
								<xsl:with-param name="zoom" select="$itemZoom"/>
							</xsl:call-template>
						</div>
					</xsl:if>
					<div class="field-{$zoom} fldval ui-type-{$format/@type}">
						<xsl:call-template name="input">
							<xsl:with-param name="format" select="$format"/>
							<xsl:with-param name="value" select="$value"/>
							<xsl:with-param name="zoom" select="$itemZoom"/>
						</xsl:call-template>
					</div>
				</td></tr></tbody></table>
				</span>
			</xsl:when>
			<xsl:otherwise>
				<tr class="ui-cell hl-bn-{$format/@hl} {$format/@cssClass}">
					<xsl:if test="$format/@title or $format/title">
						<td class="field fldkey">
							<xsl:call-template name="formats-title">
								<xsl:with-param name="format" select="$format"/>
								<xsl:with-param name="suffix" select="':'"/>
								<xsl:with-param name="zoom" select="$itemZoom"/>
							</xsl:call-template>
						</td>
					</xsl:if>
					<td class="field fldval ui-type-{$format/@type}" colspan="2">
						<xsl:call-template name="input">
							<xsl:with-param name="format" select="$format"/>
							<xsl:with-param name="value" select="$value"/>
							<xsl:with-param name="zoom" select="$itemZoom"/>
						</xsl:call-template>
					</td>
				</tr>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="form | *[@layout='form']">
		<xsl:param name="zoom"><xsl:value-of select="@zoom" /><xsl:if test="not(@zoom)"><xsl:value-of select="$zoom" /></xsl:if></xsl:param>
		<xsl:variable name="format" select="."/>
		<xsl:variable name="fields" select="fields | $format[not(fields)]"/>
		<form action="{@action}" class="ui-form-{$zoom} {@cssClass}">
			<xsl:if test="@method='post' or $fields/field/@type='file' or $fields/field/@type='editor' or $fields/field/@type='password'">
				<xsl:attribute name="method">post</xsl:attribute>
				<xsl:attribute name="enctype">multipart/form-data</xsl:attribute>
			</xsl:if>
			<xsl:attribute name="target">
				<xsl:choose>
					<xsl:when test="@target">
						<xsl:value-of select="@target" />
					</xsl:when>
					<xsl:otherwise>_top</xsl:otherwise>
				</xsl:choose>
			</xsl:attribute>

			<xsl:if test="$sudo != ''"><input type="hidden" name="authUserId" value="{$sudo}" /></xsl:if>
			<xsl:call-template name="edit">
				<xsl:with-param name="format" select="."/>
				<xsl:with-param name="values" select="."/>
				<xsl:with-param name="zoom" select="$zoom"/>
			</xsl:call-template>
		</form>
	</xsl:template>

	<xsl:template name="edit-fields">
		<xsl:param name="format" />
		<xsl:param name="values" />
		<xsl:param name="zoom" />
		<xsl:param name="parentInputValue" />
		
		<xsl:variable name="itemZoom">
			<xsl:choose>
				<xsl:when test="$zoom = 'document' or $zoom = 'window'">
					<xsl:text>row</xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<xsl:text>compact</xsl:text>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		<xsl:for-each select="$format/field | $values/field[not($format/field)]">
			<xsl:variable name="field" select="."/>
			<xsl:variable name="name"><xsl:value-of select="$field/@name"/></xsl:variable>
			<!-- xsl:variable name="name" select="$field/@name"/ -->
			<xsl:choose>
				<xsl:when test="$name = '' or not($name)">
					<xsl:call-template name="form-field">
						<xsl:with-param name="format" select="$field"/>
						<xsl:with-param name="value" select="$field/@value | $field/value"/>
						<xsl:with-param name="zoom" select="$itemZoom"/>
					</xsl:call-template>
					<xsl:comment> l: 220 ^ </xsl:comment>
				</xsl:when>
				<xsl:when test="$name = '.'">
					<xsl:call-template name="form-field">
						<xsl:with-param name="format" select="$field"/>
						<xsl:with-param name="value" select="$values"/>
						<xsl:with-param name="zoom" select="$itemZoom"/>
					</xsl:call-template>
					<xsl:comment> l: 225 ^ </xsl:comment>
				</xsl:when>
				<xsl:when test="$values/values/*[local-name() = $name]">
					<xsl:call-template name="form-field">
						<xsl:with-param name="format" select="$field"/>
						<xsl:with-param name="value" select="$values/values/*[local-name() = $name]"/>
						<xsl:with-param name="zoom" select="$itemZoom"/>
					</xsl:call-template>
					<xsl:comment> l: 226 ^ </xsl:comment>
				</xsl:when>
				<xsl:when test="$values/*[local-name() = $name]">
					<xsl:call-template name="form-field">
						<xsl:with-param name="format" select="$field"/>
						<xsl:with-param name="value" select="$values/*[local-name() = $name]"/>
						<xsl:with-param name="zoom" select="$itemZoom"/>
					</xsl:call-template>
					<xsl:comment> l: 227 ^ </xsl:comment>
				</xsl:when>
				<xsl:when test="$values/values/@*[local-name() = $name]">
					<xsl:call-template name="form-field">
						<xsl:with-param name="format" select="$field"/>
						<xsl:with-param name="value" select="$values/values/@*[local-name() = $name]"/>
						<xsl:with-param name="zoom" select="$itemZoom"/>
					</xsl:call-template>
					<xsl:comment> l: 228 ^ </xsl:comment>
				</xsl:when>
				<xsl:when test="$values/@*[local-name() = $name]">
					<xsl:call-template name="form-field">
						<xsl:with-param name="format" select="$field"/>
						<xsl:with-param name="value" select="$values/@*[local-name() = $name]"/>
						<xsl:with-param name="zoom" select="$itemZoom"/>
					</xsl:call-template>
					<xsl:comment> l: 229 ^ </xsl:comment>
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="form-field">
						<xsl:with-param name="format" select="$field"/>
						<xsl:with-param name="value" select="$field/@value | $field/value[not($field/@value)]"/>
						<xsl:with-param name="zoom" select="$itemZoom"/>
					</xsl:call-template>
					<xsl:comment> l: 221 ^ </xsl:comment>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
	</xsl:template>

	<xsl:template name="edit" >
		<xsl:param name="format" />
		<xsl:param name="values" />
		<xsl:param name="zoom"><xsl:value-of select="$format/@zoom" /><xsl:if test="not($format/@zoom)"><xsl:value-of select="$zoom" /></xsl:if></xsl:param>
		<xsl:param name="parentInputValue" />

		<xsl:if test="$zoom = 'document'">
			<xsl:apply-templates select="$format/prefix[not($clean) or @important = 'true']"/>
		</xsl:if>

		<xsl:variable name="fields" select="$format/fields | $format[not($format/fields)]"/>

		<div class="ui-table-screen-{$zoom}">
		<div class="ui-table-container">
		<div class="table-edit">
			<xsl:choose>
				<xsl:when test="$zoom = 'document' or $zoom = 'window'">
					<table class="table ui-edit-table-{$zoom} ui-edit-other">
						<xsl:call-template name="edit-fields">
							<xsl:with-param name="format" select="$fields"/>
							<xsl:with-param name="values" select="$values"/>
							<xsl:with-param name="zoom" select="$zoom"/>
						</xsl:call-template>
					</table>
				</xsl:when>
				<xsl:otherwise>
					<div class="table ui-edit-table-{$zoom} ui-edit-row">
						<xsl:call-template name="edit-fields">
							<xsl:with-param name="format" select="$fields"/>
							<xsl:with-param name="values" select="$values"/>
							<xsl:with-param name="zoom" select="$zoom"/>
						</xsl:call-template>
					</div>
				</xsl:otherwise>
			</xsl:choose>
		</div>
		</div>
		</div>

		<xsl:if test="$fields/help or $fields/command or $fields/submit">
			<div class="submit">
				<xsl:call-template name="command-bar">
					<xsl:with-param name="parent" select="$fields"/>
				</xsl:call-template>
			</div>
		</xsl:if>

		<xsl:if test="$zoom != 'compact'">
			<xsl:apply-templates select="$format/suffix[not($clean) or @important = 'true']"/>
		</xsl:if>

	</xsl:template>

	<xsl:template name="noscript-submenu">
		<xsl:param name="item" />
		<xsl:variable name="items" select="$item/command[@key or @url]"/>
		<xsl:variable name="count" select="count($items)"/>
		<div class="ui-menu-noscript count-{$count}">
			<div class="ui-menu-ns-scrn" alt="" title="">
			<table class="collapse" style="min-width: 100%; white-space: nowrap;"><tr><td>
			<xsl:if test="$count &gt; 1">
				<div class="tbar-up">Options:</div>
			</xsl:if>
			<xsl:for-each select="$items">
				<a href="{@key}{@url}" class="ui-cmd-link">
					<div class="ui-cell hl-bn-{@access} hl-hd-{@hidden} hl-ui-{@ui} idx-box-cell">
						<div class="ui-cmd-icon">
							<xsl:if test="@icon">
								<img src="{$silk}{@icon}.png" class="icon"/>
							</xsl:if>
							<xsl:if test="not(@icon)">
								<img src="{$silk}bullet_go.png" class="icon"/>
							</xsl:if>
						</div>
						<div class="ui-cmd-text">
							<xsl:call-template name="formats-title">
								<xsl:with-param name="format" select="."/>
							</xsl:call-template>
						</div>
					</div>
				</a>
			</xsl:for-each>
			</td></tr></table>
			</div>
		</div>
	</xsl:template>

	<xsl:template name="view" >
		<xsl:param name="format" />
		<xsl:param name="values" />
		<xsl:param name="zoom"><xsl:value-of select="$format/@zoom" /><xsl:if test="not($format/@zoom)"><xsl:value-of select="$zoom" /></xsl:if></xsl:param>

		<xsl:variable name="describer" select="$format/fields | $values/fields[not($format/fields)]"/>

		<xsl:variable name="itemZoom">
			<xsl:choose>
				<xsl:when test="$zoom = 'document' or $zoom = 'window'">
					<xsl:text>row</xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<xsl:text>compact</xsl:text>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>

		<xsl:if test="$zoom = 'document'">
			<xsl:apply-templates select="$format/prefix[not($clean) or @important = 'true']"/>
		</xsl:if>

		<div class="ui-table-screen-{$zoom}">
		<div class="ui-table-container">

		<xsl:variable name="items" select="$describer/field"/>
		<xsl:variable name="unique" select="generate-id(.)"/>
		<xsl:if test="$items">
			<xsl:if test="(@zoom='document' or $zoom='window') and $items">
				<div style="clear:both">
					<xsl:if test="$items[@hidden='true']">
						<button id="{$unique}-btn" class="ui-menu-btn-ini no-print" style="opacity:0.35">
							<div class="ui-cmd-icon"><img src="{$silk}cog_delete.png" class="icon"/></div>
							<div class="ui-cmd-text">Show all fields</div>
						</button>
						<script>
							setTimeout(function f(){
								var u = '<xsl:value-of select="$unique"/>',
									b = document.getElementById(u + '-btn');
								b.className = 'ui-menu-btn-btn';
								b.onclick = function(){
									var c = document.getElementById(u + '-ctn');
									c.className = 'ui-menu-ctn-all table-view';
									b.className = 'ui-menu-btn-ini';
									return false;
								};
							},0);
						</script>
					</xsl:if>
					<xsl:if test="$format/@sub-title">
						<div class="tbar-up ui-blk-caption"><xsl:value-of select='$format/@sub-title'/></div>
					</xsl:if>
				</div>
			</xsl:if>
	
			<div id="{$unique}-ctn" class="table-view">
			<table class="table ui-view-table-{$zoom} {$format/@cssClass}">
				<xsl:for-each select="$items">
					<xsl:variable name="field" select="."/>
					<tr class="ui-cell hl-bn-{@hl} hl-hd-{@hidden} {@cssClass}">
						<td class="field fldkey">
							<xsl:call-template name="formats-title">
								<xsl:with-param name="format" select="."/>
								<xsl:with-param name="suffix" select="':'"/>
								<xsl:with-param name="zoom" select="$itemZoom"/>
							</xsl:call-template>
						</td>
						<td class="field fldval ui-type-{@type | @variant[not(@type)]} fldview">
							<!-- div -->
								<xsl:variable name="name"><xsl:value-of select="$field/@name"/></xsl:variable>
								<!-- xsl:variable name="name" select="$field/@name"/ -->
								<xsl:choose>
									<xsl:when test="$name = '' or not($name)">
										<xsl:call-template name="formatted">
											<xsl:with-param name="format" select="$field"/>
											<xsl:with-param name="value" select="$field/@value | $field/value"/>
											<xsl:with-param name="zoom" select="$itemZoom"/>
										</xsl:call-template>
										<xsl:comment> l: 420 ^ </xsl:comment>
									</xsl:when>
									<xsl:when test="$name = '.'">
										<xsl:call-template name="formatted">
											<xsl:with-param name="format" select="$field"/>
											<xsl:with-param name="value" select="$values"/>
											<xsl:with-param name="zoom" select="$itemZoom"/>
										</xsl:call-template>
										<xsl:comment> l: 425 ^ </xsl:comment>
									</xsl:when>
									<xsl:when test="$values/values/*[local-name() = $name]">
										<xsl:call-template name="formatted">
											<xsl:with-param name="format" select="$field"/>
											<xsl:with-param name="value" select="$values/values/*[local-name() = $name]"/>
											<xsl:with-param name="zoom" select="$itemZoom"/>
										</xsl:call-template>
										<xsl:comment> l: 426 ^ </xsl:comment>
									</xsl:when>
									<xsl:when test="$values/*[local-name() = $name]">
										<xsl:call-template name="formatted">
											<xsl:with-param name="format" select="$field"/>
											<xsl:with-param name="value" select="$values/*[local-name() = $name]"/>
											<xsl:with-param name="zoom" select="$itemZoom"/>
										</xsl:call-template>
										<xsl:comment> l: 427 ^ </xsl:comment>
									</xsl:when>
									<xsl:when test="$values/values/@*[local-name() = $name]">
										<xsl:call-template name="formatted">
											<xsl:with-param name="format" select="$field"/>
											<xsl:with-param name="value" select="$values/values/@*[local-name() = $name]"/>
											<xsl:with-param name="zoom" select="$itemZoom"/>
										</xsl:call-template>
										<xsl:comment> l: 428 ^ </xsl:comment>
									</xsl:when>
									<xsl:when test="$values/@*[local-name() = $name]">
										<xsl:call-template name="formatted">
											<xsl:with-param name="format" select="$field"/>
											<xsl:with-param name="value" select="$values/@*[local-name() = $name]"/>
											<xsl:with-param name="zoom" select="$itemZoom"/>
										</xsl:call-template>
										<xsl:comment> l: 429 ^ </xsl:comment>
									</xsl:when>
									<xsl:otherwise>
										<xsl:call-template name="formatted">
											<xsl:with-param name="format" select="$field"/>
											<!-- xsl:with-param name="value"><xsl:value-of select="$field/@value | $field/value[not($field/@value)]"/></xsl:with-param -->
											<xsl:with-param name="value" select="$field/@value | $field/value[not($field/@value)]"/>
											<xsl:with-param name="zoom" select="$itemZoom"/>
										</xsl:call-template>
										<xsl:comment> l: 421 ^ </xsl:comment>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:call-template name="hint"/>
							<!-- /div -->
						</td>
					</tr>
				</xsl:for-each>
			</table>
			</div>
		</xsl:if>
		</div>
		</div>
		<xsl:if test="$describer/help or $describer/command or $describer/submit">
			<div class="submit">
				<xsl:call-template name="command-bar">
					<xsl:with-param name="parent" select="$describer"/>
				</xsl:call-template>
			</div>
		</xsl:if>
		<xsl:if test="$format/help or $format/command or $format/submit">
			<div class="submit">
				<xsl:call-template name="command-bar">
					<xsl:with-param name="parent" select="$format"/>
				</xsl:call-template>
			</div>
		</xsl:if>

		<xsl:if test="$zoom != 'compact'">
			<xsl:apply-templates select="$format/suffix[not($clean) or @important = 'true']"/>
		</xsl:if>
	</xsl:template>

	<xsl:template name="command-bar">
		<xsl:param name="parent" />
		<xsl:apply-templates select="$parent/help"/>
		<xsl:for-each select="$parent/command | $parent/submit">
			<xsl:choose>
				<xsl:when test="@group = 'true' or group">
					<a tabindex="-1" class="ui-button">
						<xsl:if test="@url">
							<xsl:attribute name="href"><xsl:value-of select="@url"/></xsl:attribute>
							<xsl:if test="@confirm">
								<xsl:attribute name="ui-cfm"><xsl:value-of select="@confirm"/></xsl:attribute>
								<xsl:attribute name="onсlick">return doConfirm(this);</xsl:attribute>
							</xsl:if>
						</xsl:if>
						<xsl:attribute name="target">
							<xsl:choose>
								<xsl:when test="@target">
									<xsl:value-of select="@target" />
								</xsl:when>
								<xsl:otherwise>_top</xsl:otherwise>
							</xsl:choose>
						</xsl:attribute>
						<button id="{generate-id(.)}" class="menu-button" title="{@title}" icon="{@icon}" src="{@src}"><noscript>
						<xsl:if test="group">
							<xsl:call-template name="noscript-submenu">
								<xsl:with-param name="item" select="group"/>
							</xsl:call-template>
						</xsl:if>
						<div class="menu-element">
							<img src="{$silk}{@icon}.png" />
							<span>
								<xsl:call-template name="formats-title">
									<xsl:with-param name="format" select="."/>
								</xsl:call-template>
								&#x25BC;
							</span>
						</div>
					</noscript>
					<xsl:if test="@confirm">
						<xsl:attribute name="onсlick">return doConfirm(this.parentElement);</xsl:attribute>
					</xsl:if>
					</button></a>
					<script defer="defer">
						ready.push((function(){
							var btn = document.getElementById(this.id);
							require.style(srot + 'skin-standard-xml/$files/menu.css');
							require.script('lib/menu.js', function(Menu){
								Menu.iconPrefix = irot;
								Menu.iconSuffix = ".png";
								Menu.attachMenu( btn, {
									icon : btn.getAttribute('icon') || 'asterisk_orange', 
									title2 : "<xsl:value-of select='(@shortTitle | @title)[1]'/>",
									title : "<xsl:value-of select='@titleShort | @title[count(../@titleShort) = 0]'/>",
									menusource : btn.getAttribute('src'),
									submenu : [
										<xsl:for-each select="group/command[@key or @url]">
										{
											icon : "<xsl:value-of select='@icon'/>",
											href : "<xsl:value-of select='@key | @url'/>",
											title : "<xsl:value-of select='@title'/>"
										},
										</xsl:for-each>
									]
								});
							});
						}).bind({
							id:"<xsl:value-of select="generate-id(.)"/>",
						}));
					</script>
				</xsl:when>
				<xsl:when test="local-name() = 'submit'">
					<button class="ui-button" target="_top" type="submit" tabindex2="1000{position()}" name="{@name}" value="{@value}">
						<xsl:if test="@icon">
							<div class="ui-cmd-icon">
									<img src="{$silk}{@icon}.png" class="icon"/>
							</div>
						</xsl:if>
						<div class="ui-cmd-text">
							<xsl:call-template name="formats-title">
								<xsl:with-param name="format" select="."/>
							</xsl:call-template>
						</div>
					</button>
				</xsl:when>
				<xsl:otherwise>
					<a tabindex="-1" href="{@url}" class="ui-button">
						<xsl:attribute name="target">
							<xsl:choose>
								<xsl:when test="@target">
									<xsl:value-of select="@target" />
								</xsl:when>
								<xsl:otherwise>_top</xsl:otherwise>
							</xsl:choose>
						</xsl:attribute>
						<xsl:if test="@confirm">
							<xsl:attribute name="id"><xsl:value-of select='generate-id($parent)'/>-link</xsl:attribute>
							<xsl:attribute name="ui-cfm"><xsl:value-of select="@confirm"/></xsl:attribute>
							<xsl:attribute name="onсlick">return doConfirm(this);</xsl:attribute>
						</xsl:if>
						<button class="ui-button" type="button" onclick2="return true" tabindex2="1000{position()}" name="{@name}">
							<xsl:if test="@confirm">
								<xsl:attribute name="onсlick">return doConfirm(this.parentElement);</xsl:attribute>
							</xsl:if>
							<div class="ui-cmd-icon">
								<xsl:if test="@icon">
									<img src="{$silk}{@icon}.png" class="icon"/>
								</xsl:if>
								<xsl:if test="not(@icon)">
									<img src="{$silk}bullet_go.png" class="icon"/>
								</xsl:if>
							</div>
							<div class="ui-cmd-text">
								<xsl:call-template name="formats-title">
									<xsl:with-param name="format" select="."/>
								</xsl:call-template>
							</div>
						</button>
					</a>
					<xsl:if test="@confirm">
						<script><![CDATA[
						
							ready.push((function(){
								var target = document.getElementById(this.id);
								target ? (target.onclick = doConfirm.bind(this, target)) : alert("no element: " + this.id);
							}).bind({ ]]>
								id:"<xsl:value-of select='generate-id($parent)'/>-link"
							<![CDATA[ }));
							
						]]></script>
					</xsl:if>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
	</xsl:template>

	<xsl:template name="formats-title">
		<xsl:param name="format" />
		<xsl:param name="suffix" />
		<xsl:choose>
		
			<xsl:when test="$format/@titleShort"
				><span x-ui-debug="formats-title/titleShort" title="{$format/@title}"><xsl:value-of select='$format/@titleShort'/><xsl:value-of select='$suffix'/></span></xsl:when>
				
			<xsl:when test="$format/@title"
				><xsl:value-of select='$format/@title'/><xsl:value-of select='$suffix'/></xsl:when>
				
			<xsl:when test="$format/title[@layout]"
				><xsl:apply-templates select='$format/title[@layout]'/><xsl:value-of select='$suffix'/></xsl:when>
				
			<xsl:when test="$format/title"
				><xsl:apply-templates select='$format/title/node()'/><xsl:value-of select='$suffix'/></xsl:when>
				
		</xsl:choose>
	</xsl:template>

	<xsl:template name="hint">
		<xsl:choose>
			<xsl:when test="@hint">
				<div class="ui-hint"><xsl:value-of disable-output-escaping="yes" select="@hint"/></div>
			</xsl:when>
			<xsl:when test="hint">
				<div class="ui-hint"><xsl:apply-templates select="hint/node()"/></div>
			</xsl:when>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="command">
		<xsl:param name="format"/>
		<xsl:param name="zoom"/>
		<xsl:param name="depth" select="$depth | 2[not($depth)]"/>
		<xsl:comment> command-check: zoom: <xsl:value-of select="$zoom" />, depth: <xsl:value-of select="$depth" />, limit: <xsl:value-of select="@depthLimit" /></xsl:comment>
		<xsl:variable name="iconWithTitle">
			<div class="ui-cmd-icon">
				<xsl:if test="@icon">
					<img src="{$silk}{@icon}.png" class="icon"/>
				</xsl:if>
				<xsl:if test="not(@icon)">
					<img src="{$silk}bullet_go.png" class="icon"/>
				</xsl:if>
			</div>
			<div class="ui-cmd-text">
				<xsl:call-template name="formats-title">
					<xsl:with-param name="format" select="."/>
				</xsl:call-template>
			</div>
		</xsl:variable>
		<!-- xsl:choose /-->
			<!-- xsl:when test="$zoom = 'compact'" /-->
				<a href="{@key}" class="ui-cmd-link-{$zoom}">
					<div class="hl-bn-{@access} hl-hd-{@hidden} hl-ui-{@ui} idx-box-{$zoom}">
						<xsl:copy-of select="$iconWithTitle"/>
						<xsl:if test="$zoom != 'compact'">
							<xsl:for-each select="preview">
								<xsl:if test="not(@depthLimit) or (@depthLimit &gt;= $depth)">
									<a href="javascript:void" class="ui-cmd-preview-block">
										<xsl:call-template name="formatted">
											<xsl:with-param name="format" select="."/>
											<xsl:with-param name="value" select="."/>
											<xsl:with-param name="zoom" select="$itemZoom"/>
										</xsl:call-template>
									</a>
								</xsl:if>
							</xsl:for-each>
						</xsl:if>
					</div>
				</a>
			<!-- /xsl:when /-->
			<!-- xsl:otherwise /-->
				<!-- div class="ui-hint">22222</div /-->
			<!-- /xsl:otherwise /-->
		<!-- /xsl:choose /-->
	</xsl:template>

	<xsl:template match="*[@layout='view']">
		<xsl:param name="zoom"><xsl:value-of select="@zoom" /><xsl:if test="not(@zoom)"><xsl:value-of select="$zoom" /></xsl:if></xsl:param>
		<xsl:call-template name="view">
			<xsl:with-param name="format" select="."/>
			<xsl:with-param name="values" select="."/>
			<xsl:with-param name="zoom" select="$zoom"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="*[@layout='message']">
		<xsl:param name="zoom"><xsl:value-of select="@zoom" /><xsl:if test="not(@zoom)"><xsl:value-of select="$zoom" /></xsl:if></xsl:param>
		<div class="ui-table-screen-{$zoom} {@cssClass}">
		<div class="ui-table-container">
		<div class="hl-bn-{@hl} table-message">
		<table class="ui-message-table-{$zoom}">
			<tr>
				<td class="ui-message-west-{$zoom}">
					<xsl:if test="@icon">
						<img src="{$silk}{@icon}.png" class="icon ui-message-icon-{$zoom}"/>
					</xsl:if>
				</td>
				<td class="ui-message-east-{$zoom}">
					<xsl:if test="reason or @reason or title or @title or @message">
						<h3 class="ui-wg-message-title">
							<xsl:choose>
								<xsl:when test="reason"><xsl:apply-templates select="reason"/></xsl:when>
								<xsl:when test="@reason"><xsl:apply-templates select="@reason"/></xsl:when>
								<xsl:when test="title"><xsl:apply-templates select="title"/></xsl:when>
								<xsl:when test="@title"><xsl:apply-templates select="@title"/></xsl:when>
								<xsl:when test="@message"><xsl:apply-templates select="@message"/></xsl:when>
							</xsl:choose>
						</h3>
					</xsl:if>
					<xsl:if test="@code">
						<p>Code: <b class="ui-wg-message-code"><xsl:value-of select="@code" /></b></p>
					</xsl:if>
					<xsl:if test="message">
						<p class="ui-wg-message-text"><xsl:apply-templates select="message"/></p>
					</xsl:if>
					<xsl:if test="detail or @detail">
						<div style="margin-top: -1em; font-size:80%">
							<label for="{generate-id(.)}" class="ui-chk-label">show detail</label>
							<input class="ui-chk-master" id="{generate-id(.)}" type="checkbox"/>
							<div class="ui-clear"></div><div style="margin-top: 0.2em" class="ui-chk-slave"><div class="ui-wg-message-detail"><xsl:apply-templates select="detail | @detail"/></div></div>
						</div>
					</xsl:if>
				</td>
			</tr>
		</table>
		</div>
		</div>
		</div>
		<xsl:if test="help or command">
			<div class="submit">
				<xsl:call-template name="command-bar">
					<xsl:with-param name="parent" select="."/>
				</xsl:call-template>
			</div>
		</xsl:if>
	</xsl:template>

	<!-- DOCUMENTATION -->

	<xsl:template match="text">
		<xsl:apply-templates/>
	</xsl:template>

	<xsl:template match="paragraph">
		<p class="paragraph"><xsl:apply-templates/></p>
	</xsl:template>

	<xsl:template match="pagebreak">
		<p class="ui-pagebreak pagebreak"></p>
	</xsl:template>

	<xsl:template match="summary">
		<div class="ui-summary"><xsl:apply-templates/></div><p></p>
	</xsl:template>

	<xsl:template match="article">
		<xsl:apply-templates select="*[local-name() = 'anchor']"/>
		<xsl:if test="name">
			<a name="{name}"></a>
		</xsl:if>
		<xsl:call-template name="navbar"><xsl:with-param name="focus" select=".."/></xsl:call-template>
		<h3><xsl:value-of select="title | name[not(title)]"/></h3>
		<xsl:apply-templates select="*[local-name() != 'name' and local-name() != 'anchor' ]"/>
		<hr style="clear:both"/>
	</xsl:template>

	<xsl:template match="anchor">
		<a name="{.}"></a>
	</xsl:template>


	<xsl:template name="navbar">
		<xsl:param name="focus" />
		<small><div style="clear:both">
			<div class="ui-label ui-right"><a href="#top">top</a></div>
			<xsl:for-each select="ancestor::*">
				<xsl:if test="anchor and title">
					<div class="ui-label ui-right"><a href="#{anchor}"><xsl:value-of select="title"/></a></div>
				</xsl:if>
			</xsl:for-each>
		</div></small>
	</xsl:template>

	<xsl:template name="documentation-item">
		<xsl:param name="value" />
		<xsl:param name="zoom"/>
		<xsl:param name="name"/>
		<xsl:param name="namespacePrefix"/>
		<xsl:choose>
			<xsl:when test="$name = 'client'">
			</xsl:when>
			<xsl:when test="$name = 'section'">
				<xsl:variable name="linkName">
					<xsl:choose>
						<xsl:when test="$value/anchor | $value/name[not($value/anchor)]"><xsl:value-of select="$value/anchor | $value/name[not($value/anchor)]"/></xsl:when>
						<xsl:otherwise>top</xsl:otherwise>
					</xsl:choose>
				</xsl:variable>
				<a name="{$linkName}"></a>
				<h2><xsl:call-template name="navbar"><xsl:with-param name="focus" select=".."/></xsl:call-template><xsl:value-of select='$value/@title | $value/title[not($value/@title)] | $value/name[not($value/@title) and not($value/title)]'/></h2>
				<xsl:call-template name="documentation">
					<xsl:with-param name="value" select="$value"/>
					<xsl:with-param name="zoom" select="$zoom"/>
					<xsl:with-param name="namespacePrefix" select="$namespacePrefix"/>
				</xsl:call-template>
				<div class="ui-pagebreak"/>
			</xsl:when>
			<xsl:when test="$name = 'command'">
				<code class="command"><xsl:value-of select="$value"/></code>
			</xsl:when>
			<xsl:when test="$name = 'output'">
				<pre class="output"><xsl:value-of select="$value"/></pre>
			</xsl:when>
			<xsl:when test="$name = 'object'">
				<a name="{$value/name}"></a>
				<h3>object <xsl:value-of select="$namespacePrefix"/><xsl:value-of select="$value/name"/></h3>
				<xsl:for-each select="$value/*">
					<xsl:variable name="itemName">
						<xsl:choose>
							<xsl:when test="@disposition">
								<xsl:value-of select="@disposition" />
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="local-name()"/>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:variable>
					<xsl:call-template name="documentation-item">
						<xsl:with-param name="value" select="."/>
						<xsl:with-param name="zoom" select="$zoom"/>
						<xsl:with-param name="name" select="$itemName"/>
						<xsl:with-param name="namespacePrefix" select="$namespacePrefix"/>
					</xsl:call-template>
				</xsl:for-each>
				<div class="ui-label ui-right"><a href="#top">top ^^^</a></div>
				<hr style="clear:both"/>
			</xsl:when>
			<xsl:when test="$name = 'method'">
				<a name="{$value/name}"></a>
				<xsl:call-template name="navbar"><xsl:with-param name="focus" select=".."/></xsl:call-template>
				<h3>method: <xsl:value-of select="$namespacePrefix"/><xsl:value-of select="$value/name"/></h3>
				<xsl:if test="$value/label">
					<i><span style="display:inline-block;margin:0 0.5em 0 0">labels:</span><span style="display:inline-block;height:1em;"><xsl:for-each select="$value/label"><a class="ui-label ui-left" href="#{.}"><xsl:value-of select="."/></a></xsl:for-each></span><div class="ui-clear"/></i>
				</xsl:if>
				<p><xsl:apply-templates select="$value/summary"/></p>
				<xsl:if test="$value/parameter">
					<i><div>parameters:</div></i>
					<ul>
						<xsl:for-each select="$value/parameter">
							<li><b><xsl:value-of select="@name"/></b>: <xsl:apply-templates select="@value | value[not(@value)]"/></li>
						</xsl:for-each>
					</ul>
					<p></p>
				</xsl:if>
				<xsl:apply-templates select="$value/text"/>
				<xsl:if test="$value/url">
					<i><div>api urls:</div></i>
					<ul>
						<xsl:for-each select="$value/url">
							<li><xsl:value-of select="@title"/>:<br/><code><xsl:value-of select="@value"/></code></li>
						</xsl:for-each>
					</ul>
					<p></p>
				</xsl:if>
				<xsl:if test="$value/result">
					<i><div>responses:</div></i>
					<ul>
						<xsl:for-each select="$value/result">
							<li><xsl:copy-of select="."/><br/></li>
						</xsl:for-each>
					</ul>
					<p></p>
				</xsl:if>
				<hr style="clear:both"/><br/>
			</xsl:when>
			<xsl:when test="$name = 'fields'">
				<h3>Properties (fields):</h3>
				<table border="1">
					<tr><th>Name</th><th>Description</th></tr>
					<xsl:for-each select="$value/field">
						<tr><td><xsl:value-of select="name"/></td><td><xsl:copy-of select="description"/></td></tr>
					</xsl:for-each>
				</table>
				<p></p>
			</xsl:when>
			<xsl:when test="$name = 'name'">
			</xsl:when>
			<xsl:otherwise>
				<xsl:apply-templates select="$value"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>


	<xsl:template name="documentation">
		<xsl:param name="value" />
		<xsl:param name="zoom"/>
		<xsl:variable name="namespacePrefix" select="$value/@namespacePrefix"/>
		<xsl:if test="$value/article or $value/section or $value/appendix">
			<p>Index:</p>
			<ul>
				<xsl:for-each select="$value/article">
					<li><a href="#{anchor | name[not(anchor)]}"><xsl:value-of select="name | title[not(name)]"/></a></li>
				</xsl:for-each>
				<xsl:for-each select="$value/section">
					<xsl:variable name="sectionNamespacePrefix" select="@namespacePrefix"/>
					<li><a href="#{anchor | name[not(anchor)]}"><xsl:value-of select="name | title[not(name)]"/></a>
						<xsl:if test="article | section | method | object">
							<ul>
								<xsl:for-each select="article | section">
									<li><a href="#{anchor | name[not(anchor)]}"><xsl:value-of select="name | title[not(name)]"/></a></li>
								</xsl:for-each>
								<xsl:for-each select="method">
									<li><a href="#{anchor | name[not(anchor)]}"><xsl:value-of select="$sectionNamespacePrefix"/><xsl:value-of select="name | title[not(name)]"/></a></li>
								</xsl:for-each>
								<xsl:for-each select="appendix">
									<li><a href="#{anchor | name[not(anchor)]}"><xsl:value-of select="name | title[not(name)]"/></a></li>
								</xsl:for-each>
							</ul>
						</xsl:if>
					</li>
				</xsl:for-each>
				<xsl:for-each select="$value/appendix">
					<li><a href="#{anchor | name[not(anchor)]}"><xsl:value-of select="name | title[not(name)]"/></a></li>
				</xsl:for-each>
			</ul>
		</xsl:if>
		<xsl:if test="$value/method">
			<p>API Methods:</p>
			<ul>
				<xsl:for-each select="$value/method">
					<li><a href="#{anchor | name[not(anchor)]}"><xsl:value-of select="$namespacePrefix"/><xsl:value-of select="name"/></a></li>
				</xsl:for-each>
			</ul>
		</xsl:if>
		<xsl:if test="$value/object">
			<p>Object classes:</p>
			<ul>
				<xsl:for-each select="$value/object">
					<li><a href="#{anchor | name[not(anchor)]}"><xsl:value-of select="$namespacePrefix"/><xsl:value-of select="name"/></a></li>
				</xsl:for-each>
			</ul>
		</xsl:if>
		<hr/>
		<xsl:for-each select="$value/*">
			<xsl:sort select="local-name() = 'appendix'"/>
			<xsl:variable name="itemName">
				<xsl:choose>
					<xsl:when test="@disposition">
						<xsl:value-of select="@disposition" />
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="local-name()"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:variable>
			<xsl:choose>
				<xsl:when test="$itemName = 'anchor' or $itemName = 'name'">
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="documentation-item">
						<xsl:with-param name="value" select="."/>
						<xsl:with-param name="zoom" select="$zoom"/>
						<xsl:with-param name="name" select="$itemName"/>
						<xsl:with-param name="namespacePrefix" select="$namespacePrefix"/>
					</xsl:call-template>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
	</xsl:template>

	<xsl:template match="*[@layout='documentation']">
		<xsl:param name="zoom"><xsl:value-of select="@zoom" /><xsl:if test="not(@zoom)"><xsl:value-of select="$zoom" /></xsl:if></xsl:param>
		<xsl:variable name="name">
			<xsl:choose>
				<xsl:when test="@disposition">
					<xsl:value-of select="@disposition" />
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="local-name()"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="$name = 'output' or $name = 'fields' or $name = 'object' or $name = 'method' or $name = 'command'">
				<xsl:call-template name="documentation-item">
					<xsl:with-param name="value" select="."/>
					<xsl:with-param name="zoom" select="$zoom"/>
					<xsl:with-param name="name" select="$name"/>
					<xsl:with-param name="namespacePrefix" select="@namespacePrefix"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<div style="width:100%">
				<xsl:variable name="linkName">
					<xsl:choose>
						<xsl:when test="anchor | name"><xsl:value-of select="anchor | name[not(anchor)]"/></xsl:when>
						<xsl:otherwise>top</xsl:otherwise>
					</xsl:choose>
				</xsl:variable>
				<a name="{$linkName}"></a>
				<xsl:call-template name="documentation">
					<xsl:with-param name="value" select="."/>
					<xsl:with-param name="zoom" select="$zoom"/>
				</xsl:call-template>
				</div>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- OTHER -->

	<xsl:template match="*[@layout='menu']">
		<xsl:param name="depth" select="$depth"/>
		<xsl:param name="zoom"><xsl:value-of select="@zoom" /><xsl:if test="not(@zoom)"><xsl:value-of select="$zoom" /></xsl:if></xsl:param>
		<xsl:variable name="itemZoom">
			<xsl:choose>
				<xsl:when test="$zoom = 'document' or $zoom = 'window' or $zoom = 'row'">
					<xsl:text>row</xsl:text>
				</xsl:when>
				<!-- column, compact -->
				<xsl:otherwise>
					<xsl:text>compact</xsl:text>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="unique" select="generate-id(.)"/>
		<xsl:if test="message or @message">
			<div style="clear:both; margin-bottom: 9pt">
				<div class="tbar-up" style="display: inline-block; opacity: 0.5">Message:</div>
				<div id="{$unique}-msg" class="ui-menu-{$zoom}">
					<div class="ui-cell hl-bn-error idx-box-cell">
						<xsl:apply-templates select="message | @message[not(message)]"/>
					</div>
				</div>
			</div>
		</xsl:if>
		<xsl:variable name="items" select="command | index"/>
		<xsl:if test="$items">
			<xsl:if test="$depth = 1 and (@zoom='document' or $zoom='window') and $items">
				<div style="clear:both">
					<xsl:if test="$items[@hidden = 'true' and @key != 'index']">
						<button id="{$unique}-btn" class="ui-menu-btn-ini no-print" style="opacity:0.35">
							<div class="ui-cmd-icon"><img src="{$silk}cog_delete.png" class="icon"/></div>
							<div class="ui-cmd-text">Show all commands</div>
						</button>
						<script>
							setTimeout(function f(){
								var u = '<xsl:value-of select="$unique"/>',
									b = document.getElementById(u + '-btn');
								b.className = 'ui-menu-btn-btn';
								b.onclick = function(){
									var c = document.getElementById(u + '-ctn');
									c.className = 'ui-menu-ctn-all ui-menu-<xsl:value-of select="$zoom"/>';
									b.className = 'ui-menu-btn-ini';
									return false;
								};
							},0);
						</script>
					</xsl:if>
					<div class="tbar-up ui-blk-caption">Choose one of the options:</div>
				</div>
			</xsl:if>
			<xsl:comment> depth: <xsl:value-of select="$depth" /> </xsl:comment>
			<div id="{$unique}-ctn" class="ui-menu-{$zoom}">
				<xsl:for-each select="$items">
					<xsl:comment> item-depth-check: depth: <xsl:value-of select="$depth" />, limit: <xsl:value-of select="@depthLimit" /></xsl:comment>
					<xsl:variable name="iconWithTitle">
						<div class="ui-cmd-icon">
							<xsl:if test="@icon">
								<img src="{$silk}{@icon}.png" class="icon"/>
							</xsl:if>
							<xsl:if test="not(@icon)">
								<img src="{$silk}bullet_go.png" class="icon"/>
							</xsl:if>
						</div>
						<div class="ui-cmd-text">
							<xsl:call-template name="formats-title">
								<xsl:with-param name="format" select="."/>
							</xsl:call-template>
						</div>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="@key='index' and local-name()='command'">
							<!-- skip -->
						</xsl:when>
						<xsl:when test="local-name()='command'">
							<a href="{@key}" class="ui-cmd-link">
								<div class="ui-cell hl-bn-{@access} hl-hd-{@hidden} hl-ui-{@ui} idx-box-cell">
									<xsl:copy-of select="$iconWithTitle"/>
									<xsl:if test="$itemZoom != 'compact'">
										<xsl:for-each select="preview">
											<xsl:if test="not(@depthLimit) or (@depthLimit &gt;= $depth)">
												<a href="javascript:void" class="ui-cmd-preview-block">
													<xsl:call-template name="formatted">
														<xsl:with-param name="format" select="."/>
														<xsl:with-param name="value" select="."/>
														<xsl:with-param name="zoom" select="$itemZoom"/>
													</xsl:call-template>
												</a>
											</xsl:if>
										</xsl:for-each>
									</xsl:if>
								</div>
							</a>
						</xsl:when>
						<xsl:otherwise>
							<a href="{@key}" class="ui-cmd-link">
								<div class="ui-cell hl-bn-{@access} hl-hd-{@hidden} hl-ui-{@ui} idx-grp-cell">
									<xsl:copy-of select="$iconWithTitle"/>
									<xsl:if test="not(@depthLimit) or (@depthLimit &gt; $depth)">
										<xsl:apply-templates select=".">
											<xsl:with-param name="format" select="."/>
											<xsl:with-param name="zoom" select="'row'"/>
											<xsl:with-param name="depth" select="$depth + 1"/>
										</xsl:apply-templates>
									</xsl:if>
								</div>
							</a>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>
			</div>
		</xsl:if>
	</xsl:template>

	<xsl:template match="help">
		<a tabindex="-1" href="{@src}" target="_blank" style="padding:0;margin:1pt;border:0">
			<button class="ui-button" type="button" onclick="return true" onclick2="window.open(&quot;{@src}&quot;);return false;" tabindex="99998">
				<div class="ui-cmd-icon">
					<img src="{$silk}help.png" alt="user:" class="icon"/>
				</div>
				<div class="ui-cmd-text">
					Documentation
				</div>
			</button>
		</a>
	</xsl:template>
	
	<xsl:template match="client"/>
	
	<xsl:template match="*[@layout='container']">
		<xsl:param name="format" />
		<xsl:param name="value" />
		<xsl:param name="zoom"><xsl:value-of select="@zoom" /><xsl:if test="not(@zoom)"><xsl:value-of select="$zoom" /></xsl:if></xsl:param>
		<xsl:choose>
			<xsl:when test="*">
				<xsl:copy-of select="*"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="."/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="*[@layout='document']">
		<xsl:param name="format" />
		<xsl:param name="value" />
		<xsl:param name="zoom"><xsl:value-of select="@zoom" /><xsl:if test="not(@zoom)"><xsl:value-of select="$zoom" /></xsl:if></xsl:param>

		<xsl:if test="*[@layout='document']">
			<!-- xsl:include href="layout.xsl"/ -->
		</xsl:if>
		<!-- xsl:apply-imports/ -->
	</xsl:template>
	
	<xsl:template match="*">
		<xsl:param name="format" />
		<xsl:param name="value" />
		<xsl:copy>
			<xsl:copy-of select="@*" />
			<xsl:apply-templates>
				<xsl:with-param name="format" select="$format"/>
				<xsl:with-param name="value" select="$value"/>
			</xsl:apply-templates>
		</xsl:copy>
	</xsl:template>
	
</xsl:stylesheet><%/FORMAT%><%/FINAL%>