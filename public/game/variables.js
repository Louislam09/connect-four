let canvas;
let ctx;
let cw;
let ch;

let soundSource = [
	'audio/bg_sound2.mp3',
	'audio/bg_sound1.mp3'
];

let JOIN_SOUND = new Audio('audio/join_sound.ogg');
let ERROR_SOUND = new Audio('audio/error_sound.mp3');
let JOIN_SQUARE_SOUND = new Audio('audio/join_square_sound.mp3');
let WINNER_SOUND = new Audio('audio/winner_sound.mp3');


// import sounds
let BG_SOUND_1 = new Audio();
BG_SOUND_1.src = soundSource[Math.floor(Math.random() * soundSource.length)];

const socket = io();

const container = document.querySelector(".container");
const volumenContainer = document.querySelector(".volume-icon");
const volumeIcon = volumenContainer.querySelector('i');
const infoBoard = document.querySelector(".info-board");
const oponentsDiv = infoBoard.querySelectorAll('.oponent');
const playerBoard = document.querySelector('.score-board');
const meDiv = playerBoard.querySelector('.me');

const spaceBetweenCircle = 60;
const amountOfCircle = 11;
let numberOfCircle = 0;

let windowURL = window.location.search.split('?');
const roomCode = windowURL[1];

let myName,
myScore = 0,
myNumber = -1;
let firstLoad = true;

if(windowURL.length > 2){
	myName = windowURL[2]
	if(windowURL[2] === "own=true") myName = prompt('Escribe tu Nombre: ');
	// if(windowURL[2] === "own=true") myName = String(Math.random().toFixed(3));
}else{
	myName = prompt('Escribe tu Nombre: ');
}


let oponentOneName = '',
oponentOneScore = 0,
oponentOneNumber = -1;

let oponentTwoName = '',
oponentTwoScore = 0,
oponentTwoNumber = -1;
 
let length = amountOfCircle - 1;
let lastColumn = [length];

let CIRCLES = [];
let SQUARES = [];
let circlesToJoin = [];
let takeTurn = [null, null,null];
let INCOMPLETE = true;

const colorArray = [
	'#BF214B',
	'#C1D0D9',
	'#0E6973',
	'#0E7373',
	'#547C8C',
	'#6FB7BF',
	'#D96704',
	'#D9A679',
	'#8C4C46'
];

const randomColorFn = (opacity = true) => {
	if(opacity){
		return (
			`
				rgba(${Math.floor(Math.random() * 255)},
				${Math.floor(Math.random() * 255)},
				${Math.floor(Math.random() * 255)},
				.1)
			`
		)
	}else{
		return(
			`
				rgb(${Math.floor(Math.random() * 255)},
				${Math.floor(Math.random() * 255)},
				${Math.floor(Math.random() * 255)}
			`
		)
	}
	
}

let randomColor = randomColorFn();
let myColor = randomColorFn(false);

const connections = [null, null, null];
let playAgainConfirmations = [null, null, null];
let room1 = [];

let myRoom = window.location.search.split('?')[2];
myRoom = (myRoom === "own=true") ? "onwer-y" : "onwer-n"; 

