module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    browsers: ["ChromeHeadless"], // Use Chrome in headless mode
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-coverage"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    reporters: ["coverage"],
    coverageReporter: {
      dir: require("path").join(__dirname, "./coverage"),
      reporters: [
        { type: "lcovonly", subdir: "." }, // This should generate lcov.info directly in ./coverage
        { type: "text-summary" },
      ],
    },
    singleRun: true, // End process after running tests
    autoWatch: false, // Do not watch for file changes
    customLaunchers: {
      ChromeHeadlessCI: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox"], // Needed for some CI environments
        singleRun: true,
        restartOnFileChange: false,
      },
    },
  });
};
