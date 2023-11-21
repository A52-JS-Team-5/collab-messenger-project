export const isEmailValid = (email) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}

export const isPhoneNumberValid = (number) => {
  const numberRegex = /^\d+$/;
  return numberRegex.test(number);
}