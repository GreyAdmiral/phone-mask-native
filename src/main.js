/**
 * @typedef {Object} phoneNumber
 * @prop {string[]} numbers
 * @prop {string} scheme
 */

import options from './phonemasks.json';
import phoneNumbers from './phonenumbers.json';
const oneSymbols = phoneNumbers.find((it) => isOneNumbers(it));
const otherSymbols = phoneNumbers.filter((it) => !isOneNumbers(it));

/**
 * @param {string} [selector='input[data-phone-input]']
 */
export default function (selector = 'input[data-phone-input]') {
   document.addEventListener('DOMContentLoaded', function () {
      const phoneInputs = document.querySelectorAll(selector);

      options['handleEvent'] = onPhoneInput;

      phoneInputs.forEach((it) => {
         it.addEventListener('keydown', onPhoneKeyDown);
         it.addEventListener('input', options);
         it.addEventListener('paste', onPhonePaste);
      });
   });
}

/**
 * @param {HTMLInputElement} input
 * @returns {string}
 */
function getInputNumbersValue(input) {
   return input.value.replace(/\D/g, '');
}

/**
 * @param {ClipboardEventInit} e
 */
function onPhonePaste(e) {
   const { target: input } = e;
   const pasted = e.clipboardData;
   let inputNumbersValue = getInputNumbersValue(input);

   if (pasted) {
      const pastedText = pasted.getData('Text');

      if (/\D/g.test(pastedText)) {
         input.value = inputNumbersValue;
         return;
      }
   }
}

function onPhoneInput(e) {
   const input = e.target;
   const selectionStart = input.selectionStart;
   let inputNumbersValue = getInputNumbersValue(input);
   let formattedInputValue = '';

   if (!inputNumbersValue) {
      input.value = '';
      return;
   }

   if (input.value.length != selectionStart) {
      if (e.data && isNaN(+e.data)) {
         input.setSelectionRange(input.selectionStart - 1, input.selectionStart, 'backward');
         input.setRangeText('');
      }

      return;
   }

   if (oneSymbols?.numbers.includes(inputNumbersValue[0])) {
      const firstSymbols = inputNumbersValue[0] === '8' ? '8' : `+${inputNumbersValue[0]}`;

      renderMask(firstSymbols, this.one);
   } else if (isHasInArray(inputNumbersValue, getAllNunmber(otherSymbols))) {
      for (const { numbers, scheme } of otherSymbols) {
         if (isHasInArray(inputNumbersValue, numbers)) {
            const [sample] = numbers;
            const length = (sample && sample.length) || 0;
            const firstSymbols = `+${inputNumbersValue.substring(0, length)}`;
            renderMask(firstSymbols, options[scheme]);
            break;
         }
      }
   } else {
      if (inputNumbersValue) {
         formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
      }
   }

   input.value = formattedInputValue;

   function renderMask(firstSymbols, opt) {
      formattedInputValue = input.value = firstSymbols;

      if (inputNumbersValue.length > +opt.fb.from) {
         formattedInputValue += ' (' + inputNumbersValue.substring(+opt.fb.from, +opt.fb.to);
      }

      if (inputNumbersValue.length > +opt.sb.from) {
         formattedInputValue += ') ' + inputNumbersValue.substring(+opt.sb.from, +opt.sb.to);
      }

      if (inputNumbersValue.length > +opt.fn.from) {
         formattedInputValue += '-' + inputNumbersValue.substring(+opt.fn.from, +opt.fn.to);
      }

      if (inputNumbersValue.length > +opt.sn.from) {
         formattedInputValue += '-' + inputNumbersValue.substring(+opt.sn.from, +opt.sn.to);
      }
   }
}

function onPhoneKeyDown(e) {
   const inputValue = e.target.value.replace(/\D/g, '');

   if (e.keyCode == 8 && inputValue.length == 1) {
      e.target.value = '';
   }
}

/**
 * @param {string} value
 * @param {string[]} array
 * @returns {boolean}
 */
function isHasInArray(value, array) {
   return array.some((num) => value.startsWith(num));
}

/**
 * @param {Array<phoneNumber>} array
 * @returns {string[]}
 */
function getAllNunmber(array) {
   return array.reduce((acc, { numbers }) => [...acc, ...numbers], []);
}

/**
 * @param {phoneNumber} numbers
 * @returns {boolean}
 */
function isOneNumbers({ numbers }) {
   const [sample] = numbers;
   const length = (sample && sample.length) || 0;

   return length === 1;
}
