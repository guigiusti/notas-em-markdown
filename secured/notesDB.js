var DB;
function loadDB (encrypted_blob) {
    let db;
    const open = window.indexedDB.open("noteTakingDB");
    open.onerror = (event) => {console.error("Não foi possível abrir o Banco de Dados local.");};
    open.onsuccess = (event) => {db = event.target.result; window.DB = db; console.log("Carregando");};
    open.onupgradeneeded = async (event) => {
        console.log("Criando")
        db = event.target.result; 
        const objectStore = db.createObjectStore("noteTakingDB", {keyPath: "fileTitle"}); 
        const contentBlob = objectStore.createIndex("contentBlob", "contentBlob", {unique:false});
        objectStore.put({fileTitle: "example.md", contentBlob: encrypted_blob});
    };
}