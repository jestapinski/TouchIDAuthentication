var shortid = require('shortid');
var User = require('../models/user');
var RNCryptor = require('jscryptor');
var rand = require("random-key");

exports.init = function(io) {

    function rng() {
        var rn = "";
        rn = rand.generate();
        return rn;
    }

    // token provided from user
    // random_number generated by random_token generator 
    function encrypt(token, random_number) {
        var encrypted = RNCryptor.Encrypt(token, random_number);
        return encrypted;
    }

    // random_number provided from server
    // hash provided from client on iOS application
    function decrypt(hash, random_number) {
        console.log("in decrypt now");
        var RNCryptor = require('jscryptor');
        var password = "16";
        var plaintext = 'taco';

        //var encrypted = RNCryptor.Decrypt(hash, random_number);
        console.log(hash)
        var decrypted = RNCryptor.Decrypt(hash, random_number);
        console.log("Able to decrypt");
        console.log(random_number)
        return decrypted
        //console.log(decrypted.toString());
    }

    function evaluate(token, decrypted) {

        var success_value = 'false';
        console.log(token);
        console.log("Decrypt below");
        console.log(decrypted);
        if (token.toString() === decrypted.toString()) {
            success_value = 'True';
        }
        else {
            success_value = 'False';
        }

        return success_value;
    }

    
    io.on('connection', function(socket){
        console.log('a user connected');

        io.sockets.emit('handShake', 'This is working');
        socket.broadcast.emit('handShake', 'Do broadcast instead');
        //console.log(clients);

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
            //console.log(user.local.email);
            User.byUser(parameter.username, function(err, rou) {
                socket.emit('init_token', rou[0].local.phone_identifier);
            });
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
                socket.emit("tryLogin", {form: "wow"});
                
            });
            socket.emit("getID","getIT");
        });

        // socket.emit('server_response_init_connect', function(key) {
        //     console.log("successfully sent key to Jordan");
        // });


        // --------------------------------------
        // --------------------------------------
        // --------- Securing Tokens ------------
        // --------------------------------------
        // --------------------------------------

        // instead of passing taco, pass a variable which will be determined with a function call that will generate rn

        socket.on("testMessage",function(data){
            console.log(data);
            io.sockets.connected["/#"+data].emit("listen", "please")
            io.to(data).emit('listen', "can this work");
        });

        socket.on("socketID",function(data){
            User.byClientToken(data.clientToken, function(err, rou) {
                rou[0].socketID = "/#"+data.socketid;
                rou[0].save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
                console.log(rou);
            });
        });

        
        socket.on('startLogin', function(string) {
            console.log(string)
            console.log("StartLogin")
            var random_number = rng();
            socket.emit('loginRN', random_number);
        });
        
        socket.on('loginHash', function(hash) {
            console.log(hash)
            //get user
            User.byUser(hash.username, function(err, rou) {
                rou[0].touchIDSession = shortid.generate();
                rou[0].save(function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
                decryption = decrypt(hash.hash, random_number);
                bool_value = evaluate(rou[0].local.phone_identifier, decryption);
                if (bool_value === "True") {
                    io.sockets.connected[rou[0].socketID].emit("tryLogin", "bool_value");
                }
                socket.emit('loginResult', bool_value);
            });

        });
    });
}