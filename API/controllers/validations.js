const validateID = (id) => {
  //check if id is not empty, not a number, and not negative
  if (!id) return false;
  if (isNaN(id)) return false;
  if (id < 0) return false;
  return true;
};

const validateEmail = (email) => {
  //check if email is not empty, is email format, and not xss
  if (!email) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const xssRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  if (xssRegex.test(email)) return false;
  if (!emailRegex.test(email)) return false;

  return true;
};

const validatePassword = (password) => {
  //check if password is not empty, is at least 3 characters, and not xss
  if (!password) return false;
  const xssRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  if (xssRegex.test(password)) return false;
  if (password.length < 3) return false;

  return true;
};

const validateString = (name) => {
  //check if name is not empty, is at least 3 characters, and not xss
  if (!name) return false;
  const xssRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  if (xssRegex.test(name)) return false;
  if (name.length < 3) return false;

  return true;
};

module.exports = {
  validateID,
  validateEmail,
  validatePassword,
  validateString,
};
