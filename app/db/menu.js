var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('underscore');

var menuSchema = new Schema({
    user: {type: Schema.ObjectId, ref: 'User'},
    menus: [{
        days: [Date],
        price: {type:Number, min:0},
        sections: [{
            name: String,
            foods: [String]
        }]
    }],
    foods_history: [String]
});

menuSchema.statics = {
    load: function (id, cb) {
        this.findOne({ _id : id}).populate('user').exec(cb);
    }
};

mongoose.model('Menu', menuSchema);
