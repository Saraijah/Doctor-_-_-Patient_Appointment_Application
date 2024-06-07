import bcrypt from 'bcrypt';

const hashPassword = (password) => {
  try {
    // Generate a salt
    const salt = bcrypt.genSaltSync(10); // 10 is the number of salt rounds

    console.log('Generated Salt:', salt); // Debugging: Log the generated salt

    // Hash the password with the generated salt
    const hashedPassword = bcrypt.hashSync(password, salt);

    console.log('Hashed Password:', hashedPassword); // Debugging: Log the hashed password

    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};

// Function to compare passwords
const comparePasswords = async (plainPassword, hashedPassword) => {
  try {
    // Compare the plain password with the hashed password
    const isPasswordValid = await bcrypt.compare(plainPassword, hashedPassword);
    return isPasswordValid;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
};

export { hashPassword, comparePasswords };
