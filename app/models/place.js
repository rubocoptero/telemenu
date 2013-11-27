var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('underscore');

var placeSchema = new Schema({
    user: {type: Schema.ObjectId, ref: 'User'},
    name: { type: String, required: true },
    address: {
        str: {type: String, required: true },
        lat: {type: Number, required: true },
        lng: {type: Number, required: true }
    },
    description: String,
    photo: String,
    telephone: { type: String, required: true },
    reservations_constrains: {
        capacity: {
            type: String,
            min: 1,
            required: true
        },
        time_per_person: { type: Number, required: true },
        opening_hours: [{
            days: [{
                type: String,
                enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ],
            }],
            hours: [{
                from: {type: Number, min: 0, max: 86400, required: true},
                to: {type: Number, min: 0, max: 86400, required: true}
            }]
        }]
    },
    feedback: {type: Schema.ObjectId, ref: 'Feedback'}
});

placeSchema.statics = {
    load: function (id, cb) {
        this.findOne({ _id : id })
        .populate('feedback')
        .populate('user')
        .exec(cb);
    }
};


mongoose.model('Place', placeSchema);
