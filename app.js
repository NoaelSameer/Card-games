const express = require('express');
const blackjack = require('./middleware/blackjack');
const war = require('./middleware/war');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views'); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render("index"); 
});




// BLACKJACK
app.get("/blackjack", [blackjack], (req, res) => {
    res.render("blackjack"); 
});




// WAR
app.get("/war", [war], (req, res) => {
    res.render("war"); 
    })


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
