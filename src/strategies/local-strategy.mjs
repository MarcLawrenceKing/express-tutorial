import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/helpers.mjs";

passport.serializeUser((user,done) => {
  done(null,user.id);
});

passport.deserializeUser(async (id,done) => {
  console.log(`Deserializing User ID: ${id}`)
  try{
   const findUser = await User.findById(id)
   if (!findUser) throw new Error("User not found");
   done(null, findUser)
  } catch (err){
    done(err,null)
  }
});

export default passport.use( //responsibe for validating the user
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await User.findOne({ username })
      if(!findUser) throw new Error('User not found');
      //if password not same as decrypted
      if(!comparePassword(password, findUser.password)) 
        throw new Error("Bad Credentials");
      done(null, findUser);
        } catch (err) {
      done(err,null)
    }
})
)