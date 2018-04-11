---
title: walli
datetime: 2018-04-11 13:13:19
---

[walli](https://github.com/imcuttle/walli)一个可管理不可变的数据校验库

### 什么时候需要用到 walli
  书写工具包的时候，需要校对用户输入参数的（复杂数据结构）配置,
  类似于webpack中的配置校对 和 react中的 prop types

### 简单栗子
如定义一个person的数据结构

- typescript 定义
```typescript
type Person = {
  name: string
  age: string
  gender: 'F' | 'M'
  father?: Person
  mother?: Person
  children?: Person[]
}
```

- 对应于walli定义
```javascript
import {
  string,
  eq,
  oneOf,
  array,
  integer,
  arrayOf,
  Verifiable
} from 'walli'
import { util } from 'walli'
const { createVerifiableClass, createFinalVerifiable, funcify } = util

const person = createVerifiableClass({
  getDisplayName() {
    return 'person'
  },
  _check(req) {
    return eq({
      name: string,
      age: integer,
      gender: oneOf(['F', 'M']),
      father: person().optional,
      mother: person().optional,
      children: arrayOf(person()).optional
    }).check(req)
  }
})

person().ok({
  name: 'cy',
  age: 22,
  gender: 'F'
}) === true

person().toUnlawfulString({
  // ...
})

// createFinalVerifiable
const finalPerson = createFinalVerifiable(person)
// finalPerson.check(...)


// Or using es6 syntax
class Person extends Verifiable {
  static displayName = 'person'
  _check(req) {
     // same code here
  }
}
const es6Person = funcify(Person)
const finalES6Person = createFinalVerifiable(es6Person)
```

### 特技
 walli 提供三个核心校验api: `check` `ok`  `toUnlawfulString`

* check
返回一个校验结果的数据结构 UnlawfulnessList，其中的 每一个 Unlawfulness 包括: 错误的 `paths` 路径，错误原因 `reasons`
* ok
则直接返回是否校验正确
* toUnlawfulString
返回非法原因的字符串

### 为什么walli是可管理的呢

1. 可以自定义自己的类型结构, 如上文中的 person.
2. 可以自定义非法字符串[message](https://imcuttle.github.io/walli/classes/_verifiable_.verifiable.html#message)
3. 预设众多的[基础类型](https://imcuttle.github.io/walli/globals.html) （欢迎提pr提供更多）

[github](https://github.com/imcuttle/walli)