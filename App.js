const scriptURL = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLi81o-o587EjpEZCF60eb2OEaXFIkzVzF8bacTWX-JGtGvqVls2r3rtMETMNAR3B8UARqZCxMylf-YyBHUgrGghoDQGKt8xJC_nyeuUP0HFibcfAewKbhPj6fg1ncNWoDXU1hgR2vC2dXAGcLPl_9nWu694ny74jqek4LKGlLRuu8Npal8Vx6metbhsbm3_3XAyWp5NMaYM2RF4drF2Aw6mrvu3hPerPhYlv8azTO5M4O47R4EgiFByvkQRA2Ymqs85vEAj-ivhTgcIqIW5LXKN29r7R5fWe5pzsXng&lib=MA1T5LTxm0JH1WFqDQAxrTMs6NlTRdsbA";
                  
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
