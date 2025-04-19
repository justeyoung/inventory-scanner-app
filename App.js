const scriptURL = "https://script.google.com/macros/s/AKfycbw911MYKuY9nM-CeaE_NtdcNewH0ohrK1NGzz0AGjbLp6E25mtA-33Ee4MU393rpmmK/exec";

async function loadInventory() {
  const res = await fetch(scriptURL);
  const data = await res.json();

  const header = data[0];
  const rows = data.slice(1);

  let html = `<table><thead><tr>`;
  header.forEach(title => html += `<th>${title}</th>`);
  html += `</tr></thead><tbody>`;

  rows.forEach(row => {
    html += `<tr>`;
    row.forEach(cell => html += `<td>${cell}</td>`);
    html += `</tr>`;
  });

  html += `</tbody></table>`;
  document.getElementById("inventoryTable").innerHTML = html;
}

loadInventory();
