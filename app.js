const express = require('express');
const blackjack = require('./middleware/blackjack');
const war = require('./middleware/war');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views'); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('views'));
app.use("/middleware", express.static('middleware'));
app.use("/assets", express.static('assets'));

app.get("/", (req, res) => {
    res.render("index"); 
});




// BLACKJACK



app.get("/blackjack", [blackjack], async (req, res) => {
    if(req.body.action == "hit"){
        console.log("Hit");
    }
    try {
        // Deck Information
        const deckRes = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        const deckData = await deckRes.json();
        // console.log(deckData);

        const cardRes = await fetch(`https://deckofcardsapi.com/api/deck/${deckData.deck_id}/draw/?count=2`);
        const cardData = await cardRes.json();
        // console.log(cardData);
        res.render("blackjack");
    }
    catch (error) {
        console.error(error);
    }

});
app.post("/blackjack", async (req, res) => {
    let dealerValue = 0;
    let playerValue = 0;
    const deckRes = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    const deckData = await deckRes.json();

    // START WORKING HERE
    while(playerValue <= 21){
        const cardRes = await fetch(`https://deckofcardsapi.com/api/deck/${deckData.deck_id}/draw/?count=2`);
        const cardData = await cardRes.json();

    }
    try {
        if(req.body.action == "hit"){
            console.log("Hit");
        }else if(req.body.action == "stand") {
            console.log("Stand");
        }
        res.render("blackjack");
    }
    catch (error) {
        console.error(error);
    }
    // console.log(req.body.action);
});





// WAR
app.get("/war", [war], (req, res) => {
    res.render("war"); 
    })


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

