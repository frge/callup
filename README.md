# callup

> A simple calling parser

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i callup --save
```

Install with [yarn](https://yarnpkg.com/)

```sh
$ yarn add callup
```

## Example

```js
const expr = 'fn(a+bf, cb(7) + " Snow", w+3+y)';
const callup = require('callup');
console.log(callup.parse(expr));
// =>
// {
//   "name": "fn",
//   "args": [
//     {
//       "op": "+",
//       "left": "a",
//       "right": "bf"
//     },
//     {
//       "op": "+",
//       "left": {
//         "name": "cb",
//         "args": ["7"]
//       },
//       "right": " Snow"
//     },
//     {
//       "op": "+",
//       "left": "w",
//       "right": {
//         "op": "+",
//         "left": "3",
//         "right": "y"
//       }
//     }
//   ]
// }
```
