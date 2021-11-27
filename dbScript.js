let dbAccess;
let request = indexedDB.open("Camera", 1);
let container = document.querySelector('.container');

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

function viewMedia(){
    let transaction = dbAccess.transaction('gallery', 'readonly');
    let galleryObjectStore = transaction.objectStore('gallery');

    let request = galleryObjectStore.openCursor();
    request.addEventListener('success', ()=>{
        let cursor = request.result;

        if(cursor){
            let div = document.createElement('div');
            div.classList.add('media_card');
            div.innerHTML = `<div class="media_container">
            ${cursor.value.type}</div>
            <div class="action_container">
                <div class="download_container">
                    <i class="fas fa-download"></i>
                </div>
                <div class="delete_container">
                    <i class="fas fa-trash-alt"></i>
                </div>
            </div>`;

            container.appendChild(div);
            cursor.continue();
        }
    });
}