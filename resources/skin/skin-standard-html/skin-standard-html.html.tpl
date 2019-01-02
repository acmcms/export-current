<html><body><h1>Skin: skin-standard-html</h1><!-- <%FORMAT:'html'%><%
%><%OUTPUT: body %><%
	%><%= '<!' + '-- ' + 'begin' %><%
	%>-->
		<p>Abstract HTML skin.</p>
		<ul>
			<li>
				<h2>What does it give?</h2>
				<ul>
					<li>'<a href="template-html-page.html">html-page</a>' template;</li>
					<li>default server error ('500') template;</li>
					<li>'<a href="/!/skin/skin-jsclient/">skin-jsclient</a>' imported as a '<a href="client/">client/</a>'.</li>
					<li>a local copy of <a href="http://jquery.com/">jQuery</a>.</li>
					<li>
						<h3>Local copies of libraries?</h3>
						<p>Skin contains local copies of some versions of jQuery and other 
						libraries. They are used by '<a href="template-html-page.html">html-page</a>' 
						template when CDN link to those libraries is not available or not suitable.
						For example in case of HTTPS session.</p>
						<p>However, if you are not using 'html-page' template those local 
						copies are easily available at following locations:
						<ul>
							<li><a href="$files/jquery-1.8.3.min.js">/$files/jquery-1.8.3.min.js</a></li>
							<li><a href="$files/jquery-1.5.min.js">/$files/jquery-1.5.min.js</a></li>
							<li><a href="$files/jquery-1.4.4.min.js">/$files/jquery-1.4.4.min.js</a></li>
							<li><a href="$files/jquery-1.3.2.min.js">/$files/jquery-1.3.2.min.js</a></li>
						</ul>
						</p>
					</li>
				</ul>
			</li>
			<li>
				<h2>How to use?</h2>
				<p>Just add a line
				<code>&lt;prototype>skin-standard-html&lt;/prototype></code>
				in your <b>skin.settings.xml</b> file... But only if it does not 
				contain 'prototype' directive yet. If it does - there is a good
				chance it is already present in prototype chain.<br>
				</p>
				<p><i>Note: </i>You can still use $files/ goodies without having 'skin-standard-html' in
				your skin's prototype chain by adding a skin selector prefix, like:
				<a href="/!/skin/skin-standard-html/$files/jquery-1.8.3.min.js">/!/skin/skin-standard-html/$files/jquery-1.8.3.min.js</a>
				</p>
			</li>
		</ul>
	<!-- <%= 'end. ' + '--' + '>' %><%
%><%/OUTPUT%><%
%><%RETURN: {
		title		: 'Skin: skin-standard-html',
		template	: "html-document",
		body		: body
	} %><%
%><%
%><%/FORMAT%> --></body></html>