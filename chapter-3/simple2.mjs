var count = 0;

export function next() {
    return ++count;
};

export function hello() {
    return "Hello World!";
};

function square() {
    return Math.pow(count, 2);
};

export default function () {
    return count;
};
export const meaning = 42;
export let noCount = -1;
export { square };