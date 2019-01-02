<script>
<%INCLUDE: 'field.text.toolbar.comands' %>
<%INCLUDE: 'field.text.toolbar.js' %>
<%INCLUDE: 'editor_toolbar-html.js' %>

function textOnkeydown(obj, e){
	e || (e = window.event);
	var keyCode = e.keyCode;
	obj.focus();
	var selectionRange = document.selection.createRange();
	if (keyCode == 9){
		var text = selectionRange.text;
		if(event.shiftKey){
			text = text.replace(/\n\t/g,'\n')
			if(text.indexOf('\t') == 0) text = text.substr(1);
			selectionRange.text = text;
		}else{
			text = text.replace(/\n/g,'\n\t');
			selectionRange.text = '\t' + text;
		}
		return false;
	}
}
</script>