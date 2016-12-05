//models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email       	 	: String,
        password     		: String, 
        phone_identifier	: String
    },
    waitingToBeAuthenticated: Boolean,
    clientAuthToken: String,
    serverToClientToken: String,
    lastSaltSentToken: String
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


userSchema.statics.byUser = function(email, cb) {
    return this.find({ 'local.email': email}, 'id waitingToBeAuthenticated serverToClientToken', cb);
};

// userSchema.statics.clearTokens = function(email, cb) {
//     this.findOneAndUpdate({ 'local.email': email})
//     return this.find({ 'local.email': email}, 'id waitingToBeAuthenticated', cb);
// };


// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);