<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Fridge Inventory</title>
  <style>
    body {
      font-family: sans-serif;
      padding: 20px;
      max-width: 500px;
      margin: auto;
    }

    .mode-toggle {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;
    }

    .mode-toggle button {
      flex: 1;
      padding: 10px;
      margin: 0 5px;
      font-weight: bold;
      border: 2px solid #4CAF50;
      background-color: #fff;
      color: #4CAF50;
      border-radius: 5px;
      cursor: pointer;
    }

    .mode-toggle button.active {
      background-color: #4CAF50;
      color: #fff;
    }

    video {
      width: 100%;
      margin-bottom: 15px;
    }

    label {
      font-weight: bold;
      margin-top: 10px;
      display: block;
    }

    input, select, button {
      width: 100%;
      padding: 8px;
      margin-bottom: 12px;
    }

    .date-row {
      display: flex;
      gap: 10px;
      margin-bottom: 12px;
    }

    .date-row .date-group {
      flex: 1;
    }
  </style>
</head>
<body>

  <h2>Fridge Inventory</h2>

  <!-- Mode Toggle -->
  <div class="mode-toggle">
    <button id="modeAdd" class="active" onclick="setMode('add')">Add</button>
    <button id="modeRemove" onclick="setMode('remove')">Remove</button>
  </div>

  <!-- Camera feed -->
  <video id="video" autoplay muted playsinline></video>

  <!-- Item Form -->
  <input id="itemName" placeholder="Item name" />
  <input id="quantity" placeholder="Quantity" value="1" />
  <input id="unit" placeholder="Unit (e.g. pcs, g)" />

  <!-- Dates Row -->
  <div class="date-row">
    <div class="date-group">
      <label for="purchaseDate">Purchase Date</label>
      <input id="purchaseDate" type="date" />
    </div>
    <div class="date-group">
      <label for="expiryDate">Expiry Date</label>
      <input id="expiryDate" type="date" />
    </div>
  </div>

  <!-- Location Dropdown -->
  <label for="location">Location</label>
  <select id="location">
    <option value="Freezer (garage)">Freezer (garage)</option>
    <option value="Freezer (dining room)">Freezer (dining room)</option>
    <option value="Fridge (dining room)">Fridge (dining room)</option>
    <option value="Fridge (kitchen)">Fridge (kitchen)</option>
  </select>

  <input id="notes" placeholder="Notes" />
  <button onclick="submitData()">Submit</button>

  <!-- Scripts -->
  <script src="https://unpkg.com/@zxing/library@latest"></script>
  <script src="app.js"></script>
</body>
</html>
