const Card = require('./card');
class Deck {
    constructor(type, rating) {
        this.type = type;
        this.rating = rating;
        this.getCards().then(cards => this.cards = cards);
    }

    shuffle() {
        const { deck } = this;
        let m = deck.length, i;

        while (m) {
            i = Math.floor(Math.random() * m--);
            [deck[m], deck[i]] = [deck[i], deck[m]];
        }

        return this;
    }

    deal() {
        return this.cards.pop();
    }

    getCards() {
        return new Promise((resolve, reject) => {
            Card.find({ type: this.type, rating: { $lte: this.rating } }, (err, docs) => {
                if (err) {
                    reject(err);
                }
                resolve(docs);
            });   
        });
    }
}


module.exports = Deck
