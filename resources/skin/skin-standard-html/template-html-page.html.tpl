<html><body><!-- transparent TPL
<%FORMAT:'html'%><%
%><%OUTPUT: body %><%
	= '<!' + '-- ' + 'begin'
	%> -->
		<p>HTML page template. Provides basic html document structure and facilities.</p>
		<ul>
			<li>
				<h2>What does it give?</h2>
				<ul>
					<li>Selects more efficient way to load libraries</li>
					<li>Selects proper doctype and some meta's</li>
					<li>Organizing 'script' and 'style' dependencies</li>
					<li><a href="#default.css">default fail-safe CSS</a></li>
				</ul>
			</li>
			<li>
				<h2>How to use?</h2>
				<p>Just return a structure like this as a response:
					<table class="code">
						<tr>
							<td>
								<a href="#template">template</a>
							</td>
							<td>
								:
							</td>
							<td>
								exactly "html-page"
							</td>
						</tr>
						<tr>
							<td>
								title
							</td>
							<td>
								:
							</td>
							<td>
								page title
							</td>
						</tr>
						<tr>
							<td>
								<a href="#body">body</a>
							</td>
							<td>
								:
							</td>
							<td>
								whole body (including &lt;body> [or &lt;frameset> tag])
							</td>
						</tr>
						<tr>
							<td>
								<a href="#keywords">keywords</a>
							</td>
							<td>
								:
							</td>
							<td>
								comma-separated keywords list
							</td>
						</tr>
						<tr>
							<td>
								requireCss
							</td>
							<td>
								:
							</td>
							<td>
								collection of CSS names
							</td>
						</tr>
						<tr>
							<td>
								requireJs
							</td>
							<td>
								:
							</td>
							<td>
								collection of JS names, supports order, every script will be requested only once
							</td>
						</tr>
						<tr>
							<td>
								require
							</td>
							<td>
								:
							</td>
							<td>
								collection of JSO names, supports order, every object will be requested only once
									those are for preload only, should happen async and actual require() call still
									expected.
							</td>
						</tr>
						<tr>
							<td>
								pathPrefix
							</td>
							<td>
								:
							</td>
							<td>
								prefix path to add to CSS and JS urls, default: Request.urlBase + '/client/'
							</td>
						</tr>
						<tr>
							<td>
								useRequire
							</td>
							<td>
								:
							</td>
							<td>
								default: undefined, force use <a href="client/require.js.html">require.js</a> for javascript and styles, or default
							</td>
						</tr>
						<tr>
							<td>
								useDebug
							</td>
							<td>
								:
							</td>
							<td>
								default: undefined, force use <a href="client/debug.js.html">debug.js</a>, or default
							</td>
						</tr>
						<tr>
							<td>
								<a href="#useJQuery">useJQuery</a>
							</td>
							<td>
								:
							</td>
							<td>
								default: undefined, force use <a href="http://jquery.com/">jQuery</a> library, or default.
							</td>
						</tr>
						<tr>
							<td>
								useYUI
							</td>
							<td>
								:
							</td>
							<td>
								default: undefined, force use <a href="http://yuilibrary.com">YUI</a>-core library, or default
							</td>
						</tr>
						<tr>
							<td>
								head
							</td>
							<td>
								:
							</td>
							<td>
								part of head (excluding &lt;head> tag)
							</td>
						</tr>
						<tr>
							<td>
								<a href="#doctype">doctype</a>
							</td>
							<td>
								:
							</td>
							<td>
								One of: 'html', 'standard', 'ieQuirks', 'ie6', 'strict', 'frameset', 'loose', 'GWT'
							</td>
						</tr>
						<tr>
							<td>
								<a href="#uaCompatible">uaCompatible</a>
							</td>
							<td>
								:
							</td>
							<td>
								One of: 'standard', 'chromeFrame', 'ie9', 'ie8', 'ie7'
							</td>
						</tr>
					</table>
				</p>
				<li>
					<h3><a name="template"></a>template</h3>
					<ul>
						<li>Specifies that response should be passed to 'html-page' template, and exactly equal to 'html-page' string.</li>
					</ul>
				</li>
				<li>
					<h3><a name="body"></a>body</h3>
					<ul>
						<li>Response body including &lt;body> [or &lt;frameset>] tags.</li>
					</ul>
				</li>
				<li>
					<h3><a name="keywords"></a>keywords</h3>
					<p>
						Comma-separated list of keywords. Keywords from response 
						(if any) are <b>mixed</b> with global keywords (if any). 
						Global keywords are specified in <b>skin.settings.xml</b> 
						like this:
						<code>&lt;keywords>keyword1, key word 2, keyword3&lt;/keywords></code> 
					</p>
				</li>
				<li>
					<h3><a name="doctype"></a>doctype</h3>
					<p>
						One of: 
						<ul>
							<li><b>html</b><code>&lt;!doctype html>
							/// BANNER ///</code></li>
							<li><b>standard</b><code>&lt;!doctype html></code></li>
							<li><b>ieQuirks</b><code>/// BANNER ///
							&lt;!doctype html></code></li>
							<li><b>ie6</b><code>&lt;!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN"></code></li>
							<li><b>strict</b><code>&lt;!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"></code></li>
							<li><b>frameset</b><code>&lt;!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd"></code></li>
							<li><b>loose</b><code>&lt;!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"></code></li>
							<li><b>GWT</b><code>&lt;!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"></code></li>
						</ul>
						<p>
							Normally, you don't need to specify it. If no 'doctype' 
							specified 'html' would be used, unless 'body' starts 
							with <b>&lt;frameset</b>. In the latter case 'frameset' 
							would be used.
						</p>
						<p>
							The 'doctype' parameter can be overridden at query time by 
							'__override_doctype' query parameter without any changes 
							made in page source, so developer can debug effects of 
							doctype switching for his/hers page. Try: 
							<a href="?__override_doctype=html#doctype">html</a>
							<a href="?__override_doctype=standard#doctype">standard</a>
							<a href="?__override_doctype=ieQuirks#doctype">ieQuirks</a>
							<a href="?__override_doctype=ie6#doctype">ie6</a>
							<a href="?__override_doctype=strict#doctype">strict</a>
							<a href="?__override_doctype=frameset#doctype">frameset</a>
							<a href="?__override_doctype=loose#doctype">loose</a>
							<a href="?__override_doctype=GWT#doctype">GWT</a>
							<a href="?__override_doctype=invalid#doctype">invalid</a>
						</p>
						<p>
							See also: 'html-frameset', 'html-document' 
							or 'html-screen' page templates.
						</p>
					</p>
				</li>
				<li>
					<h3><a name="uaCompatible"></a>uaCompatible</h3>
					<p>
						One of: 
						<ul>
							<li>undefined<code></code></li>
							<li><b>standard</b><code>&lt;meta http-equiv="X-UA-Compatible" content="IE=9;IE=Edge,chrome=1"></code></li>
							<li><b>chromeFrame</b><code>&lt;meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1"></code></li>
							<li><b>ie9</b><code>&lt;meta http-equiv="X-UA-Compatible" content="IE=9"></code></li>
							<li><b>ie8</b><code>&lt;meta http-equiv="X-UA-Compatible" content="IE=8"></code></li>
							<li><b>ie7</b><code>&lt;meta http-equiv="X-UA-Compatible" content="IE=7"></code></li>
						</ul>
						<p>
							Normally, you don't need to specify it. If no 'uaCompatible' 
							specified nothing will be added to the page.
						</p>
					</p>
				</li>
				<li>
					<h3><a name="useJQuery"></a>useJQuery</h3>
					<ul>
						<li>Loads jQuery from CDN when current protocol is HTTP</li>
						<li>Loads local copy of jQuery when current protocol is HTTPS</li>
						<li>Specify string with version to use, one of: '1.5', '1.4.4', '1.3.2'</li>
						<li>If value is boolean true or evaluates to boolean true, youngest ('1.5') will be used</li>
						<li>If value is boolean false - jQuery will not be used</li>
						<li>
							If value is NOT boolean, nor string with explicit version, 
							value could be replaced by 
							<code>&lt;useJQuery class="boolean">true&lt;/useJQuery></code> 
							or 
							<code>&lt;useJQuery>1.4.4&lt;/useJQuery></code> 
							line in <b>skin.settings.xml</b></li>
						<li>If value is NOT boolean, value could be replaced by <a href="client/test/debug.html?__use_jquery=true">__use_jquery</a> request parameter</li>
						<li>If value is NOT boolean, value could be replaced by <a href="client/test/debug.html?__use_jquery=true">__no_jquery</a> request parameter</li>
					</ul>
				</li>
			</li>
			<li>
				<h2><a name="default.css"></a>What is default.css?</h2>
				<ul>
					<li>located at: client/js/default.css (relative to skin root), 
					you put your own at specified location to override default implementation;</li>
					<li>default implementation source code:
						<!-- <%CODE: 'ACM.ECMA' %> // --><!--
							import ru.myx.ae3.vfs.Storage;
							// var vfsRoot = skinner.root;
							var vfsRoot = Storage.PUBLIC.relative("resources/skin/skin-standard-html/", null);
							var source = vfsRoot.relativeText("client/css/default.css.tpl");
							= '--' + '>';
							= '<code>';
							= Format.xmlNodeValue(source).replace('&#13;', '\n');
							= '</code>';
						// --><!-- <%/CODE%><%IGNORE%> -->
						<div style="position:relative;height:500px">
							<iframe style="width:100%;height:100%" src="client/css/default.css.tpl"></iframe>
						</div>
						<!-- <%/IGNORE%><% // -->
						&nbsp;
					</li>
					<li>Selects proper doctype and some meta's</li>
					<li>Organizing 'script' and 'style' dependencies</li>
					<li><a href="#default.css">default fail-safe CSS</a></li>
				</ul>
			</li>
		</ul><!-- <%
	= 'end. ' + '--' + '>'
%><%/OUTPUT%><%
%><%RETURN: {
	title		: 'Template: html-page',
	template	: "html-document",
	body		: body
} %><%
%><%/FORMAT%>
 --></body></html>