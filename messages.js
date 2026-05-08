const SHEET_ID = "1e0q-9CQsTC3ad8w8_Tfoeir0RZuGJ6-oM-3s4E3JK7o";
const TAB_NAME = "Mga Tugon sa Form 1";

// If you do NOT have an Approved column, use A,B,C only
const QUERY = encodeURIComponent("select A,B,C,D order by A desc");

const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(TAB_NAME)}&tq=${QUERY}`;

const wishesDiv = document.getElementById("wishesContainer");
const status = document.getElementById("status");

function safe(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

fetch(URL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47, text.length - 2));
    const rows = json.table.rows || [];

    let html = "";
    let count = 0;

    rows.forEach(r => {
      const date = r.c[0]?.v ?? "";
      const name = r.c[1]?.v ?? "Anonymous";
      const message = r.c[2]?.v ?? "";

      if (!message) return;

      count++;
      html += `
        <article class="wish-card">
          <p class="wish-message">${safe(message)}</p>
          <div class="wish-meta">
            <span class="wish-name">— ${safe(name)}</span>
            <span class="wish-date">${safe(date)}</span>
          </div>
        </article>
      `;
    });

    wishesDiv.innerHTML = html;
    status.textContent = count ? `Showing ${count} wishes 💗` : "No wishes yet.";
  })
  .catch(err => {
    console.error(err);
    status.textContent = "Unable to load wishes.";
  });
