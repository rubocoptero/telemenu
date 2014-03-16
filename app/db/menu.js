var appContainer = require('../../config/dependencies/container');

appContainer.resolve(function (mongoose) {
    var Schema = mongoose.Schema;

    var menuSchema = new Schema({
        user: {
            type: Schema.ObjectId,
            ref: 'User',
            required: true
        },
        place: {
            type: Schema.ObjectId,
            ref: 'Place',
            required: true
        },
        price: {type:Number, min:0, required: true},
        sections: {
            type: [{
                name: { type: String, required: true },
                foods: {type: [String], required: true}
            }],
            required: true
        },
        available: [{
            days: {
                type: [{
                    type: String,
                    enum: [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ]
                }],
                required: true
            },
            hours: {
                type: [{
                    from: {type: Number, min: 0, max: 1440, required: true},
                    to: {type: Number, min: 0, max: 1440, required: true}
                }],
                required: true
            }
        }]
    });

    menuSchema.statics = {
        load: function (id, cb) {
            this.findOne({ _id : id}).populate('place').exec(cb);
        }
    };

    mongoose.model('Menu', menuSchema);
});

