const scriptURL = "https://script.google.com/macros/s/AKfycbzU-hHQz3SiqivqTlSwsDX1NaDaKHSpzujWbxGMj6q9C1WP9AkJtTTtNZaklw1nTmTVBA/exec";

// Highlight update result
function flashCell(cell, success) {
  const originalColor = cell.style.backgroundColor;
  cell.style.backgroundColor = success ? "#d4edda" : "#f8d7da";
  setTimeout(() => {
    cell.style.backgroundColor = originalColor;
  }, 800);
}

// Format date as dd/mm/yy
function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return isNaN(date) ? "" : date.toLocaleDateString("en-GB");
}

// Load and render inventory
async function loadInventory() {
  const res = await fetch(scriptURL);
  const rawData = await res.json();

  const header = rawData[0];
  const data = rawData.slice(1);

  const grouped = {};
  data.forEach((row, index) => {
    const location = row[7] || "Unspecified";
    if (!grouped[location]) grouped[location] = [];
    grouped[location].push([index + 1, ...row]);
  });

  let html = "";
  for (const location in grouped) {
    html += `<h3 class="location-title">${location}</h3>`;
    html += `
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Purchase Date</th>
            <th>Expiry Date</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
    `;
    grouped[location].forEach((row, i) => {
      html += `<tr data-row="${row[1]}">`;
      html += `<td>${i + 1}</td>`;
      html += `<td>${row[2]}</td>`;
      html += `<td contenteditable="true" data-col="3">${row[3]}</td>`;
      html += `<td contenteditable="true" data-col="4">${row[4]}</td>`;
      html += `<td contenteditable="true" data-col="5">${formatDate(row[5])}</td>`;
      html += `<td contenteditable="true" data-col="6">${formatDate(row[6])}</td>`;
      html += `<td contenteditable="true" data-col="8">${row[8] || ""}</td>`;
      html += `</tr>`;
    });
    html += "</tbody></table>";
  }

  document.getElementById("inventoryTable").innerHTML = html;

  document.querySelectorAll("td[contenteditable='true']").forEach(cell => {
    cell.addEventListener("blur", async () => {
      const row = cell.closest("tr").dataset.row;
      const col = cell.dataset.col;
      const value = cell.innerText.trim();

      const response = await fetch(scriptURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          row: parseInt(row),
          col: parseInt(col),
          value: value
        })
      });

      const result = await response.json();
      flashCell(cell, result.success);
    });
  });
}

// Kick things off
loadInventory();
