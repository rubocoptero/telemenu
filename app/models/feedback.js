var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('underscore');

var feedbackSchema = new Schema({
    average: Number,
    opinions: [{
        score: {
            type: Number,
            min: 0,
            max: 5
        },
        body: String
    }]
});

mongoose.model('Feedback', feedbackSchema);
