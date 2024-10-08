const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.json("index");
})

app.get("/blackjack", (req, res) => {
    res.json("blackjack");
})



app.listen(5000, () => {
    console.log('Server is running on port 5000');
})