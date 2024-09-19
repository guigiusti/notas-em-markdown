var KEYS, IV, SALT, ENCRYPTED_TITLE, ENCRYPTED_CONTENT


function storePassword (password) {
    const hash = hashEncoder(password);
    hash.then(e => sessionStorage.setItem("password", e));
};
function mdFileRegex(fileName) {
    const regex = '\.md$';
    if(fileName.match(regex) != null) {
        return true;
    } else {
        return false;
    };
};
async function hashEncoder (string,algorithm="SHA-256") {
    const encoded = new TextEncoder().encode(SALT+string);
    const hash = await window.crypto.subtle.digest(algorithm, encoded);
    return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
};
function loadKeysDB () {
    const openDB = window.indexedDB.open("clientKeys");
    openDB.onerror = (event) => {console.error("Não foi possível abrir o Banco de Dados local.")};
    openDB.onsuccess = (event) => {
        db = event.target.result; 
        window.KEYS = db;
        const objectStore = db.transaction("clientKeys").objectStore("clientKeys");
        const request = objectStore.getAll();
        request.onsuccess = () => {
            const req = request.result;
            IV = req[0].iv;
            SALT = req[0].salt;
        };
    };
    openDB.onupgradeneeded = (event) => {
        db = event.target.result;
        const objectStore = db.createObjectStore("clientKeys", {keyPath: "id"});
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        objectStore.put({id:"0",iv:iv, salt:salt});
    };

};
function login () {
    storePassword(document.getElementById("senha").value);
    exampleDB();
}
function passwordKey (password) {
    const encoder = new TextEncoder()
    return window.crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ['deriveKey']
    );
};
function deriveKey (passwordKey) {
    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: SALT,
            iterations: 250000,
            hash: "SHA-256",
        },
        passwordKey,
        {
            name: "AES-GCM", 
            length: 256,
        },
        false,
        ["encrypt", "decrypt"]
    );
};
async function encrypt(string) {
    const encoder = new TextEncoder();
    const passKey = await passwordKey(sessionStorage.password);
    const derive = await deriveKey (passKey);
    const encryptString = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: IV,
        },
        derive,
        encoder.encode(string)
    );
    return encryptString;
}
async function decrypt(string) {
    const decoder = new TextDecoder();
    const passKey = await passwordKey(sessionStorage.password);
    const derive = await deriveKey (passKey);
    const decryptString = await window.crypto.subtle.decrypt (
        {
            name: "AES-GCM",
            iv: IV,
        },
        derive,
        string
    );
    return decoder.decode(decryptString);
};
function exampleDB () {
    encrypt("Oi")
}