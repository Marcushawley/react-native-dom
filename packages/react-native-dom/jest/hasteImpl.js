/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

"use strict";

const path = require("path");

const ROOT = path.join(__dirname, "..") + path.sep;

const BLACKLISTED_PATTERNS /*: Array<RegExp>*/ = [
  /.*\/__(mocks|tests)__\/.*/,
  /.*\/Libraries\/Animated\/src\/polyfills\/.*/
];

const WHITELISTED_PREFIXES /*: Array<string>*/ = [
  "IntegrationTests",
  "Libraries",
  "ReactAndroid",
  "RNTester",
  "ReactDom",
  "node_modules/react-native/Libraries"
];

const NAME_REDUCERS /*: Array<[RegExp, string]>*/ = [
  // extract basename
  [/^(?:.*\/)?([a-zA-Z0-9$_.-]+)$/, "$1"],
  // strip .js/.js.flow suffix
  [/^(.*)\.js(\.flow)?$/, "$1"],
  [/^(.*)\.(android|ios|native|web|dom)$/, "$1"]
];

const haste = {
  /*
   * @return {string|void} hasteName for module at filePath; or undefined if
   *                       filePath is not a haste module
   */
  getHasteName(
    filePath /*: string*/,
    sourceCode /* : ?string*/
  ) /*: (string | void)*/ {
    if (!isHastePath(filePath)) {
      return undefined;
    }

    const hasteName = NAME_REDUCERS.reduce(
      (name, [pattern, replacement]) => name.replace(pattern, replacement),
      filePath
    );

    return hasteName;
  }
};

function isHastePath(filePath /*: string*/) /*: bool*/ {
  if (!filePath.endsWith(".js") && !filePath.endsWith(".js.flow")) {
    return false;
  }

  if (!filePath.startsWith(ROOT)) {
    return false;
  }

  filePath = filePath.substr(ROOT.length + 1);
  if (BLACKLISTED_PATTERNS.some((pattern) => pattern.test(filePath))) {
    return false;
  }
  return WHITELISTED_PREFIXES.some((prefix) => filePath.startsWith(prefix));
}

module.exports = haste;
