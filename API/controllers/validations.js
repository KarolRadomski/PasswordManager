
const validateUserID = (userId) => {
   //check if userId is a number

   if (isNaN(userId)) {
      return false
   }
   //check if userId is a positive number
   if (userId < 0) {
      return false
   }

   return true
}




module.exports = {
   validateUserID
};