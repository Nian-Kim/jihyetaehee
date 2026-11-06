(() => {
  const data = window.weddingData;
  const names = [data.couple.partnerOne || "Taehee", data.couple.partnerTwo || "Jihye"];
  const photos = data.gallery.length ? data.gallery : [
    { src: "./assets/images/sample-wedding.jpg", alt: "A couple holding a bouquet in the sunlight" },
    { src: "./assets/images/sample-flowers.jpg", alt: "Pink flowers" },
    { src: "./assets/images/sample-table.jpg", alt: "Wedding guests releasing balloons" },
  ];
  const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const imageSource = (value) => {
    const url = new URL(value, location.href);
    return ["https:", "http:", "file:"].includes(url.protocol) ? escape(url.href) : "";
  };
  const mapLink = (label, value) => {
    try {
      const url = new URL(value);
      if (!["https:", "http:"].includes(url.protocol)) throw new Error("Invalid map URL");
      return `<a class="quiet-button" href="${escape(url.href)}" target="_blank" rel="noopener noreferrer" aria-label="View the venue on ${label} (opens in a new tab)">${icon("pin")} ${label}</a>`;
    } catch {
      return `<button class="quiet-button" type="button" disabled>${label}</button>`;
    }
  };
  const rsvpButton = () => {
    try {
      const url = new URL(data.rsvpUrl);
      if (url.protocol !== "https:") throw new Error("Invalid RSVP URL");
      return `<a class="primary-button rsvp-button" href="${escape(url.href)}" target="_blank" rel="noopener noreferrer" aria-label="RSVP for the wedding (opens in a new tab)">${icon("send")} RSVP</a>`;
    } catch {
      return `<button class="primary-button rsvp-button" type="button" disabled>RSVP</button>`;
    }
  };
  const naverOrigin = "https://oapi.map.naver.com";
  const hasLiveMap = () => Boolean(data.venue.naverMapKeyId) && Number.isFinite(data.venue.lat) && Number.isFinite(data.venue.lng);
  const venueMap = () => {
    if (hasLiveMap()) {
      return `<figure class="venue-map"><div id="naver-map" class="venue-map-live" role="region" aria-label="Map of ${escape(data.venue.name)} on Naver Map"></div><figcaption><span>Naver Map</span><a href="${escape(new URL(data.venue.naverMapUrl).href)}" target="_blank" rel="noopener noreferrer">Open larger map ${icon("arrow")}</a></figcaption></figure>`;
    }
    if (!data.venue.mapImageUrl) return "";
    try {
      const image = new URL(data.venue.mapImageUrl);
      const destination = new URL(data.venue.kakaoMapUrl);
      if (image.origin !== "https://staticmap.kakao.com" || destination.origin !== "https://place.map.kakao.com") return "";
      return `<figure class="venue-map"><a href="${escape(destination.href)}" target="_blank" rel="noopener noreferrer" aria-label="View the map of ${escape(data.venue.name)} larger (opens in a new tab)"><img id="venue-map-image" src="${escape(image.href)}" width="504" height="310" loading="lazy" alt="Map around ${escape(data.venue.name)}"><span id="venue-map-error" hidden>The map could not be loaded. Please use the map links below.</span></a><figcaption><span>Kakao Map</span><a href="${escape(destination.href)}" target="_blank" rel="noopener noreferrer">Open larger map ${icon("arrow")}</a></figcaption></figure>`;
    } catch { return ""; }
  };
  const icon = (name) => {
    const icons = { heart: "Heart", arrow: "ArrowUpRight", down: "ArrowDown", expand: "Maximize2", close: "X", prev: "ChevronLeft", next: "ChevronRight", pin: "MapPin", copy: "Copy", calendar: "CalendarDays", send: "Send", trash: "Trash2", link: "Link", share: "Share2" };
    return lucide.createElement(lucide.icons[icons[name] || "Heart"], {width: 20, height: 20, "stroke-width": 1.5, "aria-hidden": "true"}).outerHTML;
  };
  const photo = (index, className = "", eager = false) => {
    const item = photos[index];
    const focus = [0, 1].map((axis) => Number.isFinite(item.focus?.[axis]) ? Math.min(100, Math.max(0, item.focus[axis])) : 50);
    const width = Number.isInteger(item.width) && item.width > 0 ? item.width : 1000;
    const height = Number.isInteger(item.height) && item.height > 0 ? item.height : 1250;
    return `<img class="${className}" src="${imageSource(item.src)}" alt="${escape(item.alt || "Our photo")}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" width="${width}" height="${height}" style="object-position: ${focus[0]}% ${focus[1]}%">`;
  };
  const title = `${names.join(" & ")}'s Wedding`;
  const date = new Date(data.dateTime);
  const validDate = !Number.isNaN(date.getTime());
  const dateParts = validDate ? new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date) : [];
  const part = (type) => dateParts.find((item) => item.type === type)?.value;
  const year = Number(part("year"));
  const month = Number(part("month"));
  const day = Number(part("day"));
  const dateLabel = validDate ? `${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}.${year}` : "Date to be confirmed";
  const fullDate = validDate ? new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Seoul", year: "numeric", month: "long", day: "numeric", weekday: "long", hour: "numeric", minute: "2-digit", hour12: true }).format(date).replace(/,? at /, " at ") : "Please check the ceremony date and time";
  document.title = title;
  document.body.className = "photobook";
  const heading = (text, script = "") => `<header class="section-heading">${script ? `<span class="invitation-script" aria-hidden="true">${escape(script)}</span>` : ""}<h2>${text}</h2></header>`;
  const story = `
    <section class="section story" id="story">
      ${heading("You're Invited", "With love")}
      <p class="invitation-copy">${escape(data.greeting || "Two people who care deeply for each other\nare beginning a new chapter together.\n\nWe would be honored to have you\njoin us and celebrate our wedding day.")}</p>
      <div class="signature"><span><small>Groom</small>${escape(names[0])}</span>${icon("heart")}<span><small>Bride</small>${escape(names[1])}</span></div>
    </section>`;
  const featured = photos.map((item, index) => item.cover ? index : -1).filter((index) => index >= 0);
  const coverPhotos = featured.length ? featured : [0];
  const coverReel = `<div class="photo-reel cover-reel" data-reel="cover"   role="region" aria-roledescription="carousel" aria-label="Cover photos"><div class="reel-track" id="cover-track" tabindex="0" aria-label="Swipe through cover photos">${coverPhotos.map((index, position) => `<div class="reel-slide" data-tone="${photos[index].coverTone === "light" ? "light" : "dark"}" role="group" aria-roledescription="slide" aria-label="${position + 1} / ${coverPhotos.length}">${photo(index, "cover-photo", position === 0)}</div>`).join("")}</div><div class="reel-controls"><button class="icon-button reel-prev" type="button" aria-label="Previous cover photo" title="Previous photo" aria-controls="cover-track">${icon("prev")}</button><span class="reel-count" aria-live="polite" aria-atomic="true">01 / ${String(coverPhotos.length).padStart(2, "0")}</span><button class="icon-button reel-next" type="button" aria-label="Next cover photo" title="Next photo" aria-controls="cover-track">${icon("next")}</button></div></div>`;
    const gallery = `<section class="section gallery album" id="gallery"><header class="album-heading"><h2>Our Moments</h2><p>Together through every season,<br>and now, toward the same tomorrow.</p></header><div class="mosaic-gallery">${photos.map((item, index) => `<button class="mosaic-photo" type="button" data-photo="${index}" aria-label="Enlarge photo ${index + 1}" aria-haspopup="dialog">${photo(index)}</button>`).join("")}</div></section>`;
  let calendar = "";
  if (validDate) {
    const offset = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
    const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
    calendar = `<div class="calendar" aria-label="Wedding on ${new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "long" }).format(new Date(Date.UTC(year, month - 1, 1)))} ${day}, ${year}">${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((weekday) => `<span class="weekday">${weekday}</span>`).join("")}${'<span aria-hidden="true"></span>'.repeat(offset)}${Array.from({length: count}, (_, index) => `<span class="${index + 1 === day ? "wedding-day" : ""}" ${index + 1 === day ? 'aria-label="Wedding day"' : ""}>${index + 1}</span>`).join("")}</div>`;
  }
  const event = `
    <section class="section event" id="event">
      ${heading("Ceremony Details")}
      <p class="event-date">${dateLabel}</p><p>${escape(fullDate)}</p>
      ${calendar}
      ${validDate ? `<div class="wedding-countdown" role="timer" aria-live="off" aria-label="Time remaining until the wedding"><div id="countdown-remaining"><p><strong id="countdown-days">0</strong> days to go</p><div class="countdown-clock"><span><b id="countdown-hours">00</b>hrs</span><span><b id="countdown-minutes">00</b>min</span><span><b id="countdown-seconds">00</b>sec</span></div></div><p id="countdown-complete" hidden>Thank you for celebrating with us</p></div>` : ""}
      <button type="button" class="quiet-button" id="save-date" ${!data.dateTime || !validDate ? "disabled" : ""}>${icon("calendar")} Add to calendar</button>
    </section>
    <section class="section location" id="location">
      ${heading("Getting There")}
      <div class="venue-name">${icon("pin")}<h3>${escape(data.venue.name || "Our wedding venue")}</h3></div>
      ${data.venue.nameKo ? `<p class="venue-ko" lang="ko">${escape(data.venue.nameKo)}</p>` : ""}
      <p>${escape(data.venue.address || "The venue and address will be announced once confirmed.")}</p>
      ${data.venue.addressKo ? `<p class="venue-ko" lang="ko">${escape(data.venue.addressKo)}</p>` : ""}
      ${data.venue.transit ? `<p class="venue-transit">${escape(data.venue.transit)}</p>` : ""}
      ${venueMap()}
      <div class="location-actions">${mapLink("Naver Map", data.venue.naverMapUrl)}${mapLink("Google Maps", data.venue.googleMapUrl)}${mapLink("Kakao Map", data.venue.kakaoMapUrl)}<button class="quiet-button" id="copy-address" type="button" ${!data.venue.address ? "disabled" : ""}>${icon("copy")} Copy address</button></div>
    </section>`;
  const closingIndex = photos.findIndex((item) => item.closing);
  const closing = `<footer class="closing"><div class="closing-photo">${photo(closingIndex >= 0 ? closingIndex : photos.length - 1)}</div><div class="closing-message">${icon("heart")}<p>Thank you to everyone<br>celebrating with us.</p><span>Groom ${escape(names[0])} &amp; Bride ${escape(names[1])}</span><small>${dateLabel}</small><div class="share-actions"><button class="quiet-button" id="copy-link" type="button">${icon("link")} Copy link</button><button class="quiet-button" id="share-invite" type="button" hidden>${icon("share")} Share</button></div></div></footer>`;
  const cover = `<section class="cover" aria-label="Invitation cover">${coverReel}<p class="cover-script" aria-hidden="true">Our Wedding</p><div class="cover-bottom"><h1><span class="cover-person"><small>Groom</small>${escape(names[0])}</span><span class="cover-join" aria-hidden="true">&amp;</span><span class="cover-person"><small>Bride</small>${escape(names[1])}</span></h1></div><p class="cover-details"><time datetime="${escape(data.dateTime)}">${escape(fullDate)}</time><span>${escape(data.venue.name || "Our wedding venue")}</span></p><a class="cover-scroll" href="#story" aria-label="Scroll down to the invitation">${icon("down")}</a></section>`;
  const rsvp = `
    <section class="section rsvp" id="rsvp">
      ${heading("Will You Join Us?", "RSVP")}
      <p class="invitation-copy">Kindly let us know if you can celebrate with us.\nIt only takes a minute.</p>
      ${rsvpButton()}
    </section>`;
  document.getElementById("invitation").innerHTML = `<main class="book-shell">${cover}${story}${gallery}${event}${rsvp}${closing}</main><nav class="book-dock" aria-label="Quick navigation"><a href="#gallery">Photos</a><a href="#event">Details</a><a href="#location">Location</a><a href="#rsvp">RSVP</a></nav><dialog id="lightbox" aria-label="Photo viewer"><div class="lightbox-bar"><span id="photo-count"></span><button type="button" class="icon-button" id="close-photo" aria-label="Close photo" title="Close">${icon("close")}</button></div><img id="large-photo" alt=""><div class="lightbox-controls"><button type="button" class="icon-button" id="prev-photo" aria-label="Previous photo" title="Previous photo">${icon("prev")}</button><button type="button" class="icon-button" id="next-photo" aria-label="Next photo" title="Next photo">${icon("next")}</button></div></dialog><div class="toast" id="toast" role="status"></div>`;
  {
    const countdown = document.querySelector(".wedding-countdown");
    if (countdown) {
      const remaining = document.getElementById("countdown-remaining");
      const complete = document.getElementById("countdown-complete");
      const fields = ["days", "hours", "minutes", "seconds"].map((unit) => document.getElementById(`countdown-${unit}`));
      const updateCountdown = () => {
        const seconds = Math.max(0, Math.ceil((date.getTime() - Date.now()) / 1000));
        remaining.hidden = seconds === 0;
        complete.hidden = seconds > 0;
        countdown.setAttribute("aria-label", seconds > 0 ? "Time remaining until the wedding" : "Thank you for celebrating with us");
        if (seconds === 0) {
          clearInterval(countdownTimer);
          document.removeEventListener("visibilitychange", updateCountdown);
          return;
        }
        const values = [Math.floor(seconds / 86400), Math.floor(seconds % 86400 / 3600), Math.floor(seconds % 3600 / 60), seconds % 60];
        fields.forEach((field, index) => { field.textContent = index === 0 ? String(values[index]) : String(values[index]).padStart(2, "0"); });
      };
      const countdownTimer = setInterval(updateCountdown, 1000);
      document.addEventListener("visibilitychange", updateCountdown);
      updateCountdown();
    }
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    document.querySelectorAll("[data-reel]").forEach((element) => {
      const track = element.querySelector(".reel-track");
      const slides = [...track.children];
      const previous = element.querySelector(".reel-prev");
      const next = element.querySelector(".reel-next");
      let active = 0;
      let scheduled = false;
      const update = () => {
        scheduled = false;
        const origin = track.getBoundingClientRect().left;
        active = slides.reduce((nearest, slide, index) => Math.abs(slide.getBoundingClientRect().left - origin) < Math.abs(slides[nearest].getBoundingClientRect().left - origin) ? index : nearest, 0);
        previous.disabled = active === 0;
        next.disabled = active === slides.length - 1;
        element.querySelector(".reel-count").textContent = `${String(active + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
        element.closest(".cover").dataset.tone = slides[active].dataset.tone;
        element.dataset.activeSlide = String(active);
      };
      const goTo = (index) => {
        const target = slides[Math.max(0, Math.min(slides.length - 1, index))];
        track.scrollTo({left: track.scrollLeft + target.getBoundingClientRect().left - track.getBoundingClientRect().left, behavior: reducedMotion.matches ? "instant" : "smooth"});
      };
      previous.addEventListener("click", () => goTo(active - 1));
      next.addEventListener("click", () => goTo(active + 1));
      track.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        goTo(event.key === "Home" ? 0 : event.key === "End" ? slides.length - 1 : active + (event.key === "ArrowRight" ? 1 : -1));
      });
      track.addEventListener("scroll", () => {
        if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
      }, {passive: true});
      const resize = new ResizeObserver(() => {
        const target = slides[active];
        track.scrollTo({left: track.scrollLeft + target.getBoundingClientRect().left - track.getBoundingClientRect().left, behavior: "instant"});
        update();
      });
      resize.observe(track);
      update();
      if (element.classList.contains("cover-reel")) {
        let hideTimer;
        const showControls = () => {
          element.classList.add("is-active");
          clearTimeout(hideTimer);
          hideTimer = setTimeout(() => element.classList.remove("is-active"), 800);
        };
        element.closest(".cover").addEventListener("pointerdown", showControls, {passive: true});
        track.addEventListener("scroll", () => { if (element.classList.contains("is-active")) showControls(); }, {passive: true});
      }
    });
    document.querySelectorAll(".mosaic-photo").forEach((tile, index) => tile.style.setProperty("--i", String(index % 3)));
    const revealElements = document.querySelectorAll(".book-shell .section-heading, .book-shell .invitation-copy, .book-shell .signature, .book-shell .rsvp-button, .album-heading, .closing-message, .mosaic-photo");
    if (!reducedMotion.matches && "IntersectionObserver" in window) {
      const reveal = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            reveal.unobserve(entry.target);
          }
        });
      }, {threshold: 0.12});
      revealElements.forEach((element) => { element.classList.add("reveal"); reveal.observe(element); });
      reducedMotion.addEventListener("change", (event) => {
        if (event.matches) { revealElements.forEach((element) => element.classList.add("is-visible")); reveal.disconnect(); }
      });
    }
    const dock = document.querySelector(".book-dock");
    const dockLinks = [...dock.querySelectorAll("a")];
    const destinations = dockLinks.map((link) => document.querySelector(link.getAttribute("href")));
    let scrollScheduled = false;
    const updateReading = () => {
      scrollScheduled = false;
      const hideDock = scrollY < innerHeight * 0.55;
      dock.classList.toggle("is-hidden", hideDock);
      dock.inert = hideDock;
      const available = document.documentElement.scrollHeight - innerHeight;
      dock.style.setProperty("--reading-progress", String(available > 0 ? Math.min(1, Math.max(0, scrollY / available)) : 0));
      let current = -1;
      destinations.forEach((section, index) => { if (section.getBoundingClientRect().top <= innerHeight * .55) current = index; });
      dockLinks.forEach((link, index) => {
        if (index === current) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };
    addEventListener("scroll", () => {
      if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(updateReading); }
    }, {passive: true});
    addEventListener("resize", updateReading);
    updateReading();
  }
  const liveMap = document.getElementById("naver-map");
  if (liveMap) {
    const mapFailed = () => { liveMap.textContent = "The map could not be loaded. Please use the map links below."; liveMap.classList.add("is-error"); };
    window.navermap_authFailure = mapFailed;
    const script = document.createElement("script");
    script.src = `${naverOrigin}/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(data.venue.naverMapKeyId)}`;
    script.onerror = mapFailed;
    script.onload = () => {
      try {
        const position = new naver.maps.LatLng(data.venue.lat, data.venue.lng);
        const map = new naver.maps.Map(liveMap, { center: position, zoom: 16, scrollWheel: false });
        new naver.maps.Marker({ position, map });
      } catch { mapFailed(); }
    };
    document.head.append(script);
  }
  const photoArea = ".cover, .closing, .mosaic-photo, #lightbox";
  document.addEventListener("gesturestart", (event) => { if (event.target.closest?.(photoArea)) event.preventDefault(); });
  document.addEventListener("touchmove", (event) => { if (event.touches.length > 1 && event.target.closest?.(photoArea)) event.preventDefault(); }, {passive: false});
  const mapImage = document.getElementById("venue-map-image");
  if (mapImage) {
    const mapError = () => {
      mapImage.hidden = true;
      document.getElementById("venue-map-error").hidden = false;
    };
    mapImage.addEventListener("error", mapError);
    if (mapImage.complete && !mapImage.naturalWidth) mapError();
  }
  let toastTimer;
  function notify(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("shown"), 3000);
  }
  const lightbox = document.getElementById("lightbox");
  let selectedPhoto = 0;
  function showPhoto(index) {
    selectedPhoto = (index + photos.length) % photos.length;
    document.getElementById("large-photo").src = new URL(photos[selectedPhoto].src, location.href).href;
    document.getElementById("large-photo").alt = photos[selectedPhoto].alt || "Our photo";
    document.getElementById("large-photo").style.objectPosition = [0, 1].map((axis) => `${Number.isFinite(photos[selectedPhoto].focus?.[axis]) ? photos[selectedPhoto].focus[axis] : 50}%`).join(" ");
    document.getElementById("photo-count").textContent = `${String(selectedPhoto + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;
  }
  document.querySelectorAll("[data-photo]").forEach((button) => button.addEventListener("click", () => {
    showPhoto(Number(button.dataset.photo));
    lightbox.showModal();
    document.body.classList.add("modal-open");
  }));
  document.getElementById("close-photo").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("close", () => document.body.classList.remove("modal-open"));
  document.getElementById("prev-photo").addEventListener("click", () => showPhoto(selectedPhoto - 1));
  document.getElementById("next-photo").addEventListener("click", () => showPhoto(selectedPhoto + 1));
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { event.preventDefault(); lightbox.close(); }
    if (event.key === "ArrowLeft") showPhoto(selectedPhoto - 1);
    if (event.key === "ArrowRight") showPhoto(selectedPhoto + 1);
  });
  let startX;
  lightbox.addEventListener("touchstart", (event) => { startX = event.changedTouches[0].clientX; }, {passive: true});
  lightbox.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - startX;
    if (Math.abs(distance) > 60) showPhoto(selectedPhoto + (distance < 0 ? 1 : -1));
  }, {passive: true});
  const shareUrl = location.href.split(/[?#]/)[0];
  document.getElementById("copy-link").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(shareUrl); notify("Link copied."); }
    catch { notify("Couldn't copy. Please copy the link from your browser's address bar."); }
  });
  if (navigator.share) {
    const shareButton = document.getElementById("share-invite");
    shareButton.hidden = false;
    shareButton.addEventListener("click", async () => {
      try { await navigator.share({ title, text: `You're invited to ${title} on ${fullDate}.`, url: shareUrl }); }
      catch (error) { if (error.name !== "AbortError") notify("Sharing isn't available. Try Copy link instead."); }
    });
  }
  document.getElementById("copy-address").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText([data.venue.addressKo, data.venue.address].filter(Boolean).join("\n")); notify("Address copied."); }
    catch { notify("Couldn't copy. Please select the address above manually."); }
  });
  document.getElementById("save-date").addEventListener("click", () => {
    const stamp = (value) => value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    const icsText = (value) => String(value).replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
    const content = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//JT Invitation//EN", "BEGIN:VEVENT", `UID:${stamp(date)}@jt-invitation`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(date)}`, `DTEND:${stamp(new Date(date.getTime() + 3600000))}`, `SUMMARY:${icsText(title)}`, `LOCATION:${icsText(`${data.venue.name} ${data.venue.address}`)}`, "END:VEVENT", "END:VCALENDAR", ""].join("\r\n");
    const url = URL.createObjectURL(new Blob([content], {type: "text/calendar;charset=utf-8"}));
    const link = document.createElement("a");
    link.href = url;
    link.download = "wedding.ics";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();