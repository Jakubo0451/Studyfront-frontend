module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  // testRegex: '(/__tests__/.*|(\\.|/))(test|spec)\\.jsx?$', // Removed to avoid conflict with testMatch
  moduleFileExtensions: ['js', 'jsx'],
  testEnvironment: 'node'
};