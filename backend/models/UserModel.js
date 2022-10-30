const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },

  {
    timestamps: true,
  }
);

userSchema.path("email").validate(function (value) {
  return !value || !value.trim().length || validator.isEmail(value);
}, "Please enter valid email");

userSchema.path("password").validate(function (value) {
  var regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  return !value || !value.trim().length || regex.test(value);
}, "Your password must be at least 8 characters, and contain one uppercase letter, one lowercase letter, one number, and one special character");

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  
  const user = await this.findOne({ email });
  if (user) {
    const checkPwd = await bcrypt.compare(password, user.password);
    if (checkPwd) {
      return user;
    }

    throw Error("isInvalidCredentials");
  }
  throw Error("isInvalidCredentials");
};

module.exports = mongoose.model("Userz", userSchema);
