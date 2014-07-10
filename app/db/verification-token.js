var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uuid = require('node-uuid'),
    mailer = require('../controllers/mailer');

var verificationTokenSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        unique: true,
        required: true,
        default: uuid.v4
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: '24h'
    }
});

verificationTokenSchema.statics.populatedFindByToken = function(token, cb) {
    this.findOne({ token : token })
        .populate('user')
        .exec(cb);
};

verificationTokenSchema.statics.getUserByToken = function(token, cb) {
    this.populatedFindByToken(token, function(err, resultToken) {
        if (err) return cb(err);
        if (resultToken) return cb(err, resultToken.user);
        cb(err, resultToken);
    });
};

verificationTokenSchema.statics.createFor = function(user, cb) {
    var verificationToken = new verificationTokenModel({user: user._id});
    verificationToken.save(function(err, savedToken) {
        if (err) return cb(err);
        mailer.sendVerificationLink(user.email, savedToken.link,
            function(err) {
                if (err) return cb(err);
                //console.log('Verification link sent to ' + user.email + ' successfully');
                cb(err, savedToken);
            });
    });

};

verificationTokenSchema.virtual('link').get(function() {
    return process.env.URL_PROTOCOL_HOST + '/verificacion/' + this.token;
});

var verificationTokenModel = mongoose.model(
    'VerificationToken',
    verificationTokenSchema
);

module.exports = verificationTokenModel;
