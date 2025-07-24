// Email validation
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
    return password && password.length >= 6;
};

// Amount validation
export const isValidAmount = (amount) => {
    return !isNaN(amount) && parseFloat(amount) > 0;
};

// Full name validation
export const isValidFullName = (fullName) => {
    return fullName && fullName.trim().length >= 2;
};