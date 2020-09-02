/**
 * Copyright (C) 2017 Wasabeef
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



var RE = {};

RE.currentSelection = {
    "startContainer": 0,
    "startOffset": 0,
    "endContainer": 0,
    "endOffset": 0
};

/**
 * 自动聚焦初始化编辑器 否者元素会出现问题
 * @type {HTMLElement}
 */
RE.editor = document.getElementById('editor');
RE.btn = document.getElementById('edit-btn');
RE.checkbox = document.getElementById('checkbox');


//! 新增  ↓
RE.init = function () {
    RE.editor.focus();
    RE.editor.innerHTML = `<div><br/></div>`;
    RE.btn.onclick = function () {
        RE.getCursor();
    };
    RE.editor.onkeydown = function (e) {
        // console.log();
        if (e.keyCode === 13 && JsInterface.isEnterMultiline()) {
            let a = window.getSelection();
            let aDiv = document.createElement('div');
            aDiv.innerHTML = '<br/>';
            if (a.baseNode.innerHTML === '<br>') {
                return;
            }
            a.baseNode.parentNode.parentNode.insertBefore(aDiv, a.baseNode.parentNode.nextSibling);
            let range = a.getRangeAt(0);
            range.setStartAfter(aDiv);
            a.addRange(range);
            // console.log(range);
        }
    };
    RE.checkbox.checked = true;
    RE.checkbox.onchange = function (e) {
        let checked = e.target.checked;
        let editBr = RE.editor.getElementsByTagName('div');
        let divTeaxt = [];
        for (let i = 0; i < editBr.length; i++) {
            if (editBr[i].childNodes[0].nodeName === '#text') {
                divTeaxt.push(editBr[i]);
                if (document.querySelector('#checkbox').checked) {
                    let aDiv = document.createElement('div');
                    aDiv.innerHTML = '<br/>';
                    divTeaxt.push(aDiv);
                }

            }
        }
        let aDiv = document.createElement('div');
        aDiv.innerHTML = '<br/>';
        divTeaxt.push(aDiv);
        RE.editor.innerHTML = '';
        divTeaxt.forEach(item => {
            RE.editor.appendChild(item);
        });

    };
};
RE.init();



/**
 * 多行进行递归 直到找出公共父级
 * @param baseNode 开始节点
 * @param extentNode 结束节点
 */
RE.getDom = function (baseNode, extentNode) {
    if (baseNode === extentNode) {
        let divs = baseNode.getElementsByTagName("div");
        let number = '0px';
        let num = 0;
        for (let i = 0; i < divs.length; i++) {
            if (divs[i].style.textIndent === '32px') {
                number = '32px';
                num += 1;
            }
        }
        for (let i = 0; i < divs.length; i++) {
            if ((number === '32px' && num < divs.length) || num === 0) {
                divs[i].style.textIndent = '32px';
            } else {
                divs[i].style.textIndent = '0px';
                // console.log(divs[i].style.textIndent);
            }
        }
    } else {
        let baseNodeParentElement = baseNode.parentElement;
        let extentNodeParentElement = extentNode.parentElement;
        if (baseNodeParentElement.localName === 'div') {
            baseNodeParentElement = baseNode;
        }
        if (extentNodeParentElement.localName === 'div') {
            extentNodeParentElement = extentNode;
        }
        RE.getDom(baseNodeParentElement, extentNodeParentElement);
    }
};
/**
 * 获取当前光标选择多行还是单行 调用此方法即可
 * 如是多行进行递归找出公共的父级元素 ，把公共父级所有元素进行收缩
 */
RE.getCursor = function () {
    editor = document.getElementsByTagName('div');
    blockquote = document.getElementsByTagName('blockquote')
    let ed = document.getElementById('editor');
    ed.focus()

    let aa = document.execCommand("indent", false, null);

    let a = window.getSelection();

    if (a.baseNode === a.extentNode) {
        if (a.baseNode.parentElement.style.textIndent && a.baseNode.parentElement.style.textIndent !== '0px') {
            a.baseNode.parentElement.style.textIndent = '0px';
        } else {
            a.baseNode.parentElement.style.textIndent = '32px';
        }
    } else {
        RE.getDom(a.baseNode.parentElement, a.extentNode.parentElement);
    }

}
//! 新增  ↑

