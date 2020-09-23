let canvas = document.getElementById('screen');
let ctx = canvas.getContext('2d');

const cw = canvas.width = 600;
const ch = canvas.height = 600;
const spaceBetweenCircle = 60;
const amountOfCircle = 11;
let tempClickedCircle = '';
let numberOfCircle = 0;
// const name = prompt('Escribe tu Nombre: ')
const name = 'luis';

const circles = [];
const squares = [];
let circlesToJoin = [];

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

// ctx.fillStyle = colorArray[Math.floor(Math.random() * colorArray.length)];
// ctx.strokeStyle = colorArray[Math.floor(Math.random() * colorArray.length)];

function randomIntFromInterval(minim, maxim) {
	return ~~(Math.random() * (maxim - minim + 1) + minim);
}

const randomColorFn = () => `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`
let randomColor = randomColorFn();

class Circle {
	constructor(x,y) {
		this.span = document.createElement('span');
		this.r = 10;
		this.x = x;
		this.y = y;
		this.appendSpan();
		this.addClickEvent();
	}

	appendSpan = () => {
		this.span.x = this.x;
		this.span.y = this.y;
		this.span.style.left = `${this.x}px`;
		this.span.style.top = `${this.y}px`;
		this.span.classList.add('circle');
		document.querySelector('.container').appendChild(this.span);
	}

	draw = () => {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
		ctx.fill();
	};

	addClickEvent = () => {
		this.span.addEventListener('click', e => {
			let clickedCircle = {
				x: e.target.x,
				y: e.target.y,
				target: e.target,
				circle: this	
			}

			// avoid to click the same twice
			if(circlesToJoin[0]) {
				if(circlesToJoin[0].target === clickedCircle.target) {
					clickedCircle.target.classList.add('vibrate');
					setTimeout(()=>{
						clickedCircle.target.classList.remove('vibrate');
					},1000)
					return
				}
			}
			
			circlesToJoin.push(clickedCircle);
	
			if(circlesToJoin.length === 2){
				canBeConnect(circlesToJoin);
				circlesToJoin = [];
			}

		});
	}
}

class Square {
	constructor(c1,c2,c3,c4,number){
		this.number = number;
		this.line1 = [c1,c2];
		this.line2 = [c2,c3];
		this.line3 = [c3,c4];
		this.line4 = [c4,c1];
		this.lineToComplete = 4;
		this.complete = false;
	}

	draw = () => {
		ctx.beginPath();
		ctx.lineWidth = 5;
		// line1
		ctx.moveTo(this.line1[0].x, this.line1[0].y);
		ctx.lineTo(this.line1[1].x, this.line1[1].y);
		// line2
		ctx.moveTo(this.line2[0].x, this.line2[0].y);
		ctx.lineTo(this.line2[1].x, this.line2[1].y);
		// line3
		ctx.moveTo(this.line3[0].x, this.line3[0].y);
		ctx.lineTo(this.line3[1].x, this.line3[1].y);
		// line4
		ctx.moveTo(this.line4[0].x, this.line4[0].y);
		ctx.lineTo(this.line4[1].x, this.line4[1].y);
		ctx.strokeStyle = randomColorFn();
		ctx.stroke();
	}

	hasLine = (c1,c2) => {
		if(this.complete === false){
			let isLine1Complete = this.line1.includes(c1.circle) && this.line1.includes(c2.circle);
			let isLine2Complete = this.line2.includes(c1.circle) && this.line2.includes(c2.circle);
			let isLine3Complete = this.line3.includes(c1.circle) && this.line3.includes(c2.circle);
			let isLine4Complete = this.line4.includes(c1.circle) && this.line4.includes(c2.circle);

			if(isLine1Complete || isLine2Complete || isLine3Complete || isLine4Complete ){
				this.lineToComplete--;
			}

			if(this.lineToComplete === 0) {
				this.complete = true;
				this.line1[0].span.setAttribute('data-i',name[0].toUpperCase());
				this.line1[0].span.classList.add('complete');
				this.draw();
			}		
		}

	}
}

