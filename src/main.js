/** @typedef {Record<'from' | 'to', string>} FromTo */

/** @typedef {Record<'fb' | 'sb' | 'fn' | 'sn', FromTo>} PhoneMaskScheme */

/**
 * @typedef {Object} PhoneNumber
 * @prop {string[]} numbers
 * @prop {'one' | 'two' | 'three'} scheme
 */

import options from './data/phonemasks.json';
import { onPhoneInput, onPhoneKeyDown, onPhonePaste } from './handlers.js';

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
