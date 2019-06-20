var rules = {
  "no-unused-vars": [
    "warn",
    {
      "varsIgnorePattern": "^__",
      "argsIgnorePattern": "^__"
    }
  ],
  "no-console": [
    "off"
  ],
  "prefer-const": [
    "warn"
  ],
}

var plugins = [
  "html",
  "vue"
]

module.exports = {
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "legacyDecorators": true,
      "experimentalObjectRestSpread": true
    }
  },
  "extends": [
    "eslint:recommended",
  ],
  "rules": rules,
  "plugins": plugins,
  "env": {
    "es6": true,
    "node": true,
    "browser": true,
  },
  "globals": {
    "window": false,
    "process": false,
    "document": false,
    "require": false,
    "console": false,
    "module": false,
    "Blob": false,
    "HTMLCollection": false,
    "Element": false,
    "NodeList": false,
    "Worker": false,
    "history": false,
    "Image": false,
    "ImageData": false,
    "Audio": false,
    "URL": false,
    "setInterval": false,
    "clearInterval": false,
    "location": false,
    "localStorage": false,
    "setTimeout": false,
    "__dirname": false,
    "Buffer": false,
    "__webpack_public_path__": true
  }
}
