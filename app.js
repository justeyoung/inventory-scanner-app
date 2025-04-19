<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Inventory Viewer</title>
  <style>
    body {
      font-family: sans-serif;
      padding: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    th, td {
      border: 1px solid #ccc;
      padding: 6px;
      text-align: left;
    }

    th {
      background-color: #f2f2f2;
    }

    .location-title {
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <h2>Inventory Viewer</h2>
  <div id="inventoryTable">Loading...</div>

  <script>
    const scriptURL = "https://script.google.com/macros/s/AKfycbzU-hHQz3SiqivqTlSwsDX1NaDaKHSpzujWbxGMj6q9C1WP9AkJtTTtNZaklw1nTmTVBA/exec";

    function formatDate(dateStr) {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return isNaN(date) ? "" : date.toLocaleDateString("en-GB");
    }

    async function loadInventory() {
      try {
        const res = await fetch(scriptURL);
        const rawData = await res.json();
        const header = rawData[0];
        const data = rawData.slice(1);

        const grouped = {};
        data.forEach((row) => {
          const location = row[7] || "Unspecified";
          if (!grouped[location]) grouped[location] = [];
          grouped[location].push(row);
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
            html += `<tr>`;
            html += `<td>${i + 1}</td>`;
            html += `<td>${row[1]}</td>`;
            html += `<td>${row[3]}</td>`;
            html += `<td>${row[4]}</td>`;
            html += `<td>${formatDate(row[5])}</td>`;
            html += `<td>${formatDate(row[6])}</td>`;
            html += `<td>${row[8] || ""}</td>`;
            html += `</tr>`;
          });
          html += "</tbody></table>";
        }

        document.getElementById("inventoryTable").innerHTML = html;
      } catch (error) {
        document.getElementById("inventoryTable").innerHTML = "Failed to load inventory.";
        console.error(error);
      }
    }

    loadInventory();
  </script>
</body>
</html>
