var appContainer = require('../../config/dependencies/container');

appContainer.resolve(function (mongoose, mongooseAttachments, uploadPath) {
    var placeSchema = new mongoose.Schema({
        user: {type: mongoose.Schema.ObjectId, ref: 'User'},
        name: { type: String, required: true },
        address: {
            str: {type: String, required: true },
            lat: {type: Number, required: true },
            lng: {type: Number, required: true }
        },
        description: String,
        telephone: { type: String, required: true },
        reservations_constrains: {
            capacity: {
                type: Number,
                min: 1,
                required: true
            },
            minutes_per_customer: { type: Number, required: true }
        },
        feedback: {type: mongoose.Schema.ObjectId, ref: 'Feedback'}
    });

    placeSchema.plugin(mongooseAttachments, {
        directory: uploadPath,
        storage: { providerName: 'localfs' },
        properties: {
            image: {
                styles: {
                    original: {},
                    thumb: {
                        thumbnail: '100x100',
                        '$format': 'jpg'
                    }
                }
            }
        }
    });

    placeSchema.statics.load = function (id, cb) {
        this.findOne({ _id : id })
        .populate('feedback')
        .populate('user', 'name username')
        .exec(cb);
    };

    placeSchema.statics.createWithImage = function (doc, imgPath, cb) {
        var place = new placeModel(doc);
        place.attach('image', { path: imgPath }, function(err) {
            if (err) return cb(err);
            place.save(function(err, savedPlace) {
                if (err) return cb(err);
                cb(null, savedPlace);
            });
        });
    };

    placeSchema.statics.findByUserId = function (id, cb) {
        this.find({user: id}, 'name', cb);
    };


    var placeModel = mongoose.model('Place', placeSchema);

    module.exports = placeModel;
});
