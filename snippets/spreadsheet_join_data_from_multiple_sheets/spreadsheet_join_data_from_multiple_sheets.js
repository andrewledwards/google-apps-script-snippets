/* exported joinDataFromMultipleSheets_, example1, example2 */

/**
 * Join data from multiple sheets
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet[]} sheets The list of sheets
 * @param {joinDataReducerCallback} reducer The callback that handles data of sheets
 * @param {object[]} [headers=[]] The expected headers
 */

function joinDataFromMultipleSheets_(sheets, reducer, headers) {
  var headers_;
  if (!headers || !headers.length) {
    headers_ = [];
    headers = [];
  } else {
    headers_ = [headers];
  }
  if (!reducer) {
    var columnsCount = headers.length || sheets[0].getLastColumn() || 1;
    reducer = function(accumulator, sheet) {
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        var values = sheet
          .getRange(2, 1, lastRow - 1, columnsCount)
          .getValues();
        accumulator = accumulator.concat(values);
      }
      return accumulator;
    };
  }
  return sheets.reduce(reducer, headers_);
}

/**
 * Runs the example1
 * Logs data from all sheets of the current spreadsheet
 * @ignore
 */
function example1() {
  var activeSpreadsheet = SpreadsheetApp.getActive();
  var data = joinDataFromMultipleSheets_(activeSpreadsheet.getSheets());
  Logger.log(data);
}

/**
 * Runcs the example2
 * Set values to Sheet1 from all sheets of the current spreadsheet
 * @ignore
 */
function example2() {
  var activeSpreadsheet = SpreadsheetApp.getActive();
  var destName = 'Sheet1';
  var dest = activeSpreadsheet.getSheetByName(destName);
  var headers = ['Source', 'Column1', 'Column2'];
  var columnsCount = headers.length;
  var reducer = function(accumulator, sheet) {
    var sheetName = sheet.getName();
    var lastRow = sheet.getLastRow();
    if (sheetName !== destName && lastRow > 1) {
      var values = sheet
        .getRange(2, 1, lastRow - 1, columnsCount - 1)
        .getValues()
        .map(function(row) {
          return [].concat(sheetName, row);
        });
      accumulator = accumulator.concat(values);
    }
    return accumulator;
  };
  var data = joinDataFromMultipleSheets_(
    activeSpreadsheet.getSheets(),
    reducer,
    headers
  );
  if (data.length)
    dest
      .clearContents()
      .getRange(1, 1, data.length, data[0].length)
      .setValues(data);
}

/**
 * This callback is displayed as a global member.
 * @callback joinDataReducerCallback
 * @param {object[][]} accumulator Accumulates data
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet The current sheet of an iteration
 * @param {number} index The index of an iteration
 */