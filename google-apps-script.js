/**
 * Google Apps Script — RSVP handler for wedding invitation.
 *
 * Deploy as Web App:
 * 1. Open https://script.google.com
 * 2. Create a new project, paste this code
 * 3. Replace SHEET_ID with your Google Spreadsheet ID
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL and paste it in lib/constants.ts as GOOGLE_SCRIPT_URL
 */

const SHEET_ID = "YOUR_GOOGLE_SPREADSHEET_ID";
const SHEET_NAME = "RSVP";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet =
      SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME) ||
      SpreadsheetApp.openById(SHEET_ID).insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Есімі", "Жауабы", "Адам саны", "Уақыты"]);
      sheet.getRange(1, 1, 1, 4).setFontWeight("bold");
    }

    sheet.appendRow([
      data.name,
      data.answer,
      data.guestCount || 1,
      data.timestamp || new Date().toISOString(),
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "ok" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok", message: "RSVP endpoint is running" })
  ).setMimeType(ContentService.MimeType.JSON);
}
