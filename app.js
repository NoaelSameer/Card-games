const express = require('express');
const blackjack = require('./middleware/blackjack');
const war = require('./middleware/war');
const app = express();
const PORT = 5001
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
    const playerValue = 0;
    const dealerValue = 0;
    const gameOver = false;
    const message = "";
        res.render("blackjack", {playerValue, dealerValue, gameOver, message});

});
app.post("/blackjack", async (req, res) => {
    try {
        let playerValue = 0, dealerValue = 0;
        let card1, card2
        let gameOver = false;
        const deckRes = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        const deckData = await deckRes.json();
        let numberList = ["0","1","2","3","4","5","6","7","8","9",'10'];
        const cardRes = await fetch(`https://deckofcardsapi.com/api/deck/${deckData.deck_id}/draw/?count=2`);
        const cardData = await cardRes.json();
    
        // FLAWED SYSTEM FIX SOON!!!
        if(cardData.cards[0].value == "ACE"){
            card1 = (playerValue < 21) ? 11 : 1
            // console.log("Ace found")
        } else{
            card1 = (numberList.includes(cardData.cards[0].value)) ? parseInt(cardData.cards[0].value) : 10
        }
        if(cardData.cards[1].value == "ACE"){
            card2 = (playerValue < 21) ? 11: 1
            // console.log("Ace found in deck")
        } else{
            card2 = (numberList.includes(cardData.cards[1].value))? parseInt(cardData.cards[1].value) : 10
        }
        console.log("Start")
        // playerValue += card1;
        dealerValue += card2;
        if(req.body.action == "hit"){
            console.log("Hit")
            playerValue += card1;
        }
        if(req.body.action == "stand"){
            console.log("Stand")
        }
        console.log(card1, card2);
        res.render("blackjack", {gameOver, playerValue, dealerValue});
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


app.listen(PORT, () => {
    console.log('Server is running on port 5000');
});

