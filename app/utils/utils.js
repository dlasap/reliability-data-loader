export function replaceValuesInString(inputString, searchArray, data, input_variables) {
  for (let i = 0; i < searchArray.length; i++) {
    const replacement = data[input_variables[i]];
    inputString = inputString.replace(searchArray[i], replacement);
  }
  return inputString;
}
