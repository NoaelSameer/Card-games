
# Card Games

This project features 2 cards games created with https://www.deckofcardsapi.com/. It features Blackjack and War, two classic and fun card games. 


## Authors

- [@Oakuopus](https://github.com/oakuopus)
- [@NoaelSameer](https://github.com/NoaelSameer)


## Dependencies
 EJS, Express, Axios


## Deployment

To deploy this project run

```bash
  npm i
  npm run dev
```


## License

[MIT](https://choosealicense.com/licenses/mit/)

## Version
 - 1.0 
10/16/2024
## Usage/Examples

Below is an piece of code from the war card game. The code calls the deck of cards api using axios, assigns variables to the response, and correctly handles errors with a try/catch statement. 

```javascript
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
```

