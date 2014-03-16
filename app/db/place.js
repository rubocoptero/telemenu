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
        feedback: {
            type: mongoose.Schema.ObjectId,
            ref: 'Feedback'
        },
        category: {
            type: String,
            enum: [ 'Private', 'Professional'],
            default: 'Private',
            required: true
        }
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

    placeSchema.methods.saveWithImage = function(imagePath, cb) {
        var that = this;

        function save() {
            that.save(function (err, savedPlace) {
                if (err) return cb(err);
                cb(null, savedPlace);
            });
        }

        if (imagePath) {
            this.attach('image', {path: imagePath }, function (err) {
                if (err) return cb(err);
                save();
            });
        } else {
            save();
        }
    };

    placeSchema.virtual('detail_img').get(function () {
        var detailPath = this.image.original.path;
        return detailPath.slice(detailPath.indexOf('/img/'));
    });

    placeSchema.virtual('thumb_img').get(function () {
        var thumbPath = this.image.original.path;
        return thumbPath.slice(thumbPath.indexOf('/img/'));
    });


    var placeModel = mongoose.model('Place', placeSchema);

    module.exports = placeModel;
});
