let cmd;
let code;
let disp;
var editor;

document.addEventListener("DOMContentLoaded", function () {
    cmd = document.getElementById("cmd");
    code = document.getElementById("code");
    disp = document.getElementById("disp");

    editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        mode: "javascript"
    });
});

function log(text) {
    disp.textContent = `Editan - ${text}`
}

function insertAtCursor(textarea, textToInsert) {
    var cursorPosition = textarea.selectionStart;
    var textBefore = textarea.value.substring(0, cursorPosition);
    var textAfter = textarea.value.substring(cursorPosition);

    textarea.value = textBefore + textToInsert + textAfter;
    textarea.selectionStart = textarea.selectionEnd = cursorPosition + textToInsert.length;
}

function findAndFocus(searchText) {
    if (searchText === null || searchText === "") {
        return;
    }

    var codeText = editor.getValue(); 
    var index = codeText.indexOf(searchText); 

    let line = 0;
    for (i of codeText.split("\n")) {
        if (i.includes(searchText)) {
            break
        }
        line++;
    }

    if (index !== -1) {
        editor.focus(); 
        editor.setSelection({ line: line, ch: index }, { line: line, ch: index + searchText.length }); 
        log(`Found ${searchText}`);
    } else {
        log("Not found");
    }
}


function downloadTextFile(text, name) {
    var blob = new Blob([text], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function copyClipboard(textToCopy) {
    navigator.clipboard.writeText(textToCopy)
        .then(function () {
            log('Text copied to clipboard');
        })
        .catch(function (err) {
            log('Unable to copy text: ', err);
        });
}

document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.code === "Space") {
        event.preventDefault();
        cmd.focus();
    } else if (event.code === "Tab" && document.activeElement === code) {
        event.preventDefault();
        insertAtCursor(code, '  ');
    } else if (event.code === "Enter" && document.activeElement === cmd) {
        event.preventDefault();
        let order = cmd.value.split(" ")[0].toLowerCase();
        let args = cmd.value.split(" ").slice(1);

        if (order === "save") {
            localStorage.setItem(args[0], editor.getValue()); 
            log("Saved!");
        } else if (order === "load") {
            editor.setValue(localStorage.getItem(args[0])); 
            log("Loaded!");
        } else if (order === "find") {
            findAndFocus(args[0]);
        } else if (order === "replace") {
            editor.setValue(editor.getValue().replace(new RegExp(args[0], 'g'), args[1]));
            log("Replaced!")
        } else if (order === "down") {
            downloadTextFile(editor.getValue(), args[0]); 
        } else if (order === "copy") {
            copyClipboard(editor.getValue()); 
        } else if (order === "lang") {
            editor.setOption("mode", args[0]);
            log("Language is changed!")
        } else {
            log("Please enter vaild command")
        }
        cmd.value = "";
        editor.focus(); 
    }
});
