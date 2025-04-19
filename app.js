const scriptURL = "https://script.google.com/macros/s/AKfycbzU-hHQz3SiqivqTlSwsDX1NaDaKHSpzujWbxGMj6q9C1WP9AkJtTTtNZaklw1nTmTVBA/exec";

let mode = "add";
let barcode = "";

function setMode(newMode) {
  mode = newMode;
  document.getElementById("modeAdd").classList.toggle("active", mode === "add");
  document.getElementById("modeRemove").classList.toggle("active", mode === "remove");

  // Clear form
  document.getElementById("itemName").value = "";
  document.getElementById("quantity").value = "1";
  document.getElementById("unit").value = "";
  document.getElementById("purchaseDate").value = "";
  document.getElementById("expiryDate").value = "";
  document.getElementById("notes").value = "";
  barcode = "";
}

function submitData() {
  const item = document.getElementById("itemName").value.trim();
  const qty = document.getElementById("quantity").value || "1";
  const unit = document.getElementById("unit").value;
  const purchaseDate = document.getElementById("purchaseDate").value;
  const expiryDate = document.getElementById("expiryDate").value;
  const location = document.getElementById("location").value;
  const notes = document.getElementById("notes").value;

  if (!item && !barcode) {
    alert("Please scan a barcode or enter an item name.");
    return;
  }

  const data = {
    mode,
    item,
    quantity: qty,
    unit,
    purchaseDate,
    expiryDate,
    location,
    barcode,
    notes
  };

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(response => {
      if (response.success) {
        alert(`${mode === "add" ? "Added" : "Removed"} successfully.`);
        document.getElementById("itemName").value = "";
        document.getElementById("quantity").value = "1";
        document.getElementById("unit").value = "";
        document.getElementById("purchaseDate").value = "";
        document.getElementById("expiryDate").value = "";
        document.getElementById("notes").value = "";
        barcode = "";
      } else {
        alert("Error: " + response.error);
      }
    })
    .catch(err => {
      console.error(err);
      alert("Failed to submit data.");
    });
}

// Barcode Scanner Setup
const codeReader = new ZXing.BrowserMultiFormatReader();
const videoElement = document.getElementById("video");

codeReader
  .listVideoInputDevices()
  .then(videoInputDevices => {
    const firstDeviceId = videoInputDevices[0]?.deviceId;
    if (firstDeviceId) {
      codeReader.decodeFromVideoDevice(firstDeviceId, videoElement, (result, err) => {
        if (result) {
          barcode = result.text;
          fetch(`${scriptURL}?lookup=${barcode}`)
            .then(res => res.json())
            .then(data => {
              if (data.item) {
                document.getElementById("itemName").value = data.item;
                document.getElementById("quantity").value = "1";
              } else {
                alert("Failed to look up item.");
              }
            })
            .catch(() => alert("Failed to look up item."));
        }
      });
    }
  })
  .catch(err => {
    console.error("Camera error", err);
  });

// Autofill quantity to 1 on typing item name
document.getElementById("itemName").addEventListener("input", () => {
  if (!document.getElementById("quantity").value) {
    document.getElementById("quantity").value = "1";
  }
});
