var db, dbObjStore, repeat;

function urlParams () {
    const url = new URL (window.location.href);
    const params = new URLSearchParams(url.search);
    const file = params.get("file");
    return file;
};
function checkForFileParams () {
    return new Promise ((resolve, reject) => {
        const objectStore = db.transaction("noteTakingDB", "readwrite").objectStore("noteTakingDB");
        const request = objectStore.getAll();
        const file = urlParams();
        if (file != "") {
            if (file != null) { 
                request.onsuccess = () => {
                    const req = request.result;
                    req.forEach(element => {
                        const reqFile = element['fileTitle']
                        if (reqFile == file) {
                            resolve(1);
                        };
                    });
                };
            } else {resolve(0)};
        }else resolve(0);
    });
};
function fileRegex(fileName) {
    const regex = '\.md$';
    if(fileName.match(regex) != null) {
        return true;
    } else {
        return false;
    };
};
function fileButtonAppend(title) {
    const button = document.createElement("button");
    const a = document.createElement("a");
    a.href = "?file=" + title;
    a.innerHTML= title;
    button.append(a);
    const div = document.getElementById("filesMenu");
    div.appendChild(button);
};
function saveFile () {
    let db = window.db
    const transaction = db.transaction("noteTakingDB", "readwrite");
    const objectStore = transaction.objectStore("noteTakingDB");
    const fileTitle = urlParams();
    const request = objectStore.get(fileTitle)
    request.onsuccess = () => {
        const content = document.getElementById("appInput");
        const file = request.result;
        file.contentBlob = content.value;
        const salvar = objectStore.put(file);
        salvar.onsuccess = () => {
            console.log("Salvou")
        }
    }
    window.repeat = setTimeout(saveFile, 3000)
};
function createFile () {
    const file = prompt("Digite o nome do Arquivo, no formato 'exemplo.md'");
    if (fileRegex(file)) {
        let db = window.db;
        const transaction = db.transaction("noteTakingDB", "readwrite");
        const objectStore = transaction.objectStore("noteTakingDB");
        objectStore.put({fileTitle: file, contentBlob: ""});
        window.location.replace (window.location.origin + window.location.pathname + "?file=" + file);
    } else {
        alert("Digite um arquivo no formato requerido: 'exemplo.md'");
    }
};
function downloadFile () {
    const fileName = urlParams();
    const content = document.getElementById("appInput");
    const file = new File ([content.value], fileName, {type: "text/markdown",});
    const link = document.createElement("a");
    link.download = fileName;
    const url = URL.createObjectURL(file);
    link.href = url;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
function deleteFile() {
    const file = urlParams();
    let db = window.db;
    const transaction = db.transaction("noteTakingDB", "readwrite");
    const objectStore = transaction.objectStore("noteTakingDB");
    objectStore.delete(file);
    window.location.replace (window.location.origin + window.location.pathname);
};
function openDB () {
    let db;
    const open = window.indexedDB.open("noteTakingDB");
    open.onerror = (event) => {console.error("Não foi possível abrir o Banco de Dados local.");};
    open.onsuccess = (event) => {db = event.target.result; loadDB(db);};
    open.onupgradeneeded = (event) => {
        db = event.target.result; 
        const objectStore = db.createObjectStore("noteTakingDB", {keyPath: "fileTitle"}); 
        const contentBlob = objectStore.createIndex("contentBlob", "contentBlob", {unique:false});
        objectStore.put({fileTitle: "example.md", contentBlob: "Digite seu texto aqui!"});
    };
};
function loadDB (db) {
    window.db = db;
    window.dbObjStore = db.transaction("noteTakingDB", "readwrite").objectStore("noteTakingDB");
    pageLoad()
};
function fileContent (fileName) {
    return new Promise ((resolve, reject) => {
        const objectStore = db.transaction("noteTakingDB", "readwrite").objectStore("noteTakingDB");
        const request = objectStore.getAll();
        request.onsuccess = () => {
            const req = request.result;
            req.forEach(element => {
                if (fileName == element['fileTitle']) {
                    resolve(element['contentBlob']);
                };
            });
        };
    });
};
function loadFileMenu () {
    let db = window.db
    const transaction = db.transaction("noteTakingDB", "readwrite");
    const objectStore = transaction.objectStore("noteTakingDB");
    const request = objectStore.getAll();
    request.onsuccess = () => {
        request.result.forEach(element => {
            fileButtonAppend(element['fileTitle']);
        });
    };
}
function loadContent (fileName) {
    return new Promise ((resolve, reject) => {
        const objectStore = db.transaction("noteTakingDB", "readwrite").objectStore("noteTakingDB");
        const request = objectStore.getAll();
        request.onsuccess = () => {
            const req = request.result;
            req.forEach(element => {
                if (fileName == element['fileTitle']) {
                    resolve(element['contentBlob']);
                };
            });
        };
    });
};
function convertMarkdown() {
    const file = urlParams()
    window.location.href = window.location.origin + window.location.pathname + "markdown.html" + "?file=" + file; 
}
function pageLoad () {
    loadFileMenu();
    checkForFileParams().then((e) => {
        if (e==1) {
            const file = urlParams()
            loadContent(file).then((e) => {
                const textarea = document.getElementById("appInput");
                textarea.innerHTML = e;
                setTimeout(saveFile, 3000);
            });
        }else {
            document.getElementById("appInput").innerHTML = "Selecione ou Crie um Arquivo para Continuar";
        };

    });
};
openDB();