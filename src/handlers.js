/** @typedef {Record<'from' | 'to', string>} FromTo */

/** @typedef {Record<'fb' | 'sb' | 'fn' | 'sn', FromTo>} PhoneMaskScheme */

/**
 * @typedef {Object} PhoneNumber
 * @prop {string[]} numbers
 * @prop {'one' | 'two' | 'three'} scheme
 */

import options from './data/phonemasks.json';
import { getAllNunmbers, getInputNumbersValue, isHasInArray, maskCalculation, oneSymbols, otherSymbols } from './helpers.js';

/**
 * @param {KeyboardEvent} e
 */
export function onPhoneKeyDown(e) {
   const input = /** @type {HTMLInputElement} */ (e.target);
   const inputValue = input.value.replace(/\D/g, '');

   if (e.keyCode == 8 && inputValue.length == 1) {
      input.value = '';
   }
}

/**
 * @param {ClipboardEventInit} e
 */
export function onPhonePaste(e) {
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
export function onPhoneInput(e) {
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
