function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Inventory');
    const data = JSON.parse(e.postData.contents);

    const lastRow = sheet.getLastRow();
    let nextId = 1;
    if (lastRow > 1) {
      const lastId = sheet.getRange(lastRow, 1).getValue();
      nextId = parseInt(lastId) + 1;
    }

    const barcode = data.barcode ? String(data.barcode).padStart(8, "0") : "";

    const newRow = [
      nextId,
      data.item || "",
      barcode,
      data.quantity || "",
      data.unit || "",
      data.purchaseDate || "",
      data.expiryDate || "",
      data.location || "",
      data.notes || ""
    ];

    sheet.appendRow(newRow);

    return ContentService
      .createTextOutput("Success")
      .setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    return ContentService
      .createTextOutput("Error: " + error.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
