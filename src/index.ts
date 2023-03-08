import cli from "./cli";
import assert from "node:assert";

export type LightTestModule = {
  [key: string]: (cb: () => void) => void;
};

export type LightTest = {
  [key: string]: LightTestModule;
};

class TestEngine {
  tests: LightTest;
  prepareEnviroment: () => Promise<void>;
  constructor() {
    this.tests = {};
    this.prepareEnviroment = async () => {
      console.log('\x1b[33m%s\x1b[0m', 'No function provided for prepareEnviroment');
      console.log('\x1b[33m%s\x1b[0m', 'This is the perfect place for seeding db or other stuff');
    }
  }

  setEnviroment(fn: () => Promise<void>) {
    this.prepareEnviroment = fn;
  }

  addTestModule(name: string, module: LightTestModule) {
    this.tests[name] = module;
  }

  private countTests() {
    let counter = 0;
    for (const key in this.tests) {
      if (Object.hasOwnProperty.call(this.tests, key)) {
        const subTests = this.tests[key];
        for (const testName in subTests) {
          if (Object.hasOwnProperty.call(subTests, testName)) {
            counter++;
          }
        }
      }
    }
    return counter;
  }

  async runTests() {
    await this.prepareEnviroment();
    setTimeout(() => {
      console.log('\x1b[33m%s\x1b[0m', 'Preparing Enviroment');
    }, 2000);
    setTimeout(() => {
      console.log('\x1b[33m%s\x1b[0m', 'Loading Tests');
    }, 4000);
    setTimeout(() => {
      console.log('\x1b[33m%s\x1b[0m', 'Almost Ready');
    }, 6000);
    setTimeout(() => {
      console.log('\x1b[33m%s\x1b[0m', 'Enviroment Loaded');

      const errors: { name: string; error: string }[] = [];
      let successes = 0;
      const limit = this.countTests();
      let counter = 0;

      for (const key in this.tests) {
        if (Object.hasOwnProperty.call(this.tests, key)) {
          const subTest = this.tests[key];
          for (const testName in subTest) {
            if (Object.hasOwnProperty.call(subTest, testName)) {
              (function () {
                // const tmpTestName = testName
                const testValue = subTest[testName];
                // Call the test
                try {
                  testValue(() => {
                    // if it calls back without throwing, then it succeded. log in green
                    console.log("\x1b[32m%s\x1b[0m", testName);
                    counter++;
                    successes++;
                    if (counter === limit) {
                      cli.produceTestReport(limit, successes, errors);
                    }
                  });
                } catch (error) {
                  // if it throws it failed
                  if (error instanceof assert.AssertionError) {
                    errors.push({
                      name: testName,
                      error: error.toString(),
                    });
                    console.log('\x1b[33m%s\x1b[0m', key + ': ', `\x1b[31m${testName}\x1b[0m`, 'FAILED');
                    counter++;
                    if (counter === limit) {
                      cli.produceTestReport(limit, successes, errors);
                    }
                  } else {
                    assert(
                      typeof error === "object" && error !== null,
                      "Error should be an object"
                    );
                    // console.log("QUE PASA?", error.toString());
                    throw error;
                  }
                }
              })();
            }
          }
        }
      }
    }, 8000);
  }
}

export default new TestEngine();
