const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const validator = require("validator");




const userSchema = new mongoose.Schema({
  //
  email: {
    type: "string",
    required: true,
    unique: true,
  },
  password: {
    type: "string",
    required: true,
  },
  //   confirmpassword: {
  //     type: "string",
  //     required: true,
  //   },
});



// static register method

userSchema.statics.register = async function (email, password) {
  // Validation
  if (!email || !password) {
    throw Error("All the feilds must be filled.");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }
  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email already registered");
  }

  //  Hashing
  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });

  return user;
};


// static login method

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All the feilds must be filled.");
  }
  
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect Email");
  }
  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    throw Error('Incorrect password')
  }
    
  return user
}


module.exports = mongoose.model("User", userSchema);
