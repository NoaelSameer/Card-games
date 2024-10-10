module.exports = (req, res, next) => {
    console.log("war middleware executed");
    
    next();
};
