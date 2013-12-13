var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uuid = require('node-uuid');

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

var verificationTokenModel = mongoose.model(
    'VerificationToken',
    verificationTokenSchema
);
exports.verificationTokenModel = verificationTokenModel;
