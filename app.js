// Load ZXing barcode reader
const codeReader = new ZXing.BrowserBarcodeReader();
const videoElement = document.getElementById('video');
const itemNameEl = document.getElementById('itemName');
let lastScannedBarcode = "";

// Start camera scanning
codeReader
  .decodeFromVideoDevice(null, videoElement, (result, err) => {
    if (result) {
      const code = result.getText();
      console.log("Scanned barcode:", code);
      lastScannedBarcode = code;

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
  })
  .catch(err => {
    console.error("Camera init error:", err);
    alert("Failed to access camera. Please allow permission or try another browser.");
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

  console.log("Payload to submit:", payload);

  fetch("https://script.google.com/macros/s/AKfycbzU-hHQz3SiqivqTlSwsDX1NaDaKHSpzujWbxGMj6q9C1WP9AkJtTTtNZaklw1nTmTVBA/exec", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
  .then(() => {
    alert("Item submitted!");
    // Reset form
    document.getElementById('itemName').value = "";
    document.getElementById('quantity').value = "";
    document.getElementById('unit').value = "";
    document.getElementById('purchaseDate').value = "";
    document.getElementById('expiryDate').value = "";
    document.getElementById('location').value = "";
    document.getElementById('notes').value = "";
    lastScannedBarcode = "";
  })
  .catch(err => {
    console.error("Error sending request:", err);
    alert("Failed to add item. (Fetch error)");
  });
}