document.addEventListener("selectionchange", function () {
    RE.backuprange();
});

// Initializations
RE.callback = function () {
    window.location.href = "re-callback://" + encodeURI(RE.getHtml());
};

RE.setHtml = function (contents) {
    RE.editor.innerHTML = decodeURIComponent(contents.replace(/\+/g, '%20'));
};

RE.getHtml = function () {
    return RE.editor.innerHTML;
};

RE.getText = function () {
    // var text = '<p color=#e2e2e2 /><p/>';

    // RE.getText(text);

    return RE.editor.innerText;
};

RE.setBaseTextColor = function (color) {
    RE.editor.style.color = color;
}

RE.setBaseFontSize = function (size) {
    RE.editor.style.fontSize = size;
}

RE.setPadding = function (left, top, right, bottom) {
    RE.editor.style.paddingLeft = left;
    RE.editor.style.paddingTop = top;
    RE.editor.style.paddingRight = right;
    RE.editor.style.paddingBottom = bottom;
}

RE.setBackgroundColor = function (color) {
    document.body.style.backgroundColor = color;
}

RE.setBackgroundImage = function (image) {
    RE.editor.style.backgroundImage = image;
}

RE.setWidth = function (size) {
    RE.editor.style.minWidth = size;
};

RE.setHeight = function (size) {
    RE.editor.style.height = size;
};

RE.setTextAlign = function (align) {
    RE.editor.style.textAlign = align;
}

RE.setVerticalAlign = function (align) {
    RE.editor.style.verticalAlign = align;
}

RE.setPlaceholder = function (placeholder) {
    RE.editor.setAttribute("placeholder", placeholder);
}

RE.setInputEnabled = function (inputEnabled) {
    RE.editor.contentEditable = String(inputEnabled);
}

RE.undo = function () {
    document.execCommand('undo', false, null);
}

RE.redo = function () {
    document.execCommand('redo', false, null);
}

RE.setBold = function () {
    document.execCommand('bold', false, null);
}

RE.setItalic = function () {
    document.execCommand('italic', false, null);
}

RE.setSubscript = function () {
    document.execCommand('subscript', false, null);
}

RE.setSuperscript = function () {
    document.execCommand('superscript', false, null);
}

RE.setStrikeThrough = function () {
    document.execCommand('strikeThrough', false, null);
}

RE.setUnderline = function () {
    document.execCommand('underline', false, null);
}

RE.setBullets = function () {
    document.execCommand('insertUnorderedList', false, null);
}

RE.setNumbers = function () {
    document.execCommand('insertOrderedList', false, null);
}

RE.setTextColor = function (color) {
    RE.restorerange();
    document.execCommand("styleWithCSS", null, true);
    document.execCommand('foreColor', false, color);
    document.execCommand("styleWithCSS", null, false);
}

RE.setTextBackgroundColor = function (color) {
    RE.restorerange();
    document.execCommand("styleWithCSS", null, true);
    document.execCommand('hiliteColor', false, color);
    document.execCommand("styleWithCSS", null, false);
}

RE.setFontSize = function (fontSize) {
    document.execCommand("fontSize", false, fontSize);
}

RE.setHeading = function (heading) {
    document.execCommand('formatBlock', false, '<h' + heading + '>');
}

RE.setIndent = function () {
    document.execCommand('indent', false, null);
}

RE.setOutdent = function () {
    document.execCommand('outdent', false, null);
}

RE.setJustifyLeft = function () {
    document.execCommand('justifyLeft', false, null);
}

RE.setJustifyCenter = function () {
    document.execCommand('justifyCenter', false, null);
}

