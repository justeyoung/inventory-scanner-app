const codeReader = new ZXing.BrowserBarcodeReader();
const videoElement = document.getElementById('video');
const itemNameEl = document.getElementById('itemName');
let lastScannedBarcode = "";

// Start barcode scanning
codeReader
  .decodeFromVideoDevice(null, videoElement, (result, err) => {
    if (result) {
      const code = result.getText();
      console.log("Scanned barcode:", code);
      lastScannedBarcode = code;
      lookupProductName(code);
    }
  })
  .catch(err => {
    console.error("Camera init error:", err);
    alert("Camera error: Please allow access or try another browser.");
  });

// Try Open Food Facts first, then fallback to UPCItemDB
function lookupProductName(barcode) {
  fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
    .then(res => res.json())
    .then(data => {
      const name = data?.product?.product_name;
      if (name) {
        itemNameEl.value = name;
      } else {
        // Fallback to UPCItemDB if not found
        fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`)
          .then(res => res.json())
          .then(upcData => {
            const fallbackName = upcData?.items?.[0]?.title;
            itemNameEl.value = fallbackName || "Failed to lookup item";
          })
          .catch(() => {
            itemNameEl.value = "Failed to lookup item";
          });
      }
    })
    .catch(() => {
      itemNameEl.value = "Failed to lookup item";
    });
}

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
    showToast("Item added successfully!");

    // Reset form
    document.getElementById('itemName').value = "";
    document.getElementById('quantity').value = "";
    document.getElementById('unit').value = "";
    document.getElementById('purchaseDate').value = new Date().toISOString().split("T")[0];
    document.getElementById('expiryDate').value = "";
    document.getElementById('location').value = "";
    document.getElementById('notes').value = "";
    lastScannedBarcode = "";

    itemNameEl.focus();
  })
  .catch(err => {
    console.error("Submit error:", err);
    alert("Failed to submit item.");
  });
}

// Toast message
function showToast(message) {
  let toast = document.createElement("div");
  toast.innerText = message;
  toast.style.position = "fixed";
  toast.style.bottom = "30px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "#4CAF50";
  toast.style.color = "#fff";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "6px";
  toast.style.fontSize = "14px";
  toast.style.zIndex = 1000;
  toast.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 2000);
}
