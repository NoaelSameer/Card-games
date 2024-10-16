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



// app.get("/blackjack", [blackjack], async (req, res) => {
//     const playerValue = 0;
//     const dealerValue = 0;
//     const gameOver = false;
//     const message = "";
//         res.render("blackjack", {playerValue, dealerValue, gameOver, message});

// });
// app.post("/blackjack", async (req, res) => {
//     try {
//         let playerValue = 0, dealerValue = 0;
//         let card1, card2
//         let gameOver = false;
//         const deckRes = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
//         const deckData = await deckRes.json();
//         let numberList = ["0","1","2","3","4","5","6","7","8","9",'10'];
//         const cardRes = await fetch(`https://deckofcardsapi.com/api/deck/${deckData.deck_id}/draw/?count=2`);
//         const cardData = await cardRes.json();
    
//         // FLAWED SYSTEM FIX SOON!!!
//         if(cardData.cards[0].value == "ACE"){
//             card1 = (playerValue < 21) ? 11 : 1
//             // console.log("Ace found")
//         } else{
//             card1 = (numberList.includes(cardData.cards[0].value)) ? parseInt(cardData.cards[0].value) : 10
//         }
//         if(cardData.cards[1].value == "ACE"){
//             card2 = (playerValue < 21) ? 11: 1
//             // console.log("Ace found in deck")
//         } else{
//             card2 = (numberList.includes(cardData.cards[1].value))? parseInt(cardData.cards[1].value) : 10
//         }
//         console.log("Start")
//         // playerValue += card1;
//         dealerValue += card2;
//         if(req.body.action == "hit"){
//             console.log("Hit")
//             playerValue += card1;
//         }
//         if(req.body.action == "stand"){
//             console.log("Stand")
//         }
//         console.log(card1, card2);
//         res.render("blackjack", {gameOver, playerValue, dealerValue});
//     }
//     catch (error) {
//         console.error(error);
//     }
//     // console.log(req.body.action);
// });

//WAR GAME 

// declare a few variables outside the route

var total = 0, pTotal = 0, bTotal = 0
var pCardVal = 0, bCardVal = 0, deckId = 0, pCard, bCard, remain

app.get("/war", async (req, res) => {
    try{ // try catch to handle errors
        if(req.query.action == "compare"){ // if compare button is clicked, run compare function with the card values, and the total in the pool 
            await compare(pCardVal, bCardVal, total)
        }
        const deckRes = await axios.get("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
        deckId = deckRes.data.deck_id
        pCard = await axios.get(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
        bCard = await axios.get(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`) // draw a card
        pCardVal = pCard.data.cards[0].value
        bCardVal = bCard.data.cards[0].value // Get the cards values
        const {pCardVal: newPCardVal, bCardVal: newBCardVal} = await strVals(pCardVal, bCardVal);
        pCardVal = Number(newPCardVal)
        bCardVal = Number(newBCardVal) // Get the cards values if they are not a number card
    }catch(error){
        res.status(500).send({error: error.message}) 
    }

    res.render("war", {pCardVal, bCardVal, pTotal, bTotal}); // render the site with the current values and totals

    async function strVals(pCardVal, bCardVal) { // function to assign values 
        if(pCardVal === "ACE") {pCardVal = 1}
        if(bCardVal === "ACE") {bCardVal = 1}
    
        if(["KING", "QUEEN", "JACK"].includes(pCardVal)){
            pCardVal = 10;
        }
        if(["KING", "QUEEN", "JACK"].includes(bCardVal)){
            bCardVal = 10;
        }
        return {pCardVal, bCardVal}
    }

    async function compare(pCardVal, bCardVal){ // log to notify that the function is run
        remain = `https://www.deckofcardsapi.com/api/deck/${deckId}/shuffle/?remaining=true`
        console.log(remain.data.remaining)
        const {pCardVal: newPCardVal, bCardVal: newBCardVal} = await strVals(pCardVal, bCardVal);
        pCardVal = Number(newPCardVal)
        bCardVal = Number(newBCardVal) // get values for string values
        if(pCardVal == bCardVal){ 
            total += (pCardVal + bCardVal) // if they are equal, add both cards vals to pool
            pCard = await axios.get(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`) // get new cards, and call compare function again
            bCard = await axios.get(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
            pCardVal = pCard.data.cards[0].value
            bCardVal = bCard.data.cards[0].value
        }else if(pCardVal > bCardVal){
            pTotal += (pCardVal + bCardVal + total) // if players card is great than bots card, player card gets the total + both sides card values
            total = 0
            console.log("Player wins") // notify player
        }else if(pCardVal < bCardVal){
            bTotal += (pCardVal + bCardVal + total) // Same process here
            total = 0
            console.log("Bot wins") // notify bot
        }
    }
})


app.listen(PORT, () => {
    console.log('Server is running on port 5001');
});