RE.setJustifyRight = function () {
    document.execCommand('justifyRight', false, null);
}

RE.setBlockquote = function () {
    document.execCommand('formatBlock', false, '<blockquote style="text-indent:2rem;">');
}

RE.insertImage = function (url, alt) {
    var html = '<img src="' + url + '" alt="' + alt + '" />';
    RE.insertHTML(html);
}

RE.insertHTML = function (html) {
    RE.restorerange();
    document.execCommand('insertHTML', false, html);
}

RE.insertLink = function (url, title) {
    RE.restorerange();
    var sel = document.getSelection();
    if (sel.toString().length == 0) {
        document.execCommand("insertHTML", false, "<a href='" + url + "'>" + title + "</a>");
    } else if (sel.rangeCount) {
        var el = document.createElement("a");
        el.setAttribute("href", url);
        el.setAttribute("title", title);

        var range = sel.getRangeAt(0).cloneRange();
        range.surroundContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
    }
    RE.callback();
}

RE.setTodo = function (text) {
    var html = '<input type="checkbox" name="' + text + '" value="' + text + '"/> &nbsp;';
    document.execCommand('insertHTML', false, html);
}

RE.prepareInsert = function () {
    RE.backuprange();
}

RE.backuprange = function () {
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
        var range = selection.getRangeAt(0);
        RE.currentSelection = {
            "startContainer": range.startContainer,
            "startOffset": range.startOffset,
            "endContainer": range.endContainer,
            "endOffset": range.endOffset
        };
    }
}

RE.restorerange = function () {
    var selection = window.getSelection();
    selection.removeAllRanges();
    var range = document.createRange();
    range.setStart(RE.currentSelection.startContainer, RE.currentSelection.startOffset);
    range.setEnd(RE.currentSelection.endContainer, RE.currentSelection.endOffset);
    selection.addRange(range);
}

RE.enabledEditingItems = function (e) {
    var items = [];
    if (document.queryCommandState('bold')) {
        items.push('bold');
    }
    if (document.queryCommandState('italic')) {
        items.push('italic');
    }
    if (document.queryCommandState('subscript')) {
        items.push('subscript');
    }
    if (document.queryCommandState('superscript')) {
        items.push('superscript');
    }
    if (document.queryCommandState('strikeThrough')) {
        items.push('strikeThrough');
    }
    if (document.queryCommandState('underline')) {
        items.push('underline');
    }
    if (document.queryCommandState('insertOrderedList')) {
        items.push('orderedList');
    }
    if (document.queryCommandState('insertUnorderedList')) {
        items.push('unorderedList');
    }
    if (document.queryCommandState('justifyCenter')) {
        items.push('justifyCenter');
    }
    if (document.queryCommandState('justifyFull')) {
        items.push('justifyFull');
    }
    if (document.queryCommandState('justifyLeft')) {
        items.push('justifyLeft');
    }
    if (document.queryCommandState('justifyRight')) {
        items.push('justifyRight');
    }
    if (document.queryCommandState('insertHorizontalRule')) {
        items.push('horizontalRule');
    }
    var formatBlock = document.queryCommandValue('formatBlock');
    if (formatBlock.length > 0) {
        items.push(formatBlock);
    }

    window.location.href = "re-state://" + encodeURI(items.join(','));
}

RE.focus = function () {
    var range = document.createRange();
    range.selectNodeContents(RE.editor);
    range.collapse(false);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    RE.editor.focus();
}

RE.blurFocus = function () {
    RE.editor.blur();
}

RE.removeFormat = function () {
    document.execCommand('removeFormat', false, null);
}

// Event Listeners
RE.editor.addEventListener("input", RE.callback);
RE.editor.addEventListener("keyup", function (e) {
    var KEY_LEFT = 37, KEY_RIGHT = 39;
    if (e.which == KEY_LEFT || e.which == KEY_RIGHT) {
        RE.enabledEditingItems(e);
    }
});
RE.editor.addEventListener("click", RE.enabledEditingItems);
