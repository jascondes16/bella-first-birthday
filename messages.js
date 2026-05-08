
  const SHEET_ID = "1e0q-9CQsTC3ad8w8_Tfoeir0RZuGJ6-oM-3s4E3JK7o";
  const TAB_NAME = "Mga Tugon sa Form 1";

  // If you don't have an Approved column, change to: select A,B,C
  const QUERY = encodeURIComponent("select A,B,C,D order by A desc");

  // ✅ Use & (NOT &amp;) and encode TAB_NAME
  const URL = "https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(TAB_NAME)}&tq=${QUERY}";

  const wishesDiv = document.getElementById("wishes");
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
      // Debug helper: see what Google returns
      // console.log(text);

      const json = JSON.parse(text.substring(47, text.length - 2));
      const rows = json.table.rows || [];

      let html = "";
      let count = 0;

      rows.forEach(r => {
        const date = r.c[0]?.v ?? "";
        const name = r.c[1]?.v ?? "Anonymous";
        const message = r.c[2]?.v ?? "";
        const approved = r.c[3]?.v; // optional

        // ✅ If you use Approved column, enable this:
        // if (approved !== true) return;

        if (!message) return;

        count++;
        html += `
          <div class="wish">
            <p>${safe(message)}</p>
            <div class="name">— ${safe(name)}</div>
            <div class="date">${safe(date)}</div>
          </div>
        `;
      });

      wishesDiv.innerHTML = html;
      status.textContent = count ? `${count} wishes 💗` : "No wishes yet.";
    })
    .catch(err => {
      console.error(err);
      status.textContent = "Unable to load wishes.";
    });
