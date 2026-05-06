/**
 * Self-Love Journaling Bot - Google Apps Script
 *
 * Two triggers required in Apps Script:
 *   1. syncDailyQuestion → Time-driven trigger, daily (e.g. 8 AM)
 *   2. onSubmit          → From form, on form submit
 */

/**
 * Reads today's writing prompt from the Google Sheet
 * and updates the Google Form question title.
 *
 * Source: 365 Days of Writing Prompts by The Daily Post
 * Sheet columns: [Date, Prompt]
 */
function syncDailyQuestion() {
  const ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1fnFgVTW-Epzc_t51UD-z-xEKbmkphnJ06TiNkYZmPtM/edit");
  const sheet = ss.getSheetByName("Writing Prompts");
  const data = sheet.getDataRange().getValues();

  // Get today's date formatted as "MMMM dd" (e.g., "May 06")
  const todayFormatted = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MMMM dd");

  let todaysQuestion = "";

  // Loop through rows to find today's prompt
  for (let i = 1; i < data.length; i++) {
    let rowDateText = data[i][0].toString();

    if (rowDateText.includes(todayFormatted)) {
      todaysQuestion = data[i][1];
      break;
    }
  }

  // Update the form question title if a prompt was found
  if (todaysQuestion !== "") {
    const form = FormApp.getActiveForm();
    const questionId = "YOUR_QUESTION_ID";

    form.getItemById(questionId).setTitle("Prompt of the day: \"" + todaysQuestion + "\"");
    console.log("Success! Match found for " + todayFormatted + ". Updated to: " + todaysQuestion);
  } else {
    console.log("Still no match for: " + todayFormatted + ". Check if your sheet says '" + todayFormatted + "'");
  }
}

/**
 * Triggered on every Google Form submission.
 * Sends the response data to the n8n webhook for processing.
 */
function onSubmit(e) {
  // Switch between production and test webhook URLs as needed
  var url = "WEBHOOK_URL";

  var data = {};

  if (e && e.response) {
    var itemResponses = e.response.getItemResponses();
    data["timestamp"] = e.response.getTimestamp();

    for (var i = 0; i < itemResponses.length; i++) {
      var itemResponse = itemResponses[i];
      data[itemResponse.getItem().getTitle()] = itemResponse.getResponse();
    }
  } else {
    data = { "debug": "Still no event data - check if trigger is set to 'From Form'" };
  }

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(data)
  };

  UrlFetchApp.fetch(url, options);
}
