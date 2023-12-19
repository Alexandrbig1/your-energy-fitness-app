export const strCapitalizeAllFirstChar = str => {
  if (typeof str !== 'string') {
    return str;
  }
  return str
    .split(' ')
    .filter(w => w)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

export const strCapitalizeSentence = str => {
  if (typeof str !== 'string') {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const strSplitCamelCase = str => {
  if (typeof str !== 'string') {
    return str;
  }
  const val = str.replace(/([a-z])([A-Z])/g, '$1 $2');
  return val.toLowerCase();
};
