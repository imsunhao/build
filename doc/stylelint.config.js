module.exports = {
  "plugins": [
    "stylelint-scss"
  ],
  "rules": {
    "color-no-invalid-hex": true,
    "declaration-colon-space-after": ["always", {"severity": "warning"}],
    // "declaration-empty-line-before": "never", // 其实应该有，但是针对scss的变量需要例外
    "indentation": [2, {
      "severity": "warning",
      "except": ["value"],
      "ignore": ["inside-parens", "value"]
    }],
    "max-empty-lines": 2,
    "max-nesting-depth": 4,
    "block-no-empty": [true, { "severity": "warning" }],
    "block-opening-brace-space-after": "always-single-line",
    "block-opening-brace-newline-after": "always-multi-line",
    "block-closing-brace-empty-line-before": "never",
    "no-duplicate-selectors": true,
    "declaration-block-no-duplicate-properties": [true, {
      "ignore": "consecutive-duplicates"
    }],
    "declaration-block-no-redundant-longhand-properties": [true, { "severity": "warning" }],
    "declaration-block-semicolon-space-after": "always-single-line",
    "unit-whitelist": ["em", "rem", "%", "px", "pt", "deg", "vh", "vw", "s", "ms"],
    "scss/selector-no-redundant-nesting-selector": true
  }
}
