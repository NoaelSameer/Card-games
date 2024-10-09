module.exports = (req, res, next) => {
    console.log("Blackjack middleware executed")
    
    next();
};

