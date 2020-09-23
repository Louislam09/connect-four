const roomCode = document.querySelector('.room__code');
const enterCode = document.querySelector('.enter__code');
const enterName = document.querySelector('.enter__name');
const generateCode = document.querySelector('.create__room__button');
const joinRoom = document.querySelector('.join__room__button');
const joinMyRoomButton = document.querySelector('.join__button');

const socket = io();

socket.on('code', ({ code }) =>{
    console.log(code);
    roomCode.value = code.split('-')[0];
    if(roomCode.value){
        roomCode.removeAttribute('disabled');
    }
});

roomCode.addEventListener('click', () => {
    var copyText = document.getElementById("myInput");
    roomCode.select();
    roomCode.setSelectionRange(0, 99999);
    document.execCommand("copy");
    makeTooltip()
});

generateCode.addEventListener('click',() => {
    socket.emit('get-code', true);
    joinMyRoomButton.style.display = 'block';
});

joinMyRoomButton.addEventListener('click', () => {
    let value = roomCode.value;

    if(value.trim() === "") {
        alert('Es necesario un poner un codigo')
        return;
    }
    window.open(`game/index.html?${value}?own=true`,"_parent");
});

joinRoom.addEventListener('click', () => {
    let value = enterCode.value;
    let name = enterName.value;

    if(value.trim() === "" ) {
        alert('Es necesario un poner un codigo');
        return;
    }

    if(enterName.value.trim() === ""){
        alert('Es Necesario Un Nombre');
        return;
    }else{
        window.open(`game/index.html?${value}?${name}`,"_parent");
    }

});

function makeTooltip() {
    let span = document.createElement('span');
    span.classList.add('tooltip');
    span.innerText = "Copy to clipboard";
    document.querySelector('body').appendChild(span);

    setTimeout(() => {
        span.remove();
    },5000)
}