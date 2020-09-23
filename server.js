const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const PORT = process.env.PORT || 3000;
const { v4: uuidv4 } = require('uuid');

app.use(express.static(path.join(__dirname,'public')))
server.listen(PORT, () => console.log(`Server running in port ${PORT}`));

const socket = require('socket.io');

const io = socket(server);

let ROOM_OWNERS = {};
let socket_data = '';

io.on('connection', socket => {
    socket.on('get-code', () => {
        socket.emit('code', {
            code: uuidv4()
        })
    })

    let socket_room = '';
    let socket_name = '';
    let socket_owner = '';

    socket.on('user-name', ( PLAYER_INFO ) => {
        let { name, room, creator} = PLAYER_INFO;
        switchRoom(socket,room);

        socket_room = room;
        socket_name = name;
        if(creator){
            ROOM_OWNERS[socket.id] = {name: name, room: room, socketID: socket.id};
            socket.emit( 'new-player', PLAYER_INFO );
            socket_owner = socket.id;
        } else{
            const OWNER_KEY = Object
                .keys(ROOM_OWNERS)
                .filter(key => ROOM_OWNERS[key].room === room);
            if(OWNER_KEY[0]) {
                socket.broadcast.to(OWNER_KEY[0]).emit('new-player', PLAYER_INFO);
            }

            socket_owner = OWNER_KEY[0];
        }

        console.log('New connection')
    });

    socket.on('players-info', ({ room, data}) => {
        socket_data =  data;
		io.to(room).emit('receive-players-info', data);
    })

    socket.on('circles-to-join', ({circles,name,room,color}) => {
		socket.to(room).broadcast.emit('circles-to-join', {
            circles: circles,
            name: name,
            color: color
        });
    });

    socket.on('play-again-confirmation', ({ confirmation, name}) => {
        socket.to(socket_room).emit('acept-match', name);
        
        if(socket_owner === socket.id){
            socket.emit('play-again', confirmation);
        }else{
            socket.broadcast.to(socket_owner).emit('play-again', confirmation);
        }
    })

    socket.on('reset-game', data => {
        io.to(socket_room).emit('new-game', data);
    });

    socket.on('disconnect', _ => {
        delete ROOM_OWNERS[socket.id];
        
        if(socket_data){
            socket_data.forEach((player,index) => {
                if(player.userName === socket_name) {
                    socket.broadcast.to(socket_owner).emit('remove-oponent', player.num);

                    socket_data.splice(index,1);
                    io.to(socket_room).emit('receive-players-info', socket_data);
                }
            })
        }

		io.to(socket_room).emit('oponent-disconnected', socket_name);
    })

});

function switchRoom(socket,roomName){
    socket.join(roomName);
}