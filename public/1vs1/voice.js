const videoGrid = document.getElementById('video-grid');
const myAudio = document.createElement('audio');

let myAudioStream;
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000'
});

myAudio.muted = true;

navigator.mediaDevices.getUserMedia({
    audio: true
}).then(stream => {
    myAudioStream = stream;
    addAudioStream(myAudio,stream)

    peer.on('call', call => {
        call.answer(stream);
        const audio = document.createElement('audio');

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

    socket.on('user-connected',({userId}) => {
        connectToNewUser(userId,stream);
        alert(userId)
    })
})


const connectToNewUser = (userId,stream) => {
    const call = peer.call(userId, stream);
    const audio = document.createElement('audio');
    
    let span  = document.createElement('span');
    let span2  = document.createElement('span');

    span2.innerText = 'Voz';
    span.classList.add('oponent-speaker');
    span.innerHTML = `<i class="material-icons">phone_in_talk</i>`;
    span.appendChild(span2);
    callContainer.appendChild(span);

    call.on('stream', userAudioStream => {
        addAudioStream(audio, userAudioStream);
    })
}

const addAudioStream = ( audio,stream ) => {
    audio.srcObject = stream;
    audio.addEventListener('loadedmetadata',() => {
        audio.play();
    });
}


const muteUnmute = () => {
    const enabled = myAudioStream.getAudioTracks()[0].enabled;

    if(enabled) {
        myAudioStream.getAudioTracks()[0].enabled = false;
    }else{
        myAudioStream.getAudioTracks()[0].enabled = true;
    }
}