const express = require('express');
const blackjack = require('./middleware/blackjack');
const war = require('./middleware/war');
const app = express();
const PORT = 5001
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
    let numberList = ["0","1","2","3","4","5","6","7","8","9",'10'];
    // START WORKING HERE
    while(playerValue <= 10){
        const cardRes = await fetch(`https://deckofcardsapi.com/api/deck/${deckData.deck_id}/draw/?count=2`);
        const cardData = await cardRes.json();
        const card1 = (numberList.includes(cardData.cards[0].value)) ? parseInt(cardData.cards[0].value) : 10
        const card2 = (numberList.includes(cardData.cards[1].value))? parseInt(cardData.cards[1].value) : 10
        

        // const card2 =  
        playerValue += 1;
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


app.listen(PORT, () => {
    console.log('Server is running on port 5000');
});

