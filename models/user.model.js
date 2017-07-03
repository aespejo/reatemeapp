var mongoose    = require('mongoose');
var bcrypt      = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    fullname:   {type:String, require:true},
    email:      {type:String, require:true},
    password:   {type:String},
    role:       {type:String, default:''},
    company:    {
                    name  : {type: String, default: ''},
                    image : {type: String, default: ''}
                },
    passwordResetToken:     {type:String, default: ''},
    passwordResetExpires:   {type:Date,   default: Date.now},
    facebook:               {type:String},
    tokens:                 Array
});

userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10, null));
}

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Users', userSchema);