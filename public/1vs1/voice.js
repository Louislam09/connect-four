const myAudio = document.createElement('video');
const myVideoGrid = document.querySelector('.video-grid');

let myAudioStream;
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
});

myAudio.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myAudioStream = stream;
    addAudioStream(myAudio,stream);

    peer.on('call', call => {
        call.answer(stream);
        const audio = document.createElement('video');

        call.on('stream', userAudioStream =>{
            addAudioStream(audio, userAudioStream);
            
        });

        let span  = document.createElement('span');
        let span2  = document.createElement('span');
    
        span2.innerText = 'Voz';
        span.classList.add('oponent-speaker');
        span.innerHTML = `<i class="material-icons">phone_in_talk</i>`;
        span.appendChild(span2);
        callContainer.appendChild(span);

        call.on('close',() => {
            audio.remove();
        })
    })

    socket.on('user-connected',(userId) => {
       alert('En Chat De Voz');
        connectToNewUser(userId,stream);
    })
})


const connectToNewUser = (userId,stream) => {
    const call = peer.call(userId, stream);
    const audio = document.createElement('video');


    call.on('stream', userAudioStream => {
        addAudioStream(audio, userAudioStream);
    })
}

const addAudioStream = ( audio,stream ) => {
    audio.srcObject = stream;

    audio.addEventListener('loadedmetadata',() => {
        audio.play();
    });

    myVideoGrid.appendChild(audio);
}

const muteUnmute = () => {
    const enabled = myAudioStream.getAudioTracks()[0].enabled;

    if(enabled) {
        myAudioStream.getAudioTracks()[0].enabled = false;
    }else{
        myAudioStream.getAudioTracks()[0].enabled = true;
    }
}