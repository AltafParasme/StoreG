const constantStrings = ['START_LOADING', 'END_LOADING'];

const obj = {};

constantStrings.forEach(str => {
  obj[str] = `app/Loaders/${str}`;
});

export default obj;
