
var shortid = require('shortid');
var User = require('../models/user');

exports.init = function(io) {

    var clients = 0; 

    // generating a key 
  
    io.on('connection', function(socket){
        console.log('a user connected');

        io.sockets.emit('handShake', 'This is working');
        socket.broadcast.emit('handShake', 'Do broadcast instead');
        console.log(clients);

        socket.on('lost connection', function(){
            console.log('user lost connection');
        });

        // note capitalization of both handshake functions!!
        socket.on('handShake', function(){
            console.log('Getting HandShake from iOS');
        });

        socket.on('handshake', function(){
            console.log('Getting Handshake from iOS');
            io.sockets.emit("backFromHandshake", "Some Data");
        });

        socket.on('disconnect', function(){
            console.log('user disconnected');
        });

        socket.on('login', function(data){
            console.log('Getting login attempt from iOS device', data);
        });

        socket.on('init_connect', function(paramaters){

            console.log('connect.js javascript file... nothing should print unless iOS app running and matching socked added')
            console.log('serverSocket');
            console.log(paramaters);
            console.log('Receiving params from iOS');
            //testing
            console.log(user.local.email);
            // in this function, once I receive params from iOS (iPhone id, or some token for association)
            // update the user model. post call? some function / action to do so 
            // once action is completed, begin socket.on('connect_2') to inform iOS application connection is complete.
            // also update connection page that a connection has been made to an iPhone device 
        });


        socket.on('authClient', function (data) {
            console.log(data);
            User.byClientToken(data.clientToken, function(err, rou) {
                rou[0].clientAuthToken = data.guid;
                rou[0].save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
                console.log(rou);
                socket.emit("tryLogin", {form: "wow"});
            });
        });


        socket.emit('server_response_init_connect', function(key) {
            console.log("successfully sent key to Jordan");

        });

    });
}