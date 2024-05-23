let code = document.getElementById("code");
let cmd = document.getElementById("cmd");
let disp = document.getElementById("disp");

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

    var index = code.value.indexOf(searchText);
    if (index !== -1) {
        code.focus();
        code.setSelectionRange(index, index + searchText.length);
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
    if (event.shiftKey && event.code === "Tab") {
        event.preventDefault();
        cmd.focus();
    } else if (event.code === "Tab" && document.activeElement === code) {
        event.preventDefault();
        insertAtCursor(code, '\t');
    } else if (event.code === "Enter" && document.activeElement === cmd) {
        event.preventDefault();
        let order = cmd.value.split(" ")[0].toLowerCase();
        let args = cmd.value.split(" ").slice(1);

        if (order === "save") {
            localStorage.setItem(args[0], code.value);
            log("Saved!");
        } else if (order === "load") {
            code.value = localStorage.getItem(args[0]);
            log("Loaded!");
        } else if (order === "find") {
            findAndFocus(args[0]);
        } else if (order === "replace") {
            code.value = code.value.replace(args[0], args[1]);
            log("Replaced!")
        } else if (order === "down") {
            downloadTextFile(code.value, args[0])
        } else if (order === "copy") {
            copyClipboard(code.value);
        } else {
            log("Please enter vaild command")
        }
        cmd.value = "";
        code.focus();
    }
});