# lite-unit-test
Its a wrapper tool to build unit test in node with the native assert library

```typescript
// ...users/test.ts
import assert from 'node:assert'
import { LightTestModule } from 'lite-unit-test'

const unit: LightTestModule = {}

unit['2 equals 2'] = (done) => {
  assert.strictEqual(2, 2)
  done()
}

export default unit
```

```typescript
// ...allData/test.ts
import assert from 'node:assert'
import { LightTestModule } from 'lite-unit-test'
import { getAll } from './db'
import { CompanyFullDataSchema } from './schema'
import { ZodError } from 'zod'

const unit: LightTestModule = {}

unit['getAll does not throw'] = (done) => {
  assert.doesNotThrow(getAll)
  done()
}

unit['Database has more than 7k records'] = async (done) => {
  const res = await getAll()
  assert.strictEqual(res.length > 7000, true)
  done()
}

unit['Zod Schema validates ALL THE DATA'] = async (done) => {
  try {
    const data = await getAll()
    data.forEach((e) => CompanyFullDataSchema.parse(e))
  } catch (error) {
    if (error instanceof ZodError) {
      throw new assert.AssertionError({
        message: 'Zod Validation Failed'
      })
    }
    throw error
  }
  done()
}
```
```typescript
import lightTest from 'lite-unit-test'
import allData from './component/allData/test'
import users from './component/users/test'

lightTest.addTestModule('allData', allData)
lightTest.addTestModule('users', users)

lightTest.runTests()

```
```json
"scripts": {
  ...,
  "unit-test": "ts-node src/unit-tests.ts"
}
```
```bash
npm run unit-test

> trpc@1.0.0 unit-test
> ts-node src/unit-tests.ts

getAll does not throw
2 equals 2
Zod Schema fails ALL THE DATA
Database has more than 7k records
Zod Schema validates ALL THE DATA
---------------------------------------------------------------------------------------------
                                       BEGIN TEST REPORT
---------------------------------------------------------------------------------------------
Total tests                                                       5
Pass                                                              5
Fail                                                              0
---------------------------------------------------------------------------------------------
                                         END OF TESTS
---------------------------------------------------------------------------------------------
```