const createBoard = () => {
	for(let i = 0; i < amountOfCircle; i++ ){
		for(let k = 0; k < amountOfCircle; k++){
			let posX = k * spaceBetweenCircle;
			let posY = i * spaceBetweenCircle;
			if(posX === 0) posX = 10;
			if(posY === 0) posY = 10;
			let circle = new Circle( posX, posY);
			circle.span.id = numberOfCircle; 
			numberOfCircle++;
			// circle.draw();
			CIRCLES.push(circle);
		}
	}
}

const connectCircle = (c1,c2) => {
	ctx.beginPath();
	ctx.moveTo(c1.x, c1.y);
	ctx.lineWidth = 5;
	ctx.lineTo(c2.x, c2.y);
	ctx.stroke();
	ctx.strokeStyle = colorArray[Math.floor(Math.random() * colorArray.length)];

	SQUARES.forEach(square => {
		square.hasLine(c1,c2);
	})
}

const canBeConnect =(array) => {
	let [ circle1, circle2 ] = array;
	let equalPos = circle1.x === circle2.x || circle1.y === circle2.y; 
	let diffPos = Math.abs(circle1.x - circle2.x) || Math.abs(circle1.y  - circle2.y);
	let allowDist = (diffPos === spaceBetweenCircle) ? 60 : (diffPos === spaceBetweenCircle - 10) ? 50 : null; 
	
	if(equalPos && diffPos === allowDist) {
		connectCircle(circle1,circle2);
		// array.forEach(({ target }) => target.style.background = randomColor);
		array.forEach(({ target }) => target.classList.add('has-line'));
	}
}

const makeSquare = () => {
	for (let i = 0; i < 110; i++) {
		const lastColumn = [10,21,32,43,54,65,76,87,98,109,120];

		if(lastColumn.includes(i)) continue;
		let c1 = i;		
		let c2 = c1+1;		
		let c3 = c2+11;		
		let c4 = c3-1;
		
		let square = new Square(CIRCLES[c1],CIRCLES[c2],CIRCLES[c3],CIRCLES[c4],i);
		// square.draw();
		SQUARES.push(square);
	}
}

createBoard();
makeSquare()


// =============================================================================================
// temp 2

let canvas = document.getElementById('screen');
let ctx = canvas.getContext('2d');

// const socket = io('http://192.168.43.180:3000/');
const socket = io();

const container = document.querySelector(".container");
const infoBoard = document.querySelector(".info-board");
const oponentsDiv = infoBoard.querySelectorAll('.oponent');
const playerBoard = document.querySelector('.score-board');
const meDiv = playerBoard.querySelector('.me');


const cw = canvas.width = 600;
const ch = canvas.height = 600;
const spaceBetweenCircle = 60;
const amountOfCircle = 11;
let tempClickedCircle = '';
let numberOfCircle = 0;

let myName = prompt('Escribe tu Nombre: '),
myScore = 0,
myNumber = -1;
 
 let oponentOne = '',
 oponentOneScore = 0,
 oponentOneNumber = -1;
 
 let oponentTwo = '',
 oponentTwoScore = 0,
 oponentTwoNumber = -1;
 
const circles = [];
const squares = [];
let circlesToJoin = [];
let takeTurn = [null, null,null];

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


const randomColorFn = () => `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`
let randomColor = randomColorFn();

class Circle {
	constructor(x,y,id) {
		this.id = id;
		this.span = document.createElement('span');
		this.r = 10;
		this.x = x;
		this.y = y;
		this.appendSpan();
		this.addClickEvent();
	}

	appendSpan = () => {
		this.span.x = this.x;
		this.span.y = this.y;
		this.span.style.left = `${this.x}px`;
		this.span.style.top = `${this.y}px`;
		this.span.classList.add('circle');
		document.querySelector('.container').appendChild(this.span);
	}

	draw = () => {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
		ctx.fill();
	};

