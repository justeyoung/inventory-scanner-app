const codeReader = new ZXing.BrowserBarcodeReader();
const videoElement = document.getElementById('video');
const itemNameEl = document.getElementById('itemName');

const sheetEndpoint = "https://script.google.com/macros/s/AKfycbzU-hHQz3SiqivqTlSwsDX1NaDaKHSpzujWbxGMj6q9C1WP9AkJtTTtNZaklw1nTmTVBA/exec";

codeReader.decodeFromVideoDevice(null, videoElement, (result, err) => {
  if (result) {
    const code = result.getText();
    fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${code}`)
      .then(res => res.json())
      .then(data => {
        const title = data.items?.[0]?.title || "Unknown item";
        itemNameEl.textContent = title;
        itemNameEl.dataset.value = title;
      })
      .catch(() => {
        itemNameEl.textContent = "Failed to lookup item";
      });
  }
});

function submitData() {
  const payload = {
    item: itemNameEl.dataset.value || '',
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
  .then(() => alert("Item added!"))
  .catch(() => alert("Failed to add item."));
}
