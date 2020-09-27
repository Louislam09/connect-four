const roomCode = document.querySelector('.room__code');
const enterCode = document.querySelector('.enter__code');
const enterName = document.querySelector('.enter__name');
const generateCode = document.querySelector('.create__room__button');
const joinRoom = document.querySelector('.join__room__button');
const joinMyRoomButton = document.querySelector('.join__button');
const howToPlayButton = document.querySelector('.tuto__room__button');

let configContianer;
let keyName = 'room-config';
let playerName;
let gameMode;
let howToPlayUrl = "https://youtu.be/zDR10wg6I9U";

const socket = io();

window.addEventListener('load', () => {
    registerSW();
});

socket.on('code', ({ code }) => {
    gameMode = getFromLocalStorage()[1];

    let roomMode = (gameMode === '1vs1') ? 'm1' : 'm2';
    let codeValue = code.split('-')[0];
    roomCode.value = codeValue.slice(0,codeValue.length - 2).concat(roomMode);
    
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
    joinMyRoomButton.style.display = 'block';
    makeConfigurationPopup();
    configContianer = document.querySelector('.game__config');

    let crearButton = configContianer.querySelector('.make');
    let nameDiv = configContianer.querySelector('.name');
    let mode1Input = configContianer.querySelector('#mode1');
    let mode2Input = configContianer.querySelector('#mode2');

    crearButton.addEventListener('click', () => {
        let name = nameDiv.value;
        let mode = ( mode2Input.checked ) ? 'game' : '1vs1';
        if(name.trim() === ''){
            alert('Es Necesario Un Nombre');
            return
        }else{
            saveInLocalStorage(name,mode);
            gameMode = getFromLocalStorage()[1];
            playerName = getFromLocalStorage()[0];
            configContianer.remove();
            socket.emit('get-code', true);
        }
    })

});

joinMyRoomButton.addEventListener('click', () => {
    let value = roomCode.value;

    if(value.trim() === "") {
        alert('Es necesario un poner un codigo')
        return;
    }
    window.open(`${gameMode}/index.html?${value}?own=true?${playerName}`,"_parent");
});

joinRoom.addEventListener('click', () => {
    let codeValue = enterCode.value;
    let name = enterName.value;

    let roomMode = (codeValue.slice(codeValue.length - 2) === 'm1') ? '1vs1' : 'game';

    if(codeValue.trim() === "" ) {
        alert('Es necesario un poner un codigo');
        return;
    }

    if(enterName.value.trim() === ""){
        alert('Es Necesario Un Nombre');
        return;
    }else{
        window.open(`${roomMode}/index.html?${codeValue}?${name}`,"_parent");
    }

});

howToPlayButton.addEventListener('click', () => {
    window.open(howToPlayUrl,'_blank');
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

function makeConfigurationPopup() {
    let div = document.createElement('div');
    div.classList.add('game__config');

    let childrem = `
        <div class="config__container">
            <div class="config__title">CONFIGURACION DE SALA</div>
            <span class="config__name__container">
                <label for="name">Nombre</label>            
                <input type="text" id='name' maxlength='8' class="name" placeholder='Escribe Tu Nombre'>
            </span>

            <span class="config__mode__container">
                <label for="mode">No. Jugadores</label>
                <div>
                    <input type="radio" id="mode1" name="mode" checked>
                    <label for="mode1" class="mode1">2</label>
                    <input type="radio" id="mode2" name="mode" >
                    <label for="mode2" class="mode2">3</label>
                </div>
            </span>

            <button class="make">Crear</button>
        </div>
    `
    div.innerHTML = childrem;

    document.querySelector('body').appendChild(div);
}

function saveInLocalStorage(name,mode){
    let data = [name, mode];
    localStorage.setItem(keyName,JSON.stringify(data));
}

function getFromLocalStorage() {
    let storagedData = JSON.parse(localStorage.getItem(keyName));

    if(storagedData === undefined){
        storagedData = getFromLocalStorage();
    }else{
        storagedData = storagedData;
    }

    return storagedData;

}

async function registerSW() {
    if ("serviceWorker" in navigator) {
        try {
            await navigator.serviceWorker.register("./sw.js");
        } catch (error) {
            console.log("ServiceWorker registration failed")
        }
    }
}