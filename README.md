# phone-mask-native

> The plugin activates the mask when entering telephone numbers. Most countries with mobile communications are supported, the numbers of countries that are not supported will be represented without a mask.

## Install

```shell
npm i phone-mask-native
```

## Import

```javascript
const phoneMaskNative = require("phone-mask-native");
```
or

```javascript
import phoneMaskNative from 'phone-mask-native'
```

## Option (selector)

Type: `string`<br>
Default: `input[data-phone-input]`<br>

The selector of the input fields of telephone numbers (you can also use the text input field).

## Usage

```javascript
const phoneMaskNative = require("phone-mask-native");

phoneMaskNative("your-selector");
```

or

```javascript
const phoneMaskNative = require("phone-mask-native");

phoneMaskNative();
```

## Note

Many thanks for the main idea and help to the web-developer Alexei Goloburdin.
