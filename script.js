// ====== CONFIG: Update your event details here ======
const EVENT = {
  // Use local date/time format: "YYYY-MM-DDTHH:MM:SS"
  dateTime: "2026-05-17T13:30:00",
  title: "Bella’s 1st Birthday",
  location: "Jollibee - Los Baños Crossing, Laguna",
  description: "Celebrate Bella’s first birthday! Please RSVP via the website."
};

// ====== Countdown ======
const $days = document.getElementById("days");
const $hours = document.getElementById("hours");
const $mins = document.getElementById("mins");
const $secs = document.getElementById("secs");

function pad(n){ return String(n).padStart(2, "0"); }

function updateCountdown(){
  const now = new Date();
  const eventDate = new Date(EVENT.dateTime);
  const diff = eventDate - now;

  if(diff <= 0){
    $days.textContent = "00";
    $hours.textContent = "00";
    $mins.textContent = "00";
    $secs.textContent = "00";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  $days.textContent = pad(days);
  $hours.textContent = pad(hours);
  $mins.textContent = pad(mins);
  $secs.textContent = pad(secs);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ====== Mobile menu toggle ======
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

// Close menu when clicking a link (mobile UX)
navLinks?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => navLinks.classList.remove("open"));
});

// ====== Reveal on scroll animation ======
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add("show");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

// ====== Google Form "Open in new tab" helper ======
const iframe = document.getElementById("googleForm");
const openFormLink = document.getElementById("openFormLink");

function syncOpenLink(){
  const src = iframe?.getAttribute("src") || "";
  // Only set if user replaced placeholder
  if(src && !src.includes("https://docs.google.com/forms/d/e/1FAIpQLSfas-BOZQrnkeNYPaqgMHFjzaILknEXn-cikMxxFcwQprmiOA/viewform?embedded=true")){
    openFormLink.href = src;
  }
}
syncOpenLink();

// ====== Add to Calendar (Creates an ICS file - works offline) ======
const addBtn = document.getElementById("addToCalendarBtn");

function toICSDate(dt){
  // Convert to UTC YYYYMMDDTHHMMSSZ
  const d = new Date(dt);
  const pad2 = (n) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear() +
    pad2(d.getUTCMonth()+1) +
    pad2(d.getUTCDate()) + "T" +
    pad2(d.getUTCHours()) +
    pad2(d.getUTCMinutes()) +
    pad2(d.getUTCSeconds()) + "Z"
  );
}

addBtn?.addEventListener("click", () => {
  const start = toICSDate(EVENT.dateTime);

  // Default duration 2 hours
  const endDate = new Date(new Date(EVENT.dateTime).getTime() + (2 * 60 * 60 * 1000));
  const end = toICSDate(endDate);

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Bella Birthday//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${EVENT.title}`,
    `LOCATION:${EVENT.location}`,
    `DESCRIPTION:${EVENT.description}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "bellas-1st-birthday.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});


// ====== Gallery Lightbox ======
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxBackdrop = document.getElementById("lightboxBackdrop");

function openLightbox(src){
  lightboxImg.src = src;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // prevent background scroll
}

function closeLightbox(){
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
  document.body.style.overflow = "";
}

document.querySelectorAll(".g-item").forEach(item => {
  item.addEventListener("click", () => {
    const fullSrc = item.getAttribute("data-full");
    if(fullSrc) openLightbox(fullSrc);
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxBackdrop?.addEventListener("click", closeLightbox);

// Close on ESC key
document.addEventListener("keydown", (e) => {
  if(e.key === "Escape" && lightbox.classList.contains("open")){
    closeLightbox();
  }
});
