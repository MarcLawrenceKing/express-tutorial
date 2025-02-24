export const createUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32
      },
      errorMessage: 'must be at least 5 characters!'
    },
    notEmpty: {
      errorMessage: 'usernname must not be empty!'
    },
    isString: {
      errorMessage: 'username must be a string!'
    },
  },
  displayName: {
    notEmpty: true
  },
  password: {
    notEmpty: true,
  },
}