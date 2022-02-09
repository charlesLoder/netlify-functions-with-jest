/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
      "^.+\\.(js)$": "babel-jest",
    },
    transformIgnorePatterns: [],
  };