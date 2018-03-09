const {parse} = require('./index');

const exprs = [
  'name',
  'fn()',
  'fn(arg)',
  'fn(1+3, arg)',
  'fn(5, u(4 * i))',
  'fn(5, u(4 * i) + 20)',
  'fn(5, u(4 * i), 20)',
  'fn(5, "this is a string", u(4 * i))',
  'fn(a+bf, cb(7)+"2)", w+3+y)'
];

describe('测试', function () {
  exprs.forEach(expr => {
    it(expr, function (done) {
      const e = parse(expr);
      console.log(JSON.stringify(e, null, 2));
      done();
    });
  });
  
  exprs.forEach(expr => {
    it(expr + ' + expression', function (done) {
      parse(expr + ' + expression');
      done();
    });
  });
  
  exprs.forEach(expr => {
    it(expr + ' + ' + expr, function (done) {
      parse(expr + ' + ' + expr);
      done();
    });
  });
});
