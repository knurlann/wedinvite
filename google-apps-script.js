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

const SHEET_ID = "16kmuUmuGsQcg5-nNDo1xMqK_6akpH5Q8S7nOn2wm0xY";
const SHEET_NAME = "RSVP";

function doPost(e) {
  try {
    var data;

    if (e.postData.type === "application/x-www-form-urlencoded") {
      data = {
        name: e.parameter.name,
        answer: e.parameter.answer,
        guestCount: e.parameter.guestCount,
        timestamp: e.parameter.timestamp,
      };
    } else {
      data = JSON.parse(e.postData.contents);
    }

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Есімі", "Жауабы", "Адам саны", "Уақыты"]);
      sheet.getRange(1, 1, 1, 4).setFontWeight("bold");
    }

    sheet.appendRow([
      data.name || "",
      data.answer || "",
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
