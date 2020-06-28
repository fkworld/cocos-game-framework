//@ts-check

module.exports = {
  preset: "ts-jest",
  setupFiles: ["jest-canvas-mock", "./test/cocos2d-js-min.js"],
  collectCoverageFrom: ["src/**/*.ts"],
};