	addClickEvent = () => {
		this.span.addEventListener('click', e => {
			let clickedCircle = {
				x: e.target.x,
				y: e.target.y,
				target: e.target,
				circle: this	
			}

			// avoid to click the same twice
			if(circlesToJoin[0]) {
				if(circlesToJoin[0].target === clickedCircle.target) {
					clickedCircle.target.classList.add('vibrate');
					setTimeout(()=>{
						clickedCircle.target.classList.remove('vibrate');
					},1000)
					return
				}
			}
			
			circlesToJoin.push(clickedCircle);
	
			if(circlesToJoin.length === 2){
			

				canBeConnect(circlesToJoin);
				circlesToJoin = [];
			}

		});
	}
}

class Square {
	constructor(c1,c2,c3,c4,number){
		this.number = number;
		this.line1 = [c1,c2];
		this.line2 = [c2,c3];
		this.line3 = [c3,c4];
		this.line4 = [c4,c1];
		this.lineToComplete = 4;
		this.complete = false;
	}

	draw = () => {
		ctx.beginPath();
		ctx.lineWidth = 5;
		// line1
		ctx.moveTo(this.line1[0].x, this.line1[0].y);
		ctx.lineTo(this.line1[1].x, this.line1[1].y);
		// line2
		ctx.moveTo(this.line2[0].x, this.line2[0].y);
		ctx.lineTo(this.line2[1].x, this.line2[1].y);
		// line3
		ctx.moveTo(this.line3[0].x, this.line3[0].y);
		ctx.lineTo(this.line3[1].x, this.line3[1].y);
		// line4
		ctx.moveTo(this.line4[0].x, this.line4[0].y);
		ctx.lineTo(this.line4[1].x, this.line4[1].y);
		ctx.strokeStyle = randomColorFn();
		ctx.stroke();
	}

	hasLine = (c1,c2) => {
		if(this.complete === false){
			let isLine1Complete = this.line1.includes(c1.circle) && this.line1.includes(c2.circle);
			let isLine2Complete = this.line2.includes(c1.circle) && this.line2.includes(c2.circle);
			let isLine3Complete = this.line3.includes(c1.circle) && this.line3.includes(c2.circle);
			let isLine4Complete = this.line4.includes(c1.circle) && this.line4.includes(c2.circle);

			if(isLine1Complete || isLine2Complete || isLine3Complete || isLine4Complete ){
				this.lineToComplete--;
			}

			if(this.lineToComplete === 0) {
				this.complete = true;
				this.line1[0].span.setAttribute('data-i',myName[0].toUpperCase());
				this.line1[0].span.classList.add('complete');
				this.draw();
			}	
		}

	}
}

const appendPlayerToBoard = name => {
	let span  = document.createElement('span');
	span.classList.add('me');
	span.innerText = `${name}: ${myScore}`;
	playerBoard.appendChild(span);
}

const createBoard = () => {
	for(let i = 0; i < amountOfCircle; i++ ){
		for(let k = 0; k < amountOfCircle; k++){
			let posX = k * spaceBetweenCircle;
			let posY = i * spaceBetweenCircle;
			if(posX === 0) posX = 10;
			if(posY === 0) posY = 10;
			let circle = new Circle( posX, posY,numberOfCircle);
			circle.span.id = numberOfCircle; 
			numberOfCircle++;
			// circle.draw();
			CIRCLES.push(circle);
		}
	}

}

const connectCircle = (c1,c2) => {
	ctx.beginPath();
	ctx.moveTo(c1.x, c1.y);
	ctx.lineWidth = 5;
	ctx.lineTo(c2.x, c2.y);
	ctx.stroke();
	// ctx.strokeStyle = colorArray[Math.floor(Math.random() * colorArray.length)];
	ctx.strokeStyle = 'red';

	
	SQUARES.forEach(square => {
		square.hasLine(c1,c2);
		
	})

}

