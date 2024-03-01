const constantStrings = ['CLEAR_STORE'];

const obj = {};

constantStrings.forEach(str => {
  obj[str] = `app/Common/${str}`;
});

export default obj;
