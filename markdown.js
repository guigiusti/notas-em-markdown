const { jsPDF } = window.jspdf;
var db, dbObjStore, repeat, mdHTML;

function htmlToPDF () {
    const pdf = new jsPDF({
        format: 'a4',
        orientation: "portrait",
        unit: "mm",
    });
    const source = window.mdHTML;
    pdf.html(source, {
        callback: function (pdf) {
          pdf.save("output.pdf");
        },
        width: 210,
        windowWidth: 1080 ,
        autoPaging: 'text'
      });
}


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
                        } else {
                            resolve(0);
                        }
                    });
                };
            };
        };
        
    });
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
function pageLoad () {
    let markdown;
    checkForFileParams().then((e) => {if(e==1){
        const file = urlParams();
        const content = fileContent(file).then((e) => {
            markdown = marked.parse(e)
            const div = document.getElementById("markdownDiv");
            div.innerHTML = markdown;
            div.style = "height:100%;"
            const md = document.createElement("div")
            md.innerHTML = markdown
            md.style.letterSpacing = "0.01px";
            md.style.fontSize = "130%";
            md.style.margin = "5%";
            window.mdHTML = md;
        });
    }else {
        markdown = marked.parse("# Erro Arquivo não encontrado!")
        const div = document.getElementById("markdownDiv");
        div.innerHTML = markdown;
    };})
    const btn = document.getElementById("markdownBtn");
    btn.addEventListener("click", () => {
        const file = urlParams();
        window.location.href = window.location.origin + window.location.pathname + "?file=" + file; 
    });
    };
openDB();