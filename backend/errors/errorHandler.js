const errorHandler = (err) => {
  let errors = { email: "", password: "" };

  if (err.message === "isInvalidCredentials") 
    errors = "Invalid Email and Password, Try Again";



  if (err.message === "isInvalidEmail")
    errors.email = "Email is not registered";

  if (err.message === "isInvalidPassword")
    errors.password = "Password is incorrect";

  if (err.code === 11000) {
    errors.email = "Email already exists";
    return errors;
  }

  if (err.message.includes("Userz validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

module.exports = {
  errorHandler,
};
