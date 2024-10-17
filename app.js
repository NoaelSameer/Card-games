const express = require('express');
const app = express();
const PORT = 5001
const axios = require('axios');

app.set('view engine', 'ejs');
app.set('views', './views'); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('views'));
app.use("/assets", express.static('assets'));

app.get("/", (req, res) => {
    res.render("index"); 
});




// BLACKJACK

// used to save each game
const dater = {
    playerValue: 0,
    dealerValue: 0,
    gameOver: false,
    message: "",
    secret: 0,
    turn: 1,
    secretCard: "",
    starter: false
};

// let dealerCards = ["https://www.deckofcardsapi.com/static/img/back.png"]
let dealerCards = [],playerCards = [];

app.get("/blackjack", async (req, res) => {
    //renders the dictionary or object
    res.render("blackjack", {
        playerValue: dater.playerValue,
        dealerValue: dater.dealerValue,
        gameOver: dater.gameOver,
        message: dater.message,
        playerCards: playerCards,
        dealerCards: dealerCards,
        turn: dater.turn,
        starter: false
    });
});

// updates the blackjack page
app.post("/blackjack", async (req, res) => {
    try {
        const numberList = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", '10'];
        //if its a new game itll reset everything, including adding the new 4 cards, itll also do it when the game first starts
        if (req.body.action === "newGame" || dater.starter == false) {
            const deckRes = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=3');
            const deckData = await deckRes.json();
            const cardRes = await fetch(`https://deckofcardsapi.com/api/deck/${deckData.deck_id}/draw/?count=4`);
            const cardData = await cardRes.json();

            const card1 = (cardData.cards[0].value === "ACE") ? (dater.playerValue < 11 ? 11 : 1) :
                (numberList.includes(cardData.cards[0].value) ? parseInt(cardData.cards[0].value) : 10);

            const card2 = (cardData.cards[1].value === "ACE") ? (dater.playerValue < 11 ? 11 : 1) :
                (numberList.includes(cardData.cards[1].value) ? parseInt(cardData.cards[1].value) : 10);

            const card3 = (cardData.cards[2].value === "ACE") ? (dater.dealerValue < 11 ? 11 : 1) :
                (numberList.includes(cardData.cards[2].value) ? parseInt(cardData.cards[2].value) : 10);

            const card4 = (cardData.cards[3].value === "ACE") ? (dater.dealerValue < 11 ? 11 : 1) :
                (numberList.includes(cardData.cards[3].value) ? parseInt(cardData.cards[3].value) : 10);
            // adds the cards to the player and dealer lists, to be showcased 
            playerCards = [cardData.cards[0].images.png, cardData.cards[1].images.png];
            dealerCards = ["https://www.deckofcardsapi.com/static/img/back.png", cardData.cards[2].images.png];
            // saves the secret card to be replaced with the back image later.
            dater.secretCard = cardData.cards[3].images.png;
            // starts off the value for each one, and makes the secret value
            dater.playerValue = card1 + card2;
            dater.dealerValue = card3;
            dater.secret = card4; 
            dater.gameOver = false;
            dater.message = "";
            dater.turn = 1;

            console.log("New game made");
            dater.starter = true;
        }
        console.log("secret: " + dater.secret)
        // if the hit button is pressed itll play this if statement
        if (req.body.action === "hit") {
            console.log("Hit");
            // new card deck and new cards
            const deckRes = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=3');
            const deckData = await deckRes.json();
            const cardRes = await fetch(`https://deckofcardsapi.com/api/deck/${deckData.deck_id}/draw/?count=2`);
            const cardData = await cardRes.json();
            const carder1 = (cardData.cards[0].value === "ACE") ? (dater.playerValue < 11 ? 11 : 1) :
                (numberList.includes(cardData.cards[0].value) ? parseInt(cardData.cards[0].value) : 10);
            const carder2 = (cardData.cards[1].value === "ACE") ? (dater.playerValue < 11? 11 : 1) :
                (numberList.includes(cardData.cards[1].value) ? parseInt(cardData.cards[1].value) : 10);
            // adds the value and card to the lists
            playerCards.push(cardData.cards[0].images.png);
            dater.playerValue += carder1;
            console.log(`player hit`, dater.playerValue)
            // if the playervalue is over 21 they lose
            if (dater.playerValue > 21) {
                dater.gameOver = true;
                dater.message = "Dealer Won!";
                dealerCards[0] = dater.secretCard;

            }

            // if the dealervalue is less than 17, itll play these if statements
            if(dater.dealerValue + dater.secret < 17){
                // adds the carder2 to dealervalue, and adds it to the picture list. 
                dater.dealerValue += carder2
                dealerCards.push(cardData.cards[1].images.png)
                console.log(`dealer hit`, dater.dealerValue)
                console.log(`secret: ${dater.secret}`)
            }else{
                console.log("Dealer did not play" + dater.dealerValue + dater.secret)
            }
            // if dealervalue is over 21, itll play this and itll bust. It also remains a secret without the secret card, so the player doesnt immediately know if the dealer busted. 
            if(dater.dealerValue > 21){
                dater.gameOver = true;
                dater.message = "Player Won!";
                dealerCards[0] = dater.secretCard;

            }
        }
        // if the person presses the stand button
        if (req.body.action === "stand") {
            console.log("Stand");
            // it adds the secret value to the dealervalue
            dater.dealerValue += dater.secret;
            console.log(`dealer`)
            // runs this until the dealervalue is over 17
            while (dater.dealerValue < 17) {
                const deckRes = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
                const deckData = await deckRes.json();
                const cardRes = await fetch(`https://deckofcardsapi.com/api/deck/${deckData.deck_id}/draw/?count=1`);
                const cardData = await cardRes.json();
                const cardValue = (cardData.cards[0].value === "ACE") ? (dater.dealerValue < 11 ? 11 : 1) :
                    (numberList.includes(cardData.cards[0].value) ? parseInt(cardData.cards[0].value) : 10);
                
                dealerCards.push(cardData.cards[0].images.png); 
                dater.dealerValue += cardValue; 
                
                console.log("Dealer draws", cardValue);
            }
            // this part determiines the game winners, and replaces the first card (the secret one) with an actual card. 
            if (dater.dealerValue > 21) {
                dater.gameOver = true;
                dater.message = "Dealer Busted! Player Won!";
                dealerCards[0] = dater.secretCard;
            } else if (dater.dealerValue < dater.playerValue) {
                dater.gameOver = true;
                dater.message = "Player Won!";
                dealerCards[0] = dater.secretCard;
            } else if (dater.dealerValue === dater.playerValue) {
                dater.gameOver = true;
                dater.message = "It's a tie!";
                dealerCards[0] = dater.secretCard;

            } else {
                dater.gameOver = true;
                dater.message = "Dealer Won!";
                dealerCards[0] = dater.secretCard;
            }

            dater.turn = 1; 
        }
        // returns everything to the server
        res.render("blackjack", {
            gameOver: dater.gameOver,
            playerValue: dater.playerValue,
            dealerValue: dater.dealerValue,
            message: dater.message,
            playerCards: playerCards,
            dealerCards: dealerCards,
            turn: dater.turn,
            starter: dater.starter,
        });
    } catch (error) {
        // if there are any errors, itll error out. 
        console.error(error);
        res.status(404).send("error");
    }
});









