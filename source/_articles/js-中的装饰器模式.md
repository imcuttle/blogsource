---
title: JS 中的装饰器模式
datetime: 2020-01-10T12:31:23.987Z
---
## 背景

使用过 mobx + mobx-react 的同学对于 ES 的新特性**装饰器**肯定不陌生。我在第一次使用装饰器的时候，我就对它爱不释手，书写起来简单优雅，太适合我这种爱装 X 且懒的同学了。今天我就带着大家深入浅出这个优雅的语法特性：装饰器。

## 预备知识

* 全球统一为 ECMAScript 新特性、语法制定统一标准的组织委员会是 TC39；
* 对于单个的新特性，TC39 有专门的[标准和阶段](https://tc39.es/process-document/)去跟进该特性，也就是我们常说的 stage-0 到 stage-4，其中的新特性的成熟完备性从低到高；

普及完一些必要的知识点后，我们继续进入到我们的主题：装饰器。

## 演变过程

装饰器的制定过程也不是一帆风顺的，而且就算是2020年初的现在，这个备受争议的语法特性官方标准还在讨论制定当中，目前仍处于 [stage-2: 草稿状态](https://github.com/tc39/proposal-decorators)。

但目前市面上 Babel、TypeScript 编译支持的装饰器语法主要包括两种方式，一个是 传统方式(legacy) 和目前[标准方式](https://tc39.es/proposal-decorators/)。

由于目前标准还不是很成熟，编译器的支持并不全面，所以市面上大部分的装饰器库，大都只是兼容 legacy 方式，如 Mobx，如下为 Mobx 官网中的一段话：

> Note that the legacy mode is important (as is putting the decorators proposal first). Non-legacy mode is [WIP](https://github.com/mobxjs/mobx/pull/1732).

下面我就从实际场景出发，来使用装饰器模式来实现我们常见的一些业务场景。

**注意：由于新版标准可以说是在 legacy 的方式下改造出来的，legacy 更加灵活，标准方式则主张静态配置去扩展实现装饰器功能**

## 实际场景

### 需求

我希望实现一个 validate 修饰器，用于定义成员变量的校验规则，使用如下
```javascript
import {validate, check} from 'validate'

class Person {
   @validate(val => !['M', 'W'].includes(val) && '需要为 M 或者 W')
   gender = 'M'
}

const person = new Person();
person.gender = null;
check(person); // => [{ name: 'gender', error: '需要为 M 或者 W' }]
```

以上这种方式，相比于运行时 validate，如下

```javascript
const check = (person) => {
   const errors = [];
   if (!['M', 'W'].includes(person.gender)) {
      errors.push({name: 'gender', error: '需要为 M 或者 W'});
   }
   return errors;
}
```

装饰器的方式能够更快捷的维护校验逻辑，更加具有表驱动程序的优势，只需要改配置即可。但是对于没有接触过装饰器模式模式的同学，深入改造装饰器内部的逻辑就有一定门坎了（但是不怕，这篇文章帮助大家降低门坎）。

### 实现

**由于目前 Babel 编译对于新版标准支持不是很完全，对于标准的装饰器模式实现有一定程度的影响，所以本文主要介绍 legacy 方式的实现**，相信对于大家后续实现标准的装饰器也是有帮助的！

#### 思路整理
按照 api 的使用用例，我们可以知道，对于 person 实例是已经注入了 validate 校验逻辑的，然后在 `check` 方法中提取校验逻辑并执行即可。

```
@validate // 注入校验逻辑
    |
  check   // 提取校验逻辑并执行
    |
返回校验结果
```


首先我们在 babel 配置中需要如下配置：
```
"plugins": [
  [
    "@babel/proposal-decorators",
    {
      "legacy": true
    }
  ],
  ["@babel/proposal-class-properties", { "loose": true }]
]
```

对于我们需要实现的 `@validate` 装饰器结构如下：

```
// rule 为外界自定义校验逻辑
function validate(rule) {
  // target 为原型，也就是 Person.prototype
  // keyName 为修饰的成员名，如 `gender`
  // descriptor 为该成员的是修饰实体
  return (target, keyName, descriptor) => {
     // 注入 rule
     target['check'] = target['check'] || {};
     target['check'][keyName] = rule;
     return descriptor;
  }
}
```

根据上述逻辑，执行完 `@validate` 之后，在 `Person.prototype` 中会注入 `'check'` 属性，同时我们在 `check` 方法中拿到该属性即可进行校验。


那么我们是不是完成了该方法呢？其实还远远不够：

1. 首先，对于隐式注入的 `check` 属性需要足够隐藏，同时属性名 `check` 未免太容易被实例属性覆盖，从而不能通过原型链找到该属性
2. 在类继承模式下，`check` 属性可能会丢失，甚至会污染校验规则

首先我们来看第一个问题：改造我们的代码
```javascript
const getInjectPropName =
  typeof Symbol === 'function' ? name => Symbol.for(`[[${name}]]`) : name => `[[${name}]]`

const addHideProps = (target, name, value) => {
  Object.defineProperty(target, name, {
    enumerable: false,
    configurable: true,
    writable: true,
    value
  })
}

function validate(rule) {
  return (target, keyName, descriptor) => {
     const name = getInjectPropName('check');
     addHideProps(target, name, target[name] || {});
     target[name][keyName] = rule;
     return descriptor;
  }
}
```

相比于之前的代码实现，这样 `Object.keys(Person.prototype)` 不会包含 `check` 属性，同时也大大降低了属性命名冲突的问题。


对于第二个问题，类继承模式下的装饰器书写。如下例子：
```javascript
class Person {
   @validate(val => !['M', 'W'].includes(val) && '需要为 M 或者 W')
   gender = 'M'

   @validate(a => !(a > 10) && '需要大于10')
   age = 12
} 

class Man extends Person {
   @validate(val => !['M'].includes(val) && '需要为 M')
   gender = 'M'
}
```

其中的原型链模型图如下

```text
       person instance     +-------------------+
          +----------+     |  Person.prototype |
          |__proto___+------>------------------+
          |         |+     |   rules           |
          +----------+     +-------+--+-+------+
          |          |             ^  ^ ^
          |          |             |  | |
          |          |                | |
          +----------+             |  |
          | rules    +- -- -- -- --   | |
          +----------+                |
                                      | |
                                      | |
                       person instance+
                          +----------+  |
                          |__proto___|  |
man instance              |         |+
        +-----------+     +----------+  |
        |__proto__  |     |          |  |
        |           +---->+          |
        +-----------+     |          |  |
        |           |     +----------+
        |           |     | rules    |  |
        |           |     +---^------+
        |           |                   |
        |           |                   |
        +-----------+
        | rules     | - - - - - -- - - -+
        +-----------+
```

可以看到 man instance 和 person instance 共享同一份 rules，同时 `Man` 中的 `validate` 已经污染了共享的这份 rules，导致 `person instance` 校验逻辑

所以我们需要把原型模型修改为如下模式：
```text
       person instance     +-------------------+
          +----------+     |  Person.prototype |
          |__proto___+------>------------------+
          |         |+     |   rules           |
          +----------+     +-------+-----------+
          |          |             ^
          |          |             |
          |          |
          +----------+             |
          | rules    +- -- -- -- --
          +----------+


                       person instance2
                         Man.prototype
                          +----------+
                          |__proto___|
man instance              |          |
        +-----------+     +----------+
        |__proto__  |     |          |
        |           +---->+          |
        +-----------+     |          |
        |           |     +----------+
        |           |     | rules    |
        |           |     +---+------+
        |           |         ^
        |           |         |
        +-----------+         |
        | rules     | - - - - +
        +-----------+
```

可以看到 `man instance` 和 `person instance` 都有一份 `rules` 在其原型链上，这样就不会有污染的问题，同时也不会丢失校验规则

修改我们的代码：

```javascript
const getInjectPropName =
  typeof Symbol === 'function' ? name => Symbol.for(`[[${name}]]`) : name => `[[${name}]]`

const addHideProps = (target, name, value) => {
  Object.defineProperty(target, name, {
    enumerable: false,
    configurable: true,
    writable: true,
    value
  })
}

function validate(rule) {
  return (target, keyName, descriptor) => {
     const name = getInjectPropName('check');
     // 没有注入过 rules
     if (!target[name]) {
        addHideProps(target, name, {});
     } else {
        // 已经注入，但是是注入在 target.__proto__ 中
        // 也就是继承模式
        if (!target.hasOwnProperty(name)) {
           // 浅拷贝一份至 own
           addHideProps(target, name, {...target[name]})
        }
     }

     target[name][keyName] = rule;
     return descriptor;
  }
}
```

如上，才算是我们完备的代码！而且 mobx 也是有相同场景的考虑的。

## 总结
总结是把以上模式沉淀为 [decorate-utils](https://github.com/imcuttle/decorate-utils) 方便我们自定义自己的修饰器

