let video = document.querySelector('video');
let vidbutton = document.querySelector('#record');
let captureButton = document.getElementById('capture');
let mediaRecorder;
let isRecording = false;
let chunks = [];
let filterContainer = document.querySelector('.filter_container');
let filter = "";
let body = document.querySelector('body');
let zoomInContainer = document.querySelector('.zoom_in_container');
let zoomOutContainer = document.querySelector('.zoom_out_container');
let maxZoom = 3, minZoom = 1, currZoom = 1;
let galleryBtn = document.querySelector('.gallery_container');

vidbutton.addEventListener('click', () => {
    let recordInnerDiv = document.querySelector('#record .inner');
    console.log(recordInnerDiv);
    if (isRecording) {
        recordInnerDiv.classList.remove('recordAnimation');
        mediaRecorder.stop();
    }
    else {
        mediaRecorder.start();
        filter = '';
        removeFilter();
        video.style.transform = `scale(1)`;
        currZoom=1;
        recordInnerDiv.classList.add('recordAnimation');
    }

    isRecording = !isRecording;
});

let constraints = { video: true, audio: true };
// constraits -> play only video or audio or both

// navigator is feature of BOM to access camera and mic of user
// media devices is child of navigator to help achieve the above task
// get user media returns a promise whether user has allowed his camera to be accessed or not
// media stream is data returned by promise 
navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
    // setting src as media stream to set the content of video as input to camera
    video.srcObject = mediaStream;

    mediaRecorder = new MediaRecorder(mediaStream);

    mediaRecorder.addEventListener('dataavailable', (event) => {
        chunks.push(event.data);
    });

    mediaRecorder.addEventListener('stop', (event) => {

        let blob = new Blob(chunks, { type: 'video/mp4' });

        chunks = [];

        let url = URL.createObjectURL(blob);
        addMedia('video', blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'video.mp4';
        a.click();
        a.remove();
    });

});

captureButton.addEventListener('click', () => {

    let captureInnerDiv = document.querySelector('#capture .inner');
    captureInnerDiv.classList.add('captureAnimation');

    setTimeout(() => {
        captureInnerDiv.classList.remove('captureAnimation');
    }, 400);

    let canvas = document.createElement('canvas');
    let Blankcanvas = document.createElement('canvas');
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;

    let ctx = canvas.getContext('2d');

    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.scale(currZoom, currZoom);
    ctx.translate(-canvas.width/2, -canvas.height/2);

    setTimeout(() => {
        ctx.drawImage(video, 0, 0);

        if (filter != '') {
            ctx.fillStyle = filter;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        let url = canvas.toDataURL();
        addMedia('image', url);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'image.jpg';
        a.click();
        a.remove();
    }, 1000);
});

filterContainer.addEventListener('click', (event) => {
    let target = event.target;
    filter = target.style.backgroundColor;
    // console.log(filter);
    removeFilter();
    applyFilter(filter);
});

function applyFilter(filter) {
    let div = document.createElement('div');
    div.classList.add('filter_class');
    div.style.backgroundColor = filter;
    body.appendChild(div);
}

function removeFilter() {
    let div = document.querySelector('.filter_class');
    if (div) div.remove();
}

zoomInContainer.addEventListener('click', ()=>{
    currZoom = Math.min(currZoom+.1, 3.0);
    console.log(currZoom);
    video.style.transform = `scale(${currZoom})`;
});

zoomOutContainer.addEventListener('click', ()=>{
    currZoom = Math.max(currZoom-.1, 1.0);
    video.style.transform = `scale(${currZoom})`;
});

galleryBtn.addEventListener('click', ()=>{
    // console.log('clicked');
    location.assign('gallery.html');
});