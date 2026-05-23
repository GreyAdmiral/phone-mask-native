# phone-mask-native

> The plugin activates the mask when entering telephone numbers. Most countries with mobile communications are supported, the numbers of countries that are not supported will be represented without a mask.

## Install

```shell
npm i phone-mask-native
```

## CDN

```html
<script src="https://cdn.jsdelivr.net/npm/phone-mask-native@1.1.3/dist/phone-mask-native.min.js"></script>
```

or

```html
<script src="https://unpkg.com/phone-mask-native@1.1.3/dist/phone-mask-native.min.js"></script>
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
