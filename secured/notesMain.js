var FILE;
function addParamUrl (param,value) {
    const url = new URL (window.location.href);
    const params = new URLSearchParams(url.search);
    params.set(param,value);
    window.location.search = params.toString();
};
function addFileParam (filename) {
    addParamUrl("file", filename);
};
function getFileParam () {
    const url = new URL (window.location.href);
    const params = new URLSearchParams(url.search);
    const file = params.get("file");
    FILE = file;
    return file;
};
function main() {
    document.getElementById("login").outerHTML = "";
    document.getElementById("appFooter").style.display = "inline";
    const app = document.getElementById("main");
    const section = document.createElement("section");
    section.id = "appMain";
    const div = document.createElement("div");
    div.id = "filesMenu";
    const textArea = document.createElement("textarea");
    textArea.id = "appInput";
    section.appendChild(div);
    section.appendChild(textArea);
    app.appendChild(section);
};
window.onload = () => {
    loadKeysDB();
    if(sessionStorage.password) {
        exampleDB();
        main();
    } else {
        document.getElementById("login").style.display = "flex";
    }
};
