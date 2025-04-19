const scriptURL = 'YOUR_DEPLOYED_WEB_APP_URL';

async function loadInventory() {
  const res = await fetch(scriptURL);
  const data = await res.json();

  let html = '<table border="1"><tr><th>#</th><th>Item</th><th>Qty</th><th>Unit</th><th>Purchase</th><th>Expiry</th><th>Location</th></tr>';
  data.slice(1).forEach((row, i) => {
    html += `<tr>
      <td>${i + 1}</td>
      <td>${row[1]}</td>
      <td>${row[3]}</td>
      <td>${row[4]}</td>
      <td>${row[5]}</td>
      <td>${row[6]}</td>
      <td>${row[7]}</td>
    </tr>`;
  });
  html += '</table>';
  document.getElementById('inventoryTable').innerHTML = html;
}

loadInventory();
