var appContainer = require('../../config/dependencies/container');

appContainer.resolve(function (mongoose) {
   var Schema = mongoose.Schema;

    var menuSchema = new Schema({
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        place: {
            type: Schema.ObjectId,
            ref: 'Place'
        },
        price: {type:Number, min:0},
        sections: [{
            name: String,
            foods: [String]
        }],
        available: [{
            days: [{
                type: String,
                enum: [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ],
            }],
            hours: [{
                from: {type: Number, min: 0, max: 1440, required: true},
                to: {type: Number, min: 0, max: 1440, required: true}
            }]
        }]
    });

    menuSchema.statics = {
        load: function (id, cb) {
            this.findOne({ _id : id}).populate('place').exec(cb);
        }
    };

    mongoose.model('Menu', menuSchema);
});

