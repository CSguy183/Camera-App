let dbAccess;
let request = indexedDB.open("Camera", 1);

request.addEventListener('success', () => {
    dbAccess = request.result;
});

request.addEventListener('upgradeneeded', () => {
    let db = request.result;
    db.createObjectStore('gallery', { keyPath: 'nId' });
});

request.addEventListener('error', () => {
    console.log('error');
});

function addMedia(type, media) {

    let transaction = dbAccess.transaction('gallery', 'readwrite');
    let galleryObjectStore = transaction.objectStore('gallery');
    let entry = {
        "nId": Date.now(),
        type,
        media
    }

    galleryObjectStore.add(entry);
}