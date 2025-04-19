let currentMode = 'add';
let lastScannedBarcode = "";
const codeReader = new ZXing.BrowserBarcodeReader();
const videoElement = document.getElementById('video');
const itemNameEl = document.getElementById('itemName');

// Start barcode scanning
codeReader
  .decodeFromVideoDevice(null, videoElement, (result, err) => {
    if (result) {
      const code = result.getText();
      console.log("Scanned barcode:", code);
      lastScannedBarcode = code;

      document.getElementById('quantity').value = "1";
      lookupProductName(code);
    }
  })
  .catch(err => {
    console.error("Camera init error:", err);
    alert("Camera error: Please allow access or try another browser.");
  });

// Lookup product name
function lookupProductName(barcode) {
  fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
    .then(res => res.json())
    .then(data => {
      const name = data?.product?.product_name;
      if (name) {
        itemNameEl.value = name;
      } else {
        fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`)
          .then(res => res.json())
          .then(upcData => {
            const fallbackName = upcData?.items?.[0]?.title;
            itemNameEl.value = fallbackName || "Unknown item";
          })
          .catch(() => {
            itemNameEl.value = "Unknown item";
          });
      }
    })
    .catch(() => {
      itemNameEl.value = "Unknown item";
    });
}

// Auto-fill quantity = 1 on manual typing (always)
let quantityTouched = false;
itemNameEl.addEventListener("input", () => {
  const quantityInput = document.getElementById('quantity');
  if (!quantityTouched && quantityInput.value === "") {
    quantityInput.value = "1";
    quantityTouched = true;
  }
});

// Submit data (with Remove confirmation)
function submitData() {
  const itemName = document.getElementById('itemName').value.trim();
  const quantity = document.getElementById('quantity').value.trim();

  // Accept either barcode or typed item
  if (itemName === "" && lastScannedBarcode === "") {
    alert("Please enter an item name or scan a barcode.");
    return;
  }

  if (currentMode === 'remove') {
    const confirmMsg = `Are you sure you want to remove ${quantity || 1} × ${itemName || 'this item'}?`;
    if (!confirm(confirmMsg)) return;
  }

  const payload = {
    mode: currentMode,
    item: itemName,
    barcode: lastScannedBarcode,
    quantity: quantity,
    unit: document.getElementById('unit').value,
    purchaseDate: document.getElementById('purchaseDate').value,
    expiryDate: document.getElementById('expiryDate').value,
    location: document.getElementById('location').value,
    notes: document.getElementById('notes').value
  };

  console.log("Submitting:", payload);

  fetch("https://script.google.com/macros/s/AKfycbzU-hHQz3SiqivqTlSwsDX1NaDaKHSpzujWbxGMj6q9C1WP9AkJtTTtNZaklw1nTmTVBA/exec", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
  .then(() => {
    showToast(currentMode === 'add' ? "Item added" : "Item removed");
    resetForm();
    lastScannedBarcode = "";
  })
  .catch(err => {
    console.error("Submit error:", err);
    alert("Failed to submit item.");
  });
}

// Reset form after submission
function resetForm() {
  document.getElementById('itemName').value = "";
  document.getElementById('quantity').value = "";
  document.getElementById('unit').value = "";
  document.getElementById('purchaseDate').value = new Date().toISOString().split("T")[0];
  document.getElementById('expiryDate').value = "";
  document.getElementById('location').value = "";
  document.getElementById('notes').value = "";
  quantityTouched = false;
  itemNameEl.focus();
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

// Auto-fill today's date
function setDefaultDate() {
  document.getElementById('purchaseDate').value = new Date().toISOString().split("T")[0];
}

window.addEventListener('DOMContentLoaded', () => {
  setDefaultDate();
});

// Toggle between add/remove mode
function setMode(mode) {
  currentMode = mode;
  document.getElementById('modeAdd').classList.remove('active');
  document.getElementById('modeRemove').classList.remove('active');

  if (mode === 'add') {
    document.getElementById('modeAdd').classList.add('active');
    showToast("Switched to Add mode");
  } else {
    document.getElementById('modeRemove').classList.add('active');
    showToast("Switched to Remove mode");
  }

  resetForm();
}
