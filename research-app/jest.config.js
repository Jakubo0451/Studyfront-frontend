module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["./jest.setup.js"],
  testPathIgnorePatterns: ["research-app/node_modules/", "research-app/.next/"],
  collectCoverageFrom: ["./app/api/auth/**/*.{js}"],
  moduleNameMapper: {
    "^@/(.*)$": "research-app/$1",
  },
};
