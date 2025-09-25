class ExpressError extends Error {
    constructor( statusCode, message ) {
        super();
        this.statusCode = statusCode;
        this.message = message;
        //what is use of .this keyword?
        //the this keyword refers to the current instance of the class
        //instance is an object that is created from a class
    }
}
module.exports = ExpressError;
//this is express error class which extends the default error class in js