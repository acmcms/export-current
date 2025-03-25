function htmlBold() {
	htmlInsertSTag(this.parent.editorObject, 'B');
}

function htmlItalic() {
	htmlInsertSTag(this.parent.editorObject, 'I');
}

function htmlUnderline() {
	htmlInsertSTag(this.parent.editorObject, 'U');
}

function htmlStrikethrough() {
	htmlInsertSTag(this.parent.editorObject, 'STRIKE');
}

function htmlParagraph() {
	htmlInsertSTag(this.parent.editorObject, 'P');
}

function htmlCenter() {
	htmlInsertSTag(this.parent.editorObject, 'CENTER');
}

function htmlSubscript() {
	htmlInsertSTag(this.parent.editorObject, 'SUB');
}

function htmlSuperscript() {
	htmlInsertSTag(this.parent.editorObject, 'SUP');
}

function htmlFont() {
	htmlInsertSTag(this.parent.editorObject, 'FONT', 'SIZE="" COLOR=""');
}

function htmlComment() {
	htmlInsertTag(this.parent.editorObject, {
		'open' : '<!-- ',
		'close' : ' -->'
	});
}

function htmlScript() {
	htmlInsertTag(this.parent.editorObject, {
		'open' : '<SCRIPT LANGUAGE="JavaScript">\n<!--',
		'close' : '\n\n//-->\n</' + 'SCRIPT>'
	});
}

function htmlNBSP() {
	htmlInsertText(this.parent.editorObject, '&nbsp;');
}

function htmlBreak() {
	htmlInsertText(this.parent.editorObject, '<BR>');
}

function htmlRule() {
	htmlInsertText(this.parent.editorObject, '<HR>');
}

function htmlLink() {
	var result = showModalDialog(
			"linkchooser-modal/",
			false,
			"dialogWidth:600px; dialogHeight:160px; scroll:no; status:no; resizable:yes; help:no");
	if (!result?.['path']) {
		try {
			this.parent.editorObject.setFocus();
		} catch (Error) {
		}
		return;
	}
	var text = 'HREF="' + result['path'] + '"';
	if (result['title'])
		text += ' TITLE="' + result['title'] + '"';
	if (result['target'])
		text += ' TARGET="' + result['target'] + '"';
	htmlInsertSTag(this.parent.editorObject, 'A', text);
}

function htmlImage() {
	var result = showModalDialog(
			"shared-editor_image.control",
			false,
			"dialogWidth:400px; dialogHeight:260px; scroll:no; status:no; resizable:yes; help:no");
	if (!result) {
		try {
			this.parent.editorObject.setFocus();
		} catch (Error) {
		}
		return;
	}
	if (result['html'])
		htmlInsertText(this.parent.editorObject, result['html']);
}

function htmlInsertSTag(obj, tag, atr) {
	if (!tag || !obj)
		return;
	atr = atr ? ' ' + atr : '';
	var oSelect = GetSelection(obj);
	oSelect.text = '<' + tag + atr + '>' + oSelect.text + '</' + tag + '>';
}

function htmlInsertTag(obj, tag) {
	if (!tag || !obj)
		return;
	var oSelect = GetSelection(obj);
	oSelect.text = tag['open'] + oSelect.text + tag['close'];
}

function htmlInsertText(obj, text) {
	if (!text || !obj)
		return;
	var oSelect = GetSelection(obj);
	oSelect.text = text
}

function GetSelection(obj) {
	obj.focus();
	var selectionRange = document.selection.createRange();
	return selectionRange;
}