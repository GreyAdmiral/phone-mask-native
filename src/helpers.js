/** @typedef {Record<'from' | 'to', string>} FromTo */

/** @typedef {Record<'fb' | 'sb' | 'fn' | 'sn', FromTo>} PhoneMaskScheme */

/**
 * @typedef {Object} PhoneNumber
 * @prop {string[]} numbers
 * @prop {'one' | 'two' | 'three'} scheme
 */

import options from './data/phonemasks.json';
import phoneNumbers from './data/phonenumbers.json';

export const oneSymbols = phoneNumbers.find((it) => isOneNumbers(it));
export const otherSymbols = phoneNumbers.filter((it) => !isOneNumbers(it));

/**
 * @param {HTMLInputElement} input
 * @returns {string}
 */
export function getInputNumbersValue(input) {
   return input.value.replace(/\D/g, '');
}

/**
 * @param {string} value
 * @param {string[]} array
 * @returns {boolean}
 */
export function isHasInArray(value, array) {
   return array.some((num) => value.startsWith(num));
}

/**
 * @param {Array<PhoneNumber>} array
 * @returns {string[]}
 */
export function getAllNunmbers(array) {
   return array.reduce((acc, { numbers }) => acc.concat(numbers), []);
}

/**
 * @param {{numbers: Array<string>}} numbers
 * @returns {boolean}
 */
export function isOneNumbers({ numbers }) {
   const [sample] = numbers;
   const length = (sample && sample.length) || 0;

   return length === 1;
}

/**
 * @param {{firstSymbols: string, inputNumbersValue: string, options: PhoneMaskScheme}} arguments
 * @returns {string}
 */
export function maskCalculation({ firstSymbols, inputNumbersValue, options }) {
   let formattedInputValue = firstSymbols;

   if (inputNumbersValue.length > +options.fb.from) {
      formattedInputValue += ' (' + inputNumbersValue.substring(+options.fb.from, +options.fb.to);
   }

   if (inputNumbersValue.length > +options.sb.from) {
      formattedInputValue += ') ' + inputNumbersValue.substring(+options.sb.from, +options.sb.to);
   }

   if (inputNumbersValue.length > +options.fn.from) {
      formattedInputValue += '-' + inputNumbersValue.substring(+options.fn.from, +options.fn.to);
   }

   if (inputNumbersValue.length > +options.sn.from) {
      formattedInputValue += '-' + inputNumbersValue.substring(+options.sn.from, +options.sn.to);
   }

   return formattedInputValue;
}
