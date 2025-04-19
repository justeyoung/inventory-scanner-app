const scriptURL = 'https://script.google.com/macros/s/AKfycbwmzzYCYcwKnmJ_P9KrveyhnRizaKcWPqFwKkFsQD05W9fE6zc4601cxXxIuGSaqKHvhA/exec'; // Replace with your actual Web App URL

async function loadInventory() {
  const res = await fetch(scriptURL);
  const data = await res.json();

  const headers = data[0];
  const rows = data.slice(1);

  let html = `<table><thead><tr>`;
  headers.forEach(header => {
    html += `<th>${header}</th>`;
  });
  html += `</tr></thead><tbody>`;

  rows.forEach(row => {
    html += `<tr>`;
    row.forEach(cell => {
      html += `<td>${cell}</td>`;
    });
    html += `</tr>`;
  });

  html += `</tbody></table>`;
  document.getElementById("tableContainer").innerHTML = html;
}

loadInventory();
