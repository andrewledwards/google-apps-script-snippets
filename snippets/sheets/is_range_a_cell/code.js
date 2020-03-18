/* eslint-disable camelcase */

/**
 * Checks if a range is a cell
 * @param {GoogleAppsScript.Spreadsheet.Range} range
 */
function isRangeACell_(range) {
  return !/:/.test(range.getA1Notation());
}

/**
 * Run the snippet
 */
function run_test() {
  const cell = SpreadsheetApp.getActive().getRange('B3');
  const range = SpreadsheetApp.getActive().getRange('B3:B4');
  const active = SpreadsheetApp.getActiveRange();
  console.log([cell, range, active].map(isRangeACell_));
}
