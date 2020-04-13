function findLargeLength(nums) {
  let large = 0;
  nums.forEach((num) => {
    const [a, b = []] = num.toString().split('.');
    const { length } = b;
    if (length > large) {
      large = length;
    }
  })
  return large;
}

function add(...nums) {
  const large = findLargeLength(nums);
  const plusCount = Math.pow(10, large)
  const compute = nums.reduce((total, num) => {
    return total + (num * plusCount);
  }, 0);
  return compute /  plusCount;
}

console.log(add(0.1, 0.2));

function subtraction(...nums) {
  const large = findLargeLength(nums);
  const plusCount = Math.pow(10, large)
  const compute = nums.reduce((total, num, index) => {
    return index ? total - (num * plusCount) : (num * plusCount);
  }, 0);
  return compute /  plusCount;
}

console.log(subtraction(0.1, 0.3));

function multiplication(...nums) {
  const large = findLargeLength(nums);
  const plusCount = Math.pow(10, large * nums.length);
  const compute = nums.reduce((total, num) => {
    return total * (num * Math.pow(10, large));
  }, 1);
  return compute /  plusCount;
}

console.log(multiplication(.1, .2));

function division(...nums) {
  const large = findLargeLength(nums);
  const compute = nums.reduce((total, num, index) => {
    return index ? total / (num * Math.pow(10, large)) : (num * Math.pow(10, large));
  }, 1);
  return compute;
}

console.log(division(.6, .2));

