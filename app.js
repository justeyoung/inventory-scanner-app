const codeReader = new ZXing.BrowserBarcodeReader();
const videoElement = document.getElementById('video');
const itemNameEl = document.getElementById('itemName');

// Store last scanned barcode
let lastScannedBarcode = "";

// Your Google Apps Script URL
const sheetEndpoint = "https://script.google.com/macros/s/AKfycbzU-hHQz3SiqivqTlSwsDX1NaDaKHSpzujWbxGMj6q9C1WP9AkJtTTtNZaklw1nTmTVBA/exec";

// Start barcode scanning
codeReader.decodeFromVideoDevice(null, videoElement, (result, err) => {
  if (result) {
    const code = result.getText();
    lastScannedBarcode = code; // Save for later
    fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${code}`)
      .then(res => res.json())
      .then(data => {
        const title = data.items?.[0]?.title || "Unknown item";
        itemNameEl.value = title;
      })
      .catch(() => {
        itemNameEl.value = "Failed to lookup item";
      });
  }
});

// Submit data to Google Sheet
function submitData() {
  const payload = {
    item: document.getElementById('itemName').value,
    barcode: lastScannedBarcode,
    quantity: document.getElementById('quantity').value,
    unit: document.getElementById('unit').value,
    purchaseDate: document.getElementById('purchaseDate').value,
    expiryDate: document.getElementById('expiryDate').value,
    location: document.getElementById('location').value,
    notes: document.getElementById('notes').value
  };

  fetch(sheetEndpoint, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" }
  })
  .then(response => {
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  })
  .then(data => {
    alert("Item added with ID #" + data.id);
    lastScannedBarcode = ""; // Reset
  })
  .catch(async (err) => {
    let errorMessage = "Unknown error";
    try {
      const text = await err?.response?.text?.();
      errorMessage = text || err.message;
    } catch (e) {
      errorMessage = err.message;
    }
    console.error("Submission error:", err);
    alert("Failed to add item.\n\n" + errorMessage);
  });
}
