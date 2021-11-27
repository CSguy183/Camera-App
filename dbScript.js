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
            div.innerHTML = `<div class="media_container"></div>
            <div class="action_container">
                <div class="download_container">
                    <i class="fas fa-download"></i>
                </div>
                <div class="delete_container" data_id = '${cursor.value.nId}'>
                    <i class="fas fa-trash-alt"></i>
                </div>
            </div>`;

            let downloadBtn = div.querySelector('.download_container');
            let deleteBtn = div.querySelector('.delete_container');

            deleteBtn.addEventListener('click', (event)=>{
                let id = event.currentTarget.getAttribute('data_id');
                // delete from ui
                event.currentTarget.parentElement.parentElement.remove();
                // delete from db
                console.log(id);
                DeleteFromDB(id);
            });

            if(cursor.value.type == 'image'){
                let img = document.createElement('img');
                img.src = cursor.value.media;
                img.classList.add('media_gallery');
                let mediaContainer = div.querySelector('.media_container');
                mediaContainer.appendChild(img);

                downloadBtn.addEventListener('click', (event)=>{
                    let a = document.createElement('a');
                    // console.log(event.currentTarget.parentElement.parentElement.children[0].querySelector('img').src);
                    a.href = event.currentTarget.parentElement.parentElement.children[0].querySelector('img').src;
                    a.download = 'image.jpg';
                    a.click();
                    a.remove();
                });
            }   
            else{
                let video = document.createElement('video');
                video.src = window.URL.createObjectURL(cursor.value.media);
                video.autoplay = true;
                video.controls = true;
                video.loop = true;
                video.classList.add('media_gallery');
                let mediaContainer = div.querySelector('.media_container');
                mediaContainer.appendChild(video);

                downloadBtn.addEventListener('click', (event)=>{
                    let a = document.createElement('a');
                    // console.log(event.currentTarget.parentElement.parentElement.children[0].querySelector('img').src);
                    a.href = event.currentTarget.parentElement.parentElement.children[0].querySelector('img').src;
                    a.download = 'video.mp4';
                    a.click();
                    a.remove();
                });
            }

            container.appendChild(div);
            cursor.continue();
        }
    });
}

function DeleteFromDB(nId){
    let transaction = dbAccess.transaction('gallery', 'readwrite');
    let galleryObjectStore = transaction.objectStore('gallery');
    galleryObjectStore.delete(Number(nId));
}