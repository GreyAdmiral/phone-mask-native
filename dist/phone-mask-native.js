var one = {
	fb: {
		from: "1",
		to: "4"
	},
	sb: {
		from: "4",
		to: "7"
	},
	fn: {
		from: "7",
		to: "9"
	},
	sn: {
		from: "9",
		to: "11"
	}
};
var two = {
	fb: {
		from: "2",
		to: "4"
	},
	sb: {
		from: "4",
		to: "7"
	},
	fn: {
		from: "7",
		to: "9"
	},
	sn: {
		from: "9",
		to: "11"
	}
};
var three = {
	fb: {
		from: "3",
		to: "5"
	},
	sb: {
		from: "5",
		to: "8"
	},
	fn: {
		from: "8",
		to: "10"
	},
	sn: {
		from: "10",
		to: "12"
	}
};
var options = {
	one: one,
	two: two,
	three: three
};

var phoneNumbers = [
	{
		scheme: "one",
		numbers: [
			"1",
			"7",
			"8"
		]
	},
	{
		scheme: "two",
		numbers: [
			"20",
			"30",
			"31",
			"32",
			"33",
			"34",
			"34",
			"36",
			"39",
			"40",
			"41",
			"43",
			"44",
			"45",
			"46",
			"47",
			"48",
			"49",
			"51",
			"52",
			"53",
			"54",
			"55",
			"56",
			"57",
			"58",
			"60",
			"61",
			"62",
			"63",
			"64",
			"65",
			"66",
			"90",
			"91",
			"92",
			"93",
			"94",
			"95",
			"98"
		]
	},
	{
		scheme: "three",
		numbers: [
			"211",
			"212",
			"212",
			"213",
			"216",
			"218",
			"220",
			"221",
			"222",
			"223",
			"224",
			"225",
			"226",
			"227",
			"228",
			"229",
			"230",
			"231",
			"232",
			"233",
			"234",
			"235",
			"236",
			"237",
			"238",
			"239",
			"240",
			"241",
			"242",
			"243",
			"244",
			"245",
			"246",
			"247",
			"248",
			"249",
			"250",
			"251",
			"252",
			"253",
			"254",
			"255",
			"256",
			"257",
			"258",
			"260",
			"261",
			"262",
			"263",
			"264",
			"265",
			"266",
			"267",
			"268",
			"269",
			"290",
			"291",
			"297",
			"298",
			"299",
			"350",
			"351",
			"352",
			"353",
			"354",
			"355",
			"356",
			"357",
			"358",
			"359",
			"370",
			"371",
			"372",
			"373",
			"374",
			"375",
			"376",
			"377",
			"378",
			"380",
			"381",
			"382",
			"385",
			"386",
			"387",
			"389",
			"420",
			"421",
			"423",
			"500",
			"501",
			"502",
			"503",
			"504",
			"505",
			"506",
			"507",
			"508",
			"509",
			"590",
			"591",
			"592",
			"593",
			"594",
			"595",
			"596",
			"597",
			"598",
			"599",
			"670",
			"673",
			"674",
			"675",
			"676",
			"677",
			"678",
			"679",
			"680",
			"681",
			"682",
			"683",
			"685",
			"686",
			"687",
			"688",
			"689",
			"690",
			"691",
			"692",
			"960",
			"961",
			"962",
			"963",
			"964",
			"965",
			"966",
			"967",
			"968",
			"970",
			"971",
			"972",
			"973",
			"974",
			"975",
			"976",
			"977",
			"979",
			"992",
			"993",
			"994",
			"995",
			"996",
			"997",
			"998",
			"999"
		]
	}
];

/**
 * @typedef {Object} phoneNumber
 * @prop {string[]} numbers
 * @prop {string} scheme
 */


const oneSymbols = phoneNumbers.find((it) => isOneNumbers(it));
const otherSymbols = phoneNumbers.filter((it) => !isOneNumbers(it));

/**
 * @param {string} [selector='input[data-phone-input]']
 */
function main (selector = 'input[data-phone-input]') {
   const init = () => {
      const phoneInputs = document.querySelectorAll(selector);

      options['handleEvent'] = onPhoneInput;

      for (const input of phoneInputs) {
         const isInput = input instanceof HTMLInputElement;

         if (!isInput) {
            console.error('phoneMaskNative: Элемент быть полем ввода! Элемент: ', input);
            continue;
         }

         const { type } = input;
         const isValidation = type === 'tel' || type === 'text';

         if (!isValidation) {
            console.error('phoneMaskNative: Поле ввода должно иметь атрибут type со значениями tel либо text! Поле: ', input);
            continue;
         }

         input.addEventListener('keydown', onPhoneKeyDown);
         input.addEventListener('input', options);
         input.addEventListener('paste', onPhonePaste);
      }
   };

   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init, { once: true });
   } else {
      init();
   }
}

/**
 * @param {HTMLInputElement} input
 * @returns {string}
 */
function getInputNumbersValue(input) {
   return input.value.replace(/\D/g, '');
}

function onPhoneKeyDown(e) {
   const inputValue = e.target.value.replace(/\D/g, '');

   if (e.keyCode == 8 && inputValue.length == 1) {
      e.target.value = '';
   }
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
   } else if (isHasInArray(inputNumbersValue, getAllNunmbers(otherSymbols))) {
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
function getAllNunmbers(array) {
   return array.reduce((acc, { numbers }) => [...acc, ...numbers], []);
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

export { main as default };