//WAR GAME 

// declare a few variables outside the route

var total = 0, pTotal = 0, bTotal = 0, i = 0
var pCardVal = 0, bCardVal = 0, deckId = 0, pCard, bCard, winner
var cards = 52
var info = "This is the game of war. Whoever pulls the higher value card, adds both cards to their stack. If both cards are equal, they will be added to a pool and new cards will be compared until one player pulls a higher card, winning the entire pool. The player with the higher total when all cards have run out is the winner"

app.get("/reset", (req, res)=>{
    total = 0, pTotal = 0, bTotal = 0, i = 0
    pCardVal = 0, bCardVal = 0, deckId = 0, pCard = null, bCard = null, winner = null
    cards = 52
    res.redirect("/war")
})

app.get("/war", async (req, res) => {
    if(i == 0){
        const deckRes = await axios.get("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
        deckId = deckRes.data.deck_id
        i++
    }
    try{ // try catch to handle errors
        if(req.query.action == "compare"){ // if compare button is clicked, run compare function with the card values, and the total in the pool 
            await compare(pCardVal, bCardVal, total)
        }
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

    res.render("war", {pCardVal, bCardVal, pTotal, bTotal, pCard, bCard, winner, info}); // render the site with the current values and totals

    async function strVals(pCardVal, bCardVal) { // function to assign values 
        if(pCardVal === "ACE") {pCardVal = 11}
        if(bCardVal === "ACE") {bCardVal = 11}
    
        if(["KING", "QUEEN", "JACK"].includes(pCardVal)){
            pCardVal = 10;
        }
        if(["KING", "QUEEN", "JACK"].includes(bCardVal)){
            bCardVal = 10;
        }
        return {pCardVal, bCardVal}
    }

    async function compare(pCardVal, bCardVal){ // log to notify that the function is run
        const {pCardVal: newPCardVal, bCardVal: newBCardVal} = await strVals(pCardVal, bCardVal);
        pCardVal = Number(newPCardVal)
        bCardVal = Number(newBCardVal) // get values for string values
        cards -= 2
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

        if(cards< 20){
            if(pTotal > bTotal){
                winner = "Player"
            }else{
                winner = "Bot"
            }
        }
        if(winner){
            info = "The End of the line."
        }

        console.log(pCard.data)
        console.log(bCard.data)
        console.log(cards)

    }
})


app.listen(PORT, () => {
    console.log('Server is running on port 5001');
});

