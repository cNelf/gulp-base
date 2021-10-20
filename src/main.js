console.log('main.js');

const func = () => {
  console.log('箭头函数');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Promise resolve');
    }, 3000);
  });
};
