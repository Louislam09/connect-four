class Circle {
	constructor(x,y,id) {
		this.id = id;
		this.span = document.createElement('span');
		this.r = 10;
		this.x = x;
		this.y = y;
		this.lineWidth = [];
		this.appendSpan();
		this.addClickEvent();
	}

	appendSpan = () => {
		this.span.x = this.x;
		this.span.y = this.y;
		this.span.style.left = `${this.x}px`;
		this.span.style.top = `${this.y}px`;
		this.span.classList.add('circle');
		this.span.style.background = `url(${currentShape}) 100%`;
		this.span.style.backgroundRepeat = `no-repeat`;
		this.span.style.backgroundSize = `cover`;
		container.appendChild(this.span);
	}

	draw = () => {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
		ctx.fill();
	};

	vibrate = () => {
		this.span.classList.add('vibrate');
		playSound(ERROR_SOUND);
		screenVibration();
		setTimeout(() => this.span.classList.remove('vibrate') ,1000);
	}

	addClickEvent = () => {
		this.span.addEventListener('click', e => {
			let isMyTurn = [...oponentsDiv].filter(player => player.firstElementChild.innerText === `Yo(${myName})`)[0];

			if(!isMyTurn.lastElementChild.classList.contains('connected')){
				makeTooltip("player",'not-turn');
				playSound(ERROR_SOUND);
				screenVibration();
				CIRCLES.forEach(circle => {
					circle.vibrate();
				})
				return;
			}

			let clickedCircle = {
				x: e.target.x,
				y: e.target.y,
				id: this.id,
				target: e.target,
				circle: this	
			}

			circlesToJoin.push(clickedCircle);

			if(circlesToJoin.length === 2){
				if(circlesToJoin.every(circle => circle.id === circlesToJoin[0].id)){
					makeTooltip("player",'choose-another');
					clickedCircle.circle.vibrate();
				}else if(circlesToJoin[0].circle.lineWidth.includes(clickedCircle.id)){
					circlesToJoin.forEach(circle => circle.circle.vibrate());
					makeTooltip("player",'already-join');
				}else{
					canBeConnect(circlesToJoin);
				}

				circlesToJoin = [];
			}
		});
			
	}

	joinWith = (patner) => {
		this.lineWidth.push(patner.id);
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

	draw = (color = randomColorFn()) => {
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
		ctx.strokeStyle = color;
		ctx.stroke();
	}

	hasLine = (c1,c2,name,color) => {
		if(this.complete === false){
			let isLine1Complete = this.line1.includes(CIRCLES[c1.circle.id]) && this.line1.includes(CIRCLES[c2.circle.id]);
			let isLine2Complete = this.line2.includes(CIRCLES[c1.circle.id]) && this.line2.includes(CIRCLES[c2.circle.id]);
			let isLine3Complete = this.line3.includes(CIRCLES[c1.circle.id]) && this.line3.includes(CIRCLES[c2.circle.id]);
			let isLine4Complete = this.line4.includes(CIRCLES[c1.circle.id]) && this.line4.includes(CIRCLES[c2.circle.id]);

			if(isLine1Complete || isLine2Complete || isLine3Complete || isLine4Complete ){
				this.lineToComplete--;
			}

			if(this.lineToComplete === 0) {
				this.complete = true;
				this.line1[0].span.setAttribute('data-i', name[0].toUpperCase());
				this.line1[0].span.classList.add('complete');
				this.draw(color);
				playSound(JOIN_SQUARE_SOUND);
		}		
		}

	}
}

const initializedCanvas = () => {
	let canv = document.createElement('canvas');
	canv.id= 'screen';
	container.appendChild(canv);

	canvas = document.getElementById('screen');
	ctx = canvas.getContext('2d');
	cw = canvas.width = 600;
	ch = canvas.height = 600;

	CIRCLES = [];
	SQUARES = [];
	currentShape = shapeNames[Math.floor(Math.random() * shapeNames.length)];

	playerBoard.childNodes.forEach((child,index) => child.innerText = `Player${index}: 0`);
}

const appendPlayerToBoard = name => {
	let span  = document.createElement('span');
	span.classList.add(name);
	span.innerText = `${name}: ${myScore}`;
	playerBoard.appendChild(span);
}

const createBoard = () => {
	container.innerHTML = '';
	myScore = 0;
	oponentOneScore = 0;
	numberOfCircle = 0;

	initializedCanvas();

	for(let i = 0; i < amountOfCircle; i++ ){
		for(let k = 0; k < amountOfCircle; k++){
			let posX = k * spaceBetweenCircle;
			let posY = i * spaceBetweenCircle;
			if(posX === 0) posX = 10;
			if(posY === 0) posY = 10;
			let circle = new Circle( posX, posY, numberOfCircle);
			circle.span.id = numberOfCircle; 
			numberOfCircle++;
			// circle.draw();
			CIRCLES.push(circle);
		}
	}



	makeSquare();
}

const connectCircle = (c1,c2,name,color) => {
	ctx.beginPath();
	ctx.moveTo(c1.x, c1.y);
	ctx.lineWidth = 5;
	ctx.lineTo(c2.x, c2.y);
	ctx.strokeStyle = color;
	ctx.stroke();
	// ctx.strokeStyle = colorArray[Math.floor(Math.random() * colorArray.length)];

	CIRCLES[c1.id].joinWith(c2);
	CIRCLES[c2.id].joinWith(c1);
	playSound(JOIN_SOUND);


	let isCompleted = false;
	let squareToCheck = SQUARES.filter(square => !square.complete);
	squareToCheck.forEach(square => {
		square.hasLine(c1,c2,name,color);
		if(square.complete){
			isCompleted = square.complete;
			setPoint(name);
			return;
		}
	})

	whoWin();

	if(!isCompleted){
		giveTurn();
	}else{
		isCompleted = false;
	}
}

const canBeConnect = (array) => {
	let [ circle1, circle2 ] = array;
	let equalPos = circle1.x === circle2.x || circle1.y === circle2.y; 
	let diffPos = Math.abs(circle1.x - circle2.x) || Math.abs(circle1.y  - circle2.y);
	let allowDist = (diffPos === spaceBetweenCircle) ? 60 : (diffPos === spaceBetweenCircle - 10) ? 50 : null; 
	
	if(equalPos && diffPos === allowDist) {
		socket.emit('circles-to-join',{
			circles: array,
			name: myName,
			room: roomCode,
			color: myColor
		});

		connectCircle(circle1,circle2,myName,myColor);
		array.forEach(({ target }) => target.classList.add('has-line'));
	}else{
		makeTooltip('player','invalid-move')
	}
}

for (let i = 0; i < amountOfCircle -1; i++){
	length = length + amountOfCircle;
	lastColumn.push(length);
}

const makeSquare = () => {
	let amountOfSquare = (amountOfCircle*amountOfCircle) - amountOfCircle;
	for (let i = 0; i < amountOfSquare; i++) {
		// const lastColumn = [10,21,32,43,54,65,76,87,98,109,120];

		if(lastColumn.includes(i)) continue;
		let c1 = i;		
		let c2 = c1 + 1;		
		let c3 = c2 + amountOfCircle;		
		let c4 = c3 - 1;
		
		let square = new Square(CIRCLES[c1],CIRCLES[c2],CIRCLES[c3],CIRCLES[c4],i);
		square.draw();
		SQUARES.push(square);
	}
}

const giveTurn = (firstCall = false) => {
	if(firstCall){
		takeTurn = [null,null]; 
	}

	if(INCOMPLETE){
		oponentsDiv[0].lastElementChild.classList.remove('connected');
		oponentsDiv[1].lastElementChild.classList.remove('connected');
		oponentsDiv[0].lastElementChild.classList.remove('blink');
		oponentsDiv[1].lastElementChild.classList.remove('blink');
		
		for (const i in takeTurn) {
			if(takeTurn[i] === null){
				takeTurn[i] = true;
				oponentsDiv[i].lastElementChild.classList.add('connected');
				oponentsDiv[i].lastElementChild.classList.add('blink');
				break;
			}
		}
		takeTurn.every(turn => turn) ? takeTurn = [null,null] : null;
	}
}

const setPoint = (name,first = false) => {
	if(name === myName){
		myScore++;
	}else if(name === oponentOneName){
		oponentOneScore++;
	}

	if(first){
		myScore = 0;
		oponentOneName = 0;
	}

	for (let i = 0; i < playerBoard.childNodes.length; i++) {
		if(playerBoard.childNodes[i].classList.contains(myName)) playerBoard.childNodes[i].innerText = `${myName}: ${myScore}`;
		if(playerBoard.childNodes[i].classList.contains(oponentOneName)) playerBoard.childNodes[i].innerText = `${oponentOneName}: ${oponentOneScore}`;
	}
}

const whoWin = () => {
	if(SQUARES.every(square => square.complete)){
		let playerAndScore = [];
		playerAndScore.push({name: myName,score: myScore});
		playerAndScore.push({name: oponentOneName,score: oponentOneScore});
	
		let compareWith = 0;

		playerAndScore.forEach(player => {
			compareWith = (player.score > compareWith) ? player.score : compareWith;
		})

		if(myScore === oponentOneScore){
			makeTooltip(myName,'draw','winner');
			return;
		}

		if(myScore === compareWith) makeTooltip(myName,'winner','winner');
		if(oponentOneScore === compareWith) makeTooltip(oponentOneName,'winner','winner');
	}
}

const resetGame = () => {
	socket.emit('play-again', {
		data: true
	})
}

function makeTooltip(name, param, className = 'tooltip') {
	let body = document.querySelector('body');
	
	if(body.lastElementChild.classList.contains('tip')){
		body.lastElementChild.remove();
	}

    let span = document.createElement('span');
	span.classList.add('tip');
	span.classList.add(className);
    
	if(param === 'connect') span.innerText = `${name} Se Ha Unido`;
	if(param === 'disconnect') span.innerText = `${name} Se Ha Desconectado`;
	if(param === 'not-turn') span.innerText = `No Es Tu Turno`;
	if(param === 'choose-another') span.innerText = `Seleccionar otro`;
	if(param === 'invalid-move') span.innerText = `Movimiento Invalido`;
	if(param === 'already-join') span.innerText = `Estos Ya Estan Unido`;
	if(param === 'winner') span.innerText = `🎉${name} Ha Ganado!🎉`;
	if(param === 'dare') span.innerText = `🔥${name} Quiere Jugar De Nuevo!🔥`;
	if(param === 'draw') span.innerText = `😱Hay Un Empate😱`;
	if(param === 'wait-host') span.innerText = `😎Esperando Jugadores...😎`;
	if(param === 'room-full') span.innerText = `😅${name} Esta Sala Esta Llena!😅`;
	if(param === 'call') span.innerText = `📞En Chat De Voz 📞`;
	if(param === 'oponent-left') span.innerText = `🎉${name} Ha Ganado!🎉\n Tu Oponente Dejo La Partida 😅`;
	
    document.querySelector('body').appendChild(span);

	let timeout = (className === 'winner') ? 3000 : 1000;
	if(param === 'dare') timeout = 3000;
	if(param === 'wait-host') timeout = 5000;
	if(param === 'room-full') timeout = 15000;
	if(param === 'oponent-left') timeout = 3000;
	if(className === 'winner') playSound(WINNER_SOUND,0.5);

    setTimeout(() => {
		span.remove();
		if(className === 'winner') playAgainIcon();
		if(param === 'oponent-left') window.open(window.location.origin,"_parent");
    },timeout);
}

const playAgainIcon = () => {
	let icon = document.createElement('div');
	icon.classList.add('play-again-icon');
	icon.innerHTML = `
			<span>PLAY AGAIN </span>
			<i class="material-icons">home</i>
		`;
	document.querySelector('body').appendChild(icon);


	let playAgain = icon.querySelector('span');
	playAgain.addEventListener('click', () => {
		socket.emit('play-again-confirmation', {
			confirmation: true,
			name: myName
		});

		icon.remove();
		makeTooltip(myName,'wait-host');
	});
	
	let homeButton = icon.querySelector('i');
	homeButton.addEventListener('click', () => {
		window.open(window.location.origin,'_parent');
	});

}

const playSound = (sound,volume = 1) => {
	JOIN_SOUND.volume = 0;
	ERROR_SOUND.volume = 0;
	JOIN_SQUARE_SOUND.volume = 0;
	WINNER_SOUND.volume = 0;

	sound.currentTime = 0;
	sound.volume = volume;
	sound.play();
}

const playBackgroundMusic = () => {
	BG_SOUND_1.currentTime = 0;
	BG_SOUND_1.volume = 0.6;
	BG_SOUND_1.loop = true;
	BG_SOUND_1.play();
}

const pauseBackgroundMusic = () => {
	BG_SOUND_1.pause();
}

const screenVibration = () => {
	if(navigator){
        navigator.vibrate([1000,200])
    }
}

volumeIcon.addEventListener('click', e => { 
	let target = e.target;
	if(target.innerText === 'volume_up'){
		target.innerText = 'volume_off';
		target.classList.add('unmute');
		pauseBackgroundMusic();
	}else{
		target.innerText = 'volume_up';
		target.classList.remove('unmute');
		playBackgroundMusic();
	}
})

myMic.addEventListener('click', e => { 
	let target = e.target;
	if(target.innerText === 'mic'){
		target.innerText = 'mic_off';
		target.classList.add('unmute');
		myMicSpan.innerText = 'Activar';
	}else{
		target.classList.remove('unmute');
		target.innerText = 'mic';
		myMicSpan.innerText = 'Mute';
	}
	muteUnmute();
})

container.addEventListener('click',() => {
	playBackgroundMusic() 
},{ once: true });

createBoard();

let data = {
	name: myName,
	room: roomCode,
	creator: (myRoom === 'onwer-y') ? true : false
}

peer.on('open', (id) => {
    // socket.emit('join-call', {
    //     userId: id,
    //     room: roomCode
	// });

	data['userId'] = id;
	
	socket.emit('user-name', data);
});

// ================================================================================================================================
// ================================================================================================================================
// ================================================================================================================================

let playerIndex = -1;
let playerName = '';

socket.on('new-player', (PLAYER_INFO) => {
	let { name, room } = PLAYER_INFO;
	let ROOM_FULL = connections.every(connection => connection !== null);
	
	if(!ROOM_FULL) {
		makeTooltip(name,'connect');
		for(const i in connections){
			if(connections[i] === null){
				playerIndex = i;
				playerName = name;
				connections[i] = i;
				break
			}
		}
	
		// If there is a player 3, ignore it.
		if(playerIndex === -1) return;
		
		room1.push({ userName: name , num: playerIndex });
	
		socket.emit('players-info', {
			room: room,
			data: [...room1]
		});
	}
	
});

socket.on('receive-players-info', data => {
	playerBoard.innerHTML = '';
	room1 = data;
	if(data){

		data.forEach((player,index) => {
			if(index >= 3) return;
			
			appendPlayerToBoard(player.userName);
		});

		playerNumber = data.filter(player => player.userName === myName)[0].num;

		let oponents = data.filter(player => player.userName !== myName);
		oponentsDiv[0].firstElementChild.classList.add('connected');
		oponentsDiv[0].firstElementChild.innerText = `Yo(${myName})`;

		data.forEach((player,index) => {
			if(player.userName === myName){
				oponentsDiv[index].firstElementChild.innerText = `Yo(${player.userName})`;
				myNumber = index;
				oponentOneNumber = 1;
			}else{
				oponentsDiv[index].firstElementChild.innerText = player.userName;
			}

			oponentsDiv[index].firstElementChild.classList.add('connected');
			if(index === 1) giveTurn(true);
		});
	
		if(oponents.length === 0){
			oponentOneName = null;
		}else if(oponents.length === 1){
			oponentOneName = oponents[0].userName;
		} 
	}
});

socket.on( 'circles-to-join' , data => {
	let { circles, name, color } = data;
	let [ circle1, circle2 ] = circles;

	connectCircle(circle1, circle2, name,color);
	circles.forEach((circle) => CIRCLES[circle.circle.id].span.classList.add('has-line'));
});

socket.on('oponent-disconnected', (name) => {
	makeTooltip(name,'disconnect');
	setTimeout(() => {
		// makeTooltip(myName,'oponent-left','winner');
	},3000);
	if(callContainer.querySelector('.oponent-speaker')) callContainer.querySelector('.oponent-speaker').remove();

});

socket.on('acept-match', (name) => makeTooltip(name,'dare'));

socket.on('remove-oponent', data => {
	connections[parseInt(data)] = null;
	// if(callContainer.querySelector('.oponent-speaker')) callContainer.querySelector('.oponent-speaker').remove();
})

socket.on('play-again', data => {
	if(myRoom === "onwer-y"){
		for(const i in playAgainConfirmations){
			if(playAgainConfirmations[i] === null){
				playAgainConfirmations[i] = true;
				break
			}
		}
		
		if(playAgainConfirmations.every(res => res === true)){
			socket.emit('reset-game', 'hola');
	
			playAgainConfirmations = [null, null];
		}
	}
});

socket.on('new-game', data => {
	createBoard()
});

socket.on('my-socket', data => {
	let ROOM_FULL = connections.every(connection => connection !== null);
	if(ROOM_FULL) socket.emit('room-full', data)
});

socket.on('room-full',data => {
		makeTooltip(myName,'room-full');
});