const canBeConnect = (array) => {
	let [ circle1, circle2 ] = array;
	let equalPos = circle1.x === circle2.x || circle1.y === circle2.y; 
	let diffPos = Math.abs(circle1.x - circle2.x) || Math.abs(circle1.y  - circle2.y);
	let allowDist = (diffPos === spaceBetweenCircle) ? 60 : (diffPos === spaceBetweenCircle - 10) ? 50 : null; 
	
	if(equalPos && diffPos === allowDist) {
		socket.emit('circles-to-join',{
			circle1: circle1.id,
			circle2: circle2.id
		})

		connectCircle(circle1,circle2);
		array.forEach(({ target }) => target.classList.add('has-line'));

	}
}

const makeSquare = () => {
	for (let i = 0; i < 110; i++) {
		const lastColumn = [10,21,32,43,54,65,76,87,98,109,120];

		if(lastColumn.includes(i)) continue;
		let c1 = i;		
		let c2 = c1+1;		
		let c3 = c2+11;		
		let c4 = c3-1;
		
		let square = new Square(CIRCLES[c1],CIRCLES[c2],CIRCLES[c3],CIRCLES[c4],i);
		// square.draw();
		SQUARES.push(square);
	}
}

const giveTurn = () => {
	oponentsDiv[0].lastElementChild.classList.remove('connected');
	oponentsDiv[1].lastElementChild.classList.remove('connected');
	oponentsDiv[2].lastElementChild.classList.remove('connected');
	for (const i in takeTurn) {
		if(takeTurn[i] === null){
			takeTurn[i] = true;
			oponentsDiv[i].lastElementChild.classList.add('connected');
			break;
		}
	}
	takeTurn.every(turn => turn) ? takeTurn = [null,null,null] : null;
}


createBoard();
makeSquare()

socket.emit('user-name', myName);

socket.on('oponent-connected', ({playerNumber}) => {
				
})			

socket.on('players-info', data => {
	playerBoard.innerHTML = '';
	if(data){
		data.forEach(player => {
			appendPlayerToBoard(player.userName);
		})
		playerNumber = data.filter(player => player.userName === myName)[0].num;

		let oponents = data.filter(player => player.userName !== myName);
		oponentsDiv[0].firstElementChild.classList.add('connected');
		oponentsDiv[0].firstElementChild.innerText = `Yo(${myName})`;

		data.forEach((player,index) => {
			if(player.userName === myName){
				oponentsDiv[index].firstElementChild.innerText = `Yo(${player.userName})`;
			}else{
				oponentsDiv[index].firstElementChild.innerText = player.userName;
			}
			oponentsDiv[index].firstElementChild.classList.add('connected');
			if(index === 2) giveTurn();
		})
	
		// if(oponents.length === 0){
		// 	oponentOne = null;
		// 	oponentTwo = null;
		// 	oponentsDiv[1].firstElementChild.classList.toggle('connected',false);
		// 	oponentsDiv[2].firstElementChild.classList.toggle('connected',false);
		// }else if(oponents.length === 1){
		// 	oponentOne = oponents[0].userName;
		// 	oponentTwo = null;

		// 	oponentsDiv[1].firstElementChild.innerText = oponentOne;
			
		// 	oponentsDiv[1].firstElementChild.classList.add('connected');
		// 	oponentsDiv[2].firstElementChild.classList.toggle('connected',false);
		// } else if(oponents.length === 2){
		// 	oponentOne = oponents[0].userName;
		// 	oponentTwo = oponents[1].userName;

		// 	oponentsDiv[1].firstElementChild.innerText = oponentOne;
		// 	oponentsDiv[2].firstElementChild.innerText = oponentTwo;

		// 	oponentsDiv[1].firstElementChild.classList.add('connected');
		// 	oponentsDiv[2].firstElementChild.classList.add('connected');
		// }

	}


})

socket.on('circles-to-join', data => {
	let [ circle1, circle2 ] = data;

	connectCircle(CIRCLES[circle1],CIRCLES[circle2]);
	data.forEach((circle) => CIRCLES[circle].span.classList.add('has-line'));
})


