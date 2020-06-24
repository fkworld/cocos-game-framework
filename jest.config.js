// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  preset: "ts-jest",
  setupFiles: ["jest-canvas-mock", "./test/cocos2d-js-min.js"],
  collectCoverageFrom: ["src/**/*.ts"],
};
