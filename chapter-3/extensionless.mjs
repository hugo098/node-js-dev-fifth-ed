import simple from './simple.js';

const {hello, next} = simple;

console.log(simple.hello());
console.log(hello());
console.log(`${simple.next()}`);
console.log(`${next()}`);