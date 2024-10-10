const express = require('express');
const blackjack = require('./middleware/blackjack');
const war = require('./middleware/war');
const app = express();
const axios = require('axios');

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

app.get("/compare", (req, res) => {
    compare(pCardVal, bCardVal, total);
})
// WAR
app.get("/war", [war], async (req, res) => {
    var total = 0, pTotal = 0, bTotal = 0;
    try{
        const pDeckRes = await axios.get("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
        const bDeckRes = await axios.get("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
        const pDeckId = pDeckRes.data.deck_id, bDeckId = bDeckRes.data.deck_id
        var pCard = await axios.get(`https://www.deckofcardsapi.com/api/deck/${pDeckId}/draw/?count=1`)
        var bCard = await axios.get(`https://www.deckofcardsapi.com/api/deck/${bDeckId}/draw/?count=1`)
        var pCardVal = pCard.data.cards[0].value
        var bCardVal = bCard.data.cards[0].value
        if(typeof pCardVal === "string"){
            pCardVal = 10
        }
        if(typeof bCardVal === "string"){
            bCardVal = 10
        }
    }catch(error){
        res.err(err)
    }
    async function compare(pCardVal, bCardVal, tot){
        switch(pCardVal, bCardVal){
            case (pCardVal == bCardVal):
                total += (pCardVal + bCardVal)
                pCard = await axios.get(`https://www.deckofcardsapi.com/api/deck/${pDeckId}/draw/?count=1`)
                bCard = await axios.get(`https://www.deckofcardsapi.com/api/deck/${bDeckId}/draw/?count=1`)
                bCardVal = bCard.data.cards[0].value
                pCardVal = pCard.data.cards[0].value
                compare(pCardVal, bCardVal, total)
            case (pCardVal > bCardVal):
                pTotal += (pCardVal + bCardVal + tot)
                total = 0
                pCard = await axios.get(`https://www.deckofcardsapi.com/api/deck/${pDeckId}/draw/?count=1`)
                bCard = await axios.get(`https://www.deckofcardsapi.com/api/deck/${bDeckId}/draw/?count=1`)
                bCardVal = bCard.data.cards[0].value
                pCardVal = pCard.data.cards[0].value
            case (pCardVal < bCardVal):
                bTotal += (pCardVal + bCardVal + tot)
                total = 0
                pCard = await axios.get(`https://www.deckofcardsapi.com/api/deck/${pDeckId}/draw/?count=1`)
                bCard = await axios.get(`https://www.deckofcardsapi.com/api/deck/${bDeckId}/draw/?count=1`)
                bCardVal = bCard.data.cards[0].value
                pCardVal = pCard.data.cards[0].value
        }
    }
    
    res.render("war", {pCardVal, bCardVal, pTotal, bTotal});
})


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

