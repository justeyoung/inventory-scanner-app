let selectedMode = 'add';
let currentStream;

function setMode(mode) {
  selectedMode = mode;
  document.getElementById("modeAdd").classList.remove("active");
  document.getElementById("modeRemove").classList.remove("active");
  document.getElementById("mode" + mode.charAt(0).toUpperCase() + mode.slice(1)).classList.add("active");

  if (selectedMode === 'remove') {
    document.getElementById("video").classList.add("hidden");
  } else {
    document.getElementById("video").classList.remove("hidden");
    startCamera();
  }

  resetForm();
}

function resetForm() {
  document.getElementById("itemName").value = "";
  document.getElementById("quantity").value = "1";
  document.getElementById("unit").value = "";
  document.getElementById("purchaseDate").valueAsDate = new Date();
  document.getElementById("expiryDate").value = "";
  document.getElementById("notes").value = "";
}

function submitData() {
  const itemName = document.getElementById("itemName").value.trim();
  const quantity = document.getElementById("quantity").value.trim() || "1";
  const unit = document.getElementById("unit").value.trim();
  const purchaseDate = document.getElementById("purchaseDate").value;
  const expiryDate = document.getElementById("expiryDate").value;
  const location = document.getElementById("location").value;
  const notes = document.getElementById("notes").value.trim();

  if (!itemName) {
    alert("Please enter an item name.");
    return;
  }

  if (selectedMode === "remove") {
    const confirmed = confirm(`Are you sure you want to remove "${itemName}" from your inventory?`);
    if (!confirmed) return;
  }

  const payload = {
    action: selectedMode === "add" ? "addItem" : "removeItem",
    itemName,
    quantity,
    unit,
    purchaseDate,
    expiryDate,
    location,
    notes
  };

  fetch("https://script.google.com/macros/s/AKfycbzU-hHQz3SiqivqTlSwsDX1NaDaKHSpzujWbxGMj6q9C1WP9AkJtTTtNZaklw1nTmTVBA/exec", {
    method: "POST",
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(response => {
      if (response.success) {
        alert("Item submitted!");
        resetForm();
      } else {
        alert("Failed to submit item.");
      }
    })
    .catch(err => {
      console.error("Error:", err);
      alert("Error submitting item.");
    });
}

function startCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

  const video = document.getElementById("video");

  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
      currentStream = stream;
      video.srcObject = stream;
      video.setAttribute("playsinline", true);
      video.play();

      const codeReader = new ZXing.BrowserBarcodeReader();
      codeReader.decodeFromVideoDevice(null, video, result => {
        if (result) {
          const barcode = result.text;
          fetchProductFromBarcode(barcode);
        }
      });
    })
    .catch(err => {
      console.error("Camera error:", err);
    });
}

function fetchProductFromBarcode(barcode) {
  // Replace with actual barcode lookup or manually add logic
  console.log("Scanned barcode:", barcode);
  document.getElementById("itemName").value = "";
}
