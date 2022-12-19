const setExpression = ({ input, exp, setState, msg }) => {
  setState((prevState) => ({
    ...prevState,
    validate: exp.test(input),
    tooltipMessage: msg,
  }));
};

export const validateItemLabel = ({ input, setState }) => {
  const exp = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*$/;
  // console.log('input', exp.test(input));
  setState((prevState) => ({
    ...prevState,
    question: input,
    questionLabelValidation: !exp.test(input),
    tooltipMessage: 'only characters, digits and (.) allowed',
  }));
};

export const validateAnswer = ({ input, contentSubType, setState }) => {
  if (contentSubType === '') return;
  switch (contentSubType) {
    case 'checkbox':
      input = input.slice(0, 1);
      setExpression({
        input,
        setState,
        exp: /[^A-Fa-f]/g,
        msg: 'Use only a-f',
      });
      // let data = val.replace(/[^0-1]/g, '');
      break;

    case 'integer':
      // let data = val.replace(/[^0-9]/g, '');
      setExpression({
        input,
        setState,
        exp: /[^0-9]/g,
        msg: 'Integers from 0-9 are accepted',
      });
      // input = data;
      break;

    case 'decimal':
      // let data = val.replace(/[^0-9.]/g, '');
      // input = data;
      setExpression({
        input,
        setState,
        exp: /[^0-9.]/g,
        msg: 'Decimals from 0-9 are accepted',
      });
      break;

    case 'english':
      // let data = val.replace(/[^A-Za-z]/g, '');
      // input = data;
      setExpression({
        input,
        setState,
        exp: /[^A-Za-z]/g,
        msg: 'Only Upper and Lower case letters accepted',
      });
      break;

    case 'english_character':
      // let data = val.replace(/[^A-Za-z]/g, '');
      input = input.slice(0, 1);
      setExpression({
        input,
        setState,
        exp: /[^A-Za-z]/g,
        msg: 'Only Upper and Lower case letter accepted',
      });
      break;

    case 'japanese_character':
      input = input.slice(0, 1);
      break;

    default:
      break;
  }
  setState((prevState) => ({ ...prevState, answer: input }));
};
