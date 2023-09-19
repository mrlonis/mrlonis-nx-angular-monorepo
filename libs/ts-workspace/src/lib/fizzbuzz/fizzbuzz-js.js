export function fizzbuzzJs() {
  let returnValue = '';

  let i = 1;
  while (i <= 100) {
    const multipleOf3 = i % 3 === 0;
    const multipleOf5 = i % 5 === 0;
    if (multipleOf3 && multipleOf5) {
      console.log('FIZZBUZZ');
      returnValue = returnValue.concat('FIZZBUZZ\n');
    } else if (multipleOf5) {
      console.log('BUZZ');
      returnValue = returnValue.concat('BUZZ\n');
    } else if (multipleOf3) {
      console.log('FIZZ');
      returnValue = returnValue.concat('FIZZ\n');
    } else {
      console.log(i);
      returnValue = returnValue.concat(`${i}\n`);
    }
    i++;
  }
  return returnValue;
}

/**
 * This is the function to submit
 */
export function fizzbuzz() {
  let i = 1;
  while (i <= 100) {
    const multipleOf3 = i % 3 === 0;
    const multipleOf5 = i % 5 === 0;
    if (multipleOf3 && multipleOf5) {
      console.log('FIZZBUZZ');
    } else if (multipleOf5) {
      console.log('BUZZ');
    } else if (multipleOf3) {
      console.log('FIZZ');
    } else {
      console.log(i);
    }
    i++;
  }
}
