var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    _ = require('underscore'),
    authTypes = ['github', 'twitter', 'facebook', 'google'];

var userSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    provider: String,
    hashed_password: String,
    salt: String,
    facebook: {},
    twitter: {},
    github: {},
    google: {},
    verified: {
        type: Boolean,
        default: false
    },
    feedback: {type: Schema.ObjectId, ref: 'Feedback'}
});

/**
 * Statics
 */

userSchema.statics = {
    load: function (id, cb) {
        this.findOne({ _id : id })
        .populate('feedback')
        .exec(cb);
    }
};

/**
 * Virtuals
 */
userSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
}).get(function() {
    return this._password;
});

/**
 * Validations
 */
var validatePresenceOf = function(value) {
    return value && value.length;
};

// the below 4 validations only apply if you are signing up traditionally
userSchema.path('name').validate(function(name) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return name.length;
}, 'Nombre no puede estar vacío.');

userSchema.path('email').validate(function(email) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
}, 'Email no puede estar vacío.');

userSchema.path('username').validate(function(username) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return username.length;
}, 'Username no puede estar vacío.');

userSchema.path('hashed_password').validate(function(hashed_password) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashed_password.length;
}, 'Password no puede estar vacío.');


/**
 * Pre-save hook
 */
userSchema.pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1)
        next(new Error('Invalid password'));
    else
        next();
});

/**
 * Methods
 */
userSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function(password) {
        if (!password) return '';
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    }
};

mongoose.model('User', userSchema);
