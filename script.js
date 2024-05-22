let code = document.getElementById("code");
let cmd = document.getElementById("cmd");
let disp = document.getElementById("disp");

function print(text) {
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

    let textarea = code;

    var index = code.value.indexOf(searchText);
    if (index !== -1) {
        code.focus();
        textarea.setSelectionRange(index, index + searchText.length);
        print(`Found ${searchText}`);
    } else {
        print("Not found");
    }

}

document.addEventListener("keydown", (event) => {
    if (event.key === "Control" && event.altKey) {
        cmd.focus();
    } else if (event.code === "Tab" && document.activeElement === code) {
        event.preventDefault();
        insertAtCursor(code, '    ');
    } else if (event.code === "Enter" && document.activeElement === cmd) {
        event.preventDefault();
        let order = cmd.value.split(" ")[0];
        let args = cmd.value.split(" ").slice(1);

        if (order === "save") {
            localStorage.setItem("code", code.value);
            print("Saved!");
        } else if (order === "load") {
            code.value = localStorage.getItem("code");
            print("Loaded!");
        } else if (order === "find") {
            findAndFocus(args[0]);
        }
        cmd.value = "";
        code.focus();
    }
});