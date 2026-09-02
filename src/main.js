/** @typedef {Record<'from' | 'to', string>} FromTo */

/** @typedef {Record<'fb' | 'sb' | 'fn' | 'sn', FromTo>} PhoneMaskScheme */

/**
 * @typedef {Object} PhoneNumber
 * @prop {string[]} numbers
 * @prop {'one' | 'two' | 'three'} scheme
 */

import options from './data/phonemasks.json';
import phoneNumbers from './data/phonenumbers.json';

const supportedInputs = ['tel', 'text'];

/**
 * @param {string} [selector='input[data-phone-input]']
 */
export default function (selector = 'input[data-phone-input]') {
   const init = () => {
      const phoneInputs = document.querySelectorAll(selector);

      for (const input of phoneInputs) {
         const isInput = input instanceof HTMLInputElement;

         if (!isInput) {
            console.error('phoneMaskNative: Элемент быть полем ввода! Элемент: ', input);
            continue;
         }

         if (!supportedInputs.includes(input.type)) {
            console.error('phoneMaskNative: Поле ввода должно иметь атрибут type со значениями tel либо text! Поле: ', input);
            continue;
         }

         input.addEventListener('keydown', onPhoneKeyDown);
         input.addEventListener('input', onPhoneInput.bind(options));
         input.addEventListener('paste', onPhonePaste);
      }
   };

   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init, { once: true });
   } else {
      init();
   }
}

const oneSymbols = phoneNumbers.find((it) => isOneNumbers(it));
const otherSymbols = /** @type {PhoneNumber[]} */ (phoneNumbers.filter((it) => !isOneNumbers(it)));

/**
 * @param {HTMLInputElement} input
 * @returns {string}
 */
function getInputNumbersValue(input) {
   return input.value.replace(/\D/g, '');
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
 * @param {Array<PhoneNumber>} array
 * @returns {string[]}
 */
function getAllNunmbers(array) {
   return array.reduce((acc, { numbers }) => acc.concat(numbers), []);
}

/**
 * @param {{numbers: Array<string>}} numbers
 * @returns {boolean}
 */
function isOneNumbers({ numbers }) {
   const [sample] = numbers;
   const length = (sample && sample.length) || 0;

   return length === 1;
}

/**
 * @param {KeyboardEvent} e
 */
function onPhoneKeyDown(e) {
   const input = /** @type {HTMLInputElement} */ (e.target);
   const inputValue = input.value.replace(/\D/g, '');

   if (e.keyCode == 8 && inputValue.length == 1) {
      input.value = '';
   }
}

/**
 * @param {ClipboardEventInit} e
 */
function onPhonePaste(e) {
   const { target: input } = e;
   const { clipboardData: pasted } = e;
   if (!pasted) return;
   const inputNumbersValue = getInputNumbersValue(input);
   const pastedText = pasted.getData('Text');

   if (/\D/g.test(pastedText)) {
      input.value = inputNumbersValue;
      return;
   }
}

/**
 * @param {InputEvent} e
 */
function onPhoneInput(e) {
   const input = e.target;
   if (!input || !input.selectionStart) return;
   let inputNumbersValue = getInputNumbersValue(input);
   let formattedInputValue = '';

   if (!inputNumbersValue) {
      input.value = '';
      return;
   }

   if (input.value.length != input.selectionStart) {
      if ((e.data && isNaN(+e.data)) || inputNumbersValue.length >= 21) {
         input.setSelectionRange(input.selectionStart - 1, input.selectionStart, 'backward');
         input.setRangeText('');
      }

      return;
   }

   if (oneSymbols?.numbers.includes(inputNumbersValue[0])) {
      const firstSymbols = inputNumbersValue[0] === '8' ? '8' : `+${inputNumbersValue[0]}`;

      formattedInputValue = input.value = firstSymbols;
      formattedInputValue = maskCalculation({ firstSymbols, inputNumbersValue, options: this.one });
   } else if (isHasInArray(inputNumbersValue, getAllNunmbers(otherSymbols))) {
      for (const { numbers, scheme } of otherSymbols) {
         if (isHasInArray(inputNumbersValue, numbers)) {
            const [sample] = numbers;
            const length = (sample && sample.length) || 0;
            const firstSymbols = `+${inputNumbersValue.substring(0, length)}`;

            formattedInputValue = input.value = firstSymbols;
            formattedInputValue = maskCalculation({ firstSymbols, inputNumbersValue, options: options[scheme] });
            break;
         }
      }
   } else {
      if (inputNumbersValue) {
         formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
      }
   }

   input.value = formattedInputValue;
}

/**
 * @param {{firstSymbols: string, inputNumbersValue: string, options: PhoneMaskScheme}} arguments
 * @returns {string}
 */
function maskCalculation({ firstSymbols, inputNumbersValue, options }) {
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
