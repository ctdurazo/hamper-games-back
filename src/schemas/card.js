const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/hamper-games', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});

var CardSchema = new mongoose.Schema({
    type: Number,
    text: String,
    rating: Number
}, {
    collection: 'cards'
});


module.exports = mongoose.model('Card', CardSchema);
