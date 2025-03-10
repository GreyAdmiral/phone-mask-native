// @ts-check
const options = require("./phonemasks.json");
const phoneNumbers = require("./phonenumbers.json");
const oneSymbols = phoneNumbers.find((it) => isOneNumbers(it));
const otherSymbols = phoneNumbers.filter((it) => !isOneNumbers(it));
module.exports = function (sel) {
   document.addEventListener("DOMContentLoaded", function () {
      const selector = sel || "input[data-phone-input]";
      const phoneInputs = document.querySelectorAll(selector);
      options["handleEvent"] = onPhoneInput;
      phoneInputs.forEach((it) => {
         it.addEventListener("keydown", onPhoneKeyDown);
         it.addEventListener("input", options);
         it.addEventListener("paste", onPhonePaste);
      });
   });
};
function getInputNumbersValue(input) {
   return input.value.replace(/\D/g, "");
}
function onPhonePaste(e) {
   const input = e.target;
   const pasted = e.clipboardData;
   let inputNumbersValue = getInputNumbersValue(input);
   if (pasted) {
      const pastedText = pasted.getData("Text");
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
   let formattedInputValue = "";
   if (!inputNumbersValue) {
      input.value = "";
      return;
   }
   if (input.value.length != selectionStart) {
      if (e.data && isNaN(+e.data)) {
         input.setSelectionRange(input.selectionStart - 1, input.selectionStart, "backward");
         input.setRangeText("");
      }
      return;
   }
   if (oneSymbols?.numbers.includes(inputNumbersValue[0])) {
      const firstSymbols = inputNumbersValue[0] === "8" ? "8" : `+${inputNumbersValue[0]}`;
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
         formattedInputValue = "+" + inputNumbersValue.substring(0, 16);
      }
   }
   input.value = formattedInputValue;
   function renderMask(firstSymbols, opt) {
      formattedInputValue = input.value = firstSymbols;
      if (inputNumbersValue.length > +opt.fb.from) {
         formattedInputValue += " (" + inputNumbersValue.substring(+opt.fb.from, +opt.fb.to);
      }
      if (inputNumbersValue.length > +opt.sb.from) {
         formattedInputValue += ") " + inputNumbersValue.substring(+opt.sb.from, +opt.sb.to);
      }
      if (inputNumbersValue.length > +opt.fn.from) {
         formattedInputValue += "-" + inputNumbersValue.substring(+opt.fn.from, +opt.fn.to);
      }
      if (inputNumbersValue.length > +opt.sn.from) {
         formattedInputValue += "-" + inputNumbersValue.substring(+opt.sn.from, +opt.sn.to);
      }
   }
}
function onPhoneKeyDown(e) {
   const inputValue = e.target.value.replace(/\D/g, "");
   if (e.keyCode == 8 && inputValue.length == 1) {
      e.target.value = "";
   }
}
function isHasInArray(value, array) {
   return array.some((num) => value.startsWith(num));
}
function getAllNunmber(array) {
   return array.reduce((acc, { numbers }) => [...acc, ...numbers], []);
}
function isOneNumbers({numbers}) {
   const [sample] = numbers;
   const length = (sample && sample.length) || 0;
   return length === 1;
}
