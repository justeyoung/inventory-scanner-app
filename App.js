const scriptURL = 'https://script.google.com/macros/s/AKfycbyw911MYKuY9nM-CeaE_NtdcNewH0ohrK1NGzz0AGjbLp6E25mtA-33Ea4MU3938At5cw/exec'; // Replace with your actual Web App URL

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
