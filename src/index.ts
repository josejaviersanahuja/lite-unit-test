import cli from './cli'
import assert from 'node:assert'

export type LightTestModule = {
  [key: string]: (cb: Function) => void
}

export type LightTest = {
  [key: string]: LightTestModule
}

class TestEngine {
  tests: LightTest
  constructor () {
    this.tests = {}
  }

  addTestModule (name: string, module: LightTestModule) {
    this.tests[name] = module
  }

  countTests () {
    let counter = 0
    for (const key in this.tests) {
      if (Object.hasOwnProperty.call(this.tests, key)) {
        const subTests = this.tests[key]
        for (const testName in subTests) {
          if (Object.hasOwnProperty.call(subTests, testName)) {
            counter++
          }
        }
      }
    }
    return counter
  }

  async runTests () {
    const errors: { name: string, error: string }[] = []
    let successes = 0
    const limit = this.countTests()
    let counter = 0

    for (const key in this.tests) {
      if (Object.hasOwnProperty.call(this.tests, key)) {
        const subTest = this.tests[key]
        for (const testName in subTest) {
          if (Object.hasOwnProperty.call(subTest, testName)) {
            (function () {
              // const tmpTestName = testName
              const testValue = subTest[testName]
              // Call the test
              try {
                testValue(function () {
                  // if it calls back without throwing, then it succeded. log in green
                  console.log('\x1b[32m%s\x1b[0m', testName)
                  // console.log('\x1b[33m%s\x1b[0m', key + ': ','\x1b[32m%s\x1b[0m', testName)
                  counter++
                  successes++
                  if (counter === limit) {
                    cli.produceTestReport(limit, successes, errors)
                  }
                })
              } catch (error) {
                // if it throws it failed
                if (error instanceof assert.AssertionError) {
                  errors.push({
                    name: testName,
                    error: error.toString()
                  })
                  console.log(
                    '\x1b[31m%s\x1b[0m', testName)
                  counter++
                  if (counter === limit) {
                    cli.produceTestReport(limit, successes, errors)
                  }
                } else {
                  assert(typeof error === 'object' && error !== null, 'Error should be an object')
                  console.log('QUE PASA?', error.toString())
                  throw error
                }
              }
            })()
          }
        }
      }
    }
  }
}

export default new TestEngine()
