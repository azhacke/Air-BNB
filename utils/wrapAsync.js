module.exports = (fn) => {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
        //what is next here?
        //next is a function that is used to pass control to the next middleware function
        //what is this function doing?
        //this function is wrapping the async function fn
        //it is calling the function fn with req,res,next
        //if there is an error, it will be caught by the catch block
        //if there is an error, it will be passed to the next middleware
    }
}


//this is same as above
// module.exports = (fn) => {
//     return  (req,res,next){
//         fn(req,res,next).catch(next);
//     }
// }