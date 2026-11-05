(() => {
  const data = window.weddingData;
  const names = [data.couple.partnerOne || "지혜", data.couple.partnerTwo || "태희"];
  const photos = data.gallery.length ? data.gallery : [
    { src: "./assets/images/sample-wedding.jpg", alt: "햇살 아래 부케를 든 커플" },
    { src: "./assets/images/sample-flowers.jpg", alt: "분홍색 꽃" },
    { src: "./assets/images/sample-table.jpg", alt: "하객들과 풍선을 날리는 결혼식" },
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
      return `<a class="quiet-button" href="${escape(url.href)}" target="_blank" rel="noopener noreferrer" aria-label="${label}에서 예식장 보기 (새 창)">${icon("pin")} ${label}</a>`;
    } catch {
      return `<button class="quiet-button" type="button" disabled>${label}</button>`;
    }
  };
  const venueMap = () => {
    if (!data.venue.mapImageUrl) return "";
    try {
      const image = new URL(data.venue.mapImageUrl);
      const destination = new URL(data.venue.kakaoMapUrl);
      if (image.origin !== "https://staticmap.kakao.com" || destination.origin !== "https://place.map.kakao.com") return "";
      return `<figure class="venue-map"><a href="${escape(destination.href)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(data.venue.name)} 카카오맵 크게 보기 (새 창)"><img id="venue-map-image" src="${escape(image.href)}" width="504" height="310" loading="lazy" alt="${escape(data.venue.name)} 주변 카카오 지도"><span id="venue-map-error" hidden>지도를 불러오지 못했습니다. 아래 지도 바로가기를 이용해 주세요.</span></a><figcaption><span>카카오맵</span><a href="${escape(destination.href)}" target="_blank" rel="noopener noreferrer">지도 크게 보기 ${icon("arrow")}</a></figcaption></figure>`;
    } catch { return ""; }
  };
  const icon = (name) => {
    const icons = { heart: "Heart", arrow: "ArrowUpRight", down: "ArrowDown", expand: "Maximize2", close: "X", prev: "ChevronLeft", next: "ChevronRight", pin: "MapPin", copy: "Copy", calendar: "CalendarDays", send: "Send", trash: "Trash2" };
    return lucide.createElement(lucide.icons[icons[name] || "Heart"], {width: 20, height: 20, "stroke-width": 1.5, "aria-hidden": "true"}).outerHTML;
  };
  const photo = (index, className = "", eager = false) => {
    const item = photos[index];
    const focus = [0, 1].map((axis) => Number.isFinite(item.focus?.[axis]) ? Math.min(100, Math.max(0, item.focus[axis])) : 50);
    const width = Number.isInteger(item.width) && item.width > 0 ? item.width : 1000;
    const height = Number.isInteger(item.height) && item.height > 0 ? item.height : 1250;
    return `<img class="${className}" src="${imageSource(item.src)}" alt="${escape(item.alt || "우리의 사진")}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" width="${width}" height="${height}" style="object-position: ${focus[0]}% ${focus[1]}%">`;
  };
  const title = `${names.join(" · ")}의 결혼식`;
  const date = new Date(data.dateTime);
  const validDate = !Number.isNaN(date.getTime());
  const dateParts = validDate ? new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date) : [];
  const part = (type) => dateParts.find((item) => item.type === type)?.value;
  const year = Number(part("year"));
  const month = Number(part("month"));
  const day = Number(part("day"));
  const dateLabel = validDate ? `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}` : "날짜 확인 중";
  const fullDate = validDate ? new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "long", day: "numeric", weekday: "long", hour: "numeric", minute: "2-digit", hour12: true }).format(date) : "예식 일시를 확인해 주세요";
  document.title = title;
  document.body.className = "photobook";
  const heading = (text, script = "") => `<header class="section-heading">${script ? `<span class="invitation-script" aria-hidden="true">${escape(script)}</span>` : ""}<h2>${text}</h2></header>`;
  const story = `
    <section class="section story" id="story">
      ${heading("소중한 분들을 초대합니다", "With love")}
      <p class="invitation-copy">${escape(data.greeting || "서로를 아끼고 배려하며\n함께 걸어온 저희 두 사람이\n이제 부부의 인연을 맺으려 합니다.\n\n소중한 분들을 모시고\n새로운 시작을 함께하고자 하오니,\n귀한 걸음 하시어 축복해 주시면\n더없는 기쁨으로 간직하겠습니다.")}</p>
      <div class="signature"><span><small>신랑</small>${escape(names[0])}</span>${icon("heart")}<span><small>신부</small>${escape(names[1])}</span></div>
    </section>`;
  const featured = photos.map((item, index) => item.cover ? index : -1).filter((index) => index >= 0);
  const coverPhotos = featured.length ? featured : [0];
  const coverReel = `<div class="photo-reel cover-reel" data-reel="cover" role="region" aria-roledescription="캐러셀" aria-label="표지 사진"><div class="reel-track" id="cover-track" tabindex="0" aria-label="표지 사진 넘기기">${coverPhotos.map((index, position) => `<div class="reel-slide" data-tone="${photos[index].coverTone === "light" ? "light" : "dark"}" role="group" aria-roledescription="슬라이드" aria-label="${position + 1} / ${coverPhotos.length}">${photo(index, "cover-photo", position === 0)}</div>`).join("")}</div><div class="reel-controls"><button class="icon-button reel-prev" type="button" aria-label="표지 이전 사진" title="이전 사진" aria-controls="cover-track">${icon("prev")}</button><span class="reel-count" aria-live="polite" aria-atomic="true">01 / ${String(coverPhotos.length).padStart(2, "0")}</span><button class="icon-button reel-next" type="button" aria-label="표지 다음 사진" title="다음 사진" aria-controls="cover-track">${icon("next")}</button></div></div>`;
  const gallery = `<section class="section gallery album" id="gallery"><header class="album-heading"><h2>함께한 순간</h2><p>같은 계절을 지나<br>이제, 같은 내일로.</p></header><div class="mosaic-gallery">${photos.map((item, index) => `<button class="mosaic-photo" type="button" data-photo="${index}" aria-label="사진 ${index + 1} 확대" aria-haspopup="dialog">${photo(index)}</button>`).join("")}</div></section>`;
  let calendar = "";
  if (validDate) {
    const offset = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
    const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
    calendar = `<div class="calendar" aria-label="${year}년 ${month}월, ${day}일 예식">${["일", "월", "화", "수", "목", "금", "토"].map((weekday) => `<span class="weekday">${weekday}</span>`).join("")}${'<span aria-hidden="true"></span>'.repeat(offset)}${Array.from({length: count}, (_, index) => `<span class="${index + 1 === day ? "wedding-day" : ""}" ${index + 1 === day ? 'aria-label="예식일"' : ""}>${index + 1}</span>`).join("")}</div>`;
  }
  const event = `
    <section class="section event" id="event">
      ${heading("예식 안내")}
      <p class="event-date">${dateLabel}</p><p>${escape(fullDate)}</p>
      ${calendar}
      ${validDate ? `<div class="wedding-countdown" role="timer" aria-live="off" aria-label="결혼식까지 남은 시간"><div id="countdown-remaining"><p>결혼식까지 <strong id="countdown-days">0</strong>일</p><div class="countdown-clock"><span><b id="countdown-hours">00</b>시간</span><span><b id="countdown-minutes">00</b>분</span><span><b id="countdown-seconds">00</b>초</span></div></div><p id="countdown-complete" hidden>함께해 주셔서 감사합니다</p></div>` : ""}
      <button type="button" class="quiet-button" id="save-date" ${!data.dateTime || !validDate ? "disabled" : ""}>${icon("calendar")} 일정 저장</button>
    </section>
    <section class="section location" id="location">
      ${heading("오시는 길")}
      <div class="venue-name">${icon("pin")}<h3>${escape(data.venue.name || "우리의 예식장")}</h3></div>
      <p>${escape(data.venue.address || "장소와 주소는 예식 정보 확정 후 안내합니다.")}</p>
      ${venueMap()}
      <div class="location-actions">${mapLink("네이버지도", data.venue.naverMapUrl)}${mapLink("카카오맵", data.venue.kakaoMapUrl)}<button class="quiet-button" id="copy-address" type="button" ${!data.venue.address ? "disabled" : ""}>${icon("copy")} 주소 복사</button></div>
    </section>`;
  const closingIndex = photos.findIndex((item) => item.closing);
  const closing = `<footer class="closing"><div class="closing-photo">${photo(closingIndex >= 0 ? closingIndex : photos.length - 1)}</div><div class="closing-message">${icon("heart")}<p>함께해 주시는 모든 분께<br>진심으로 감사드립니다.</p><span>신랑 ${escape(names[0])} · 신부 ${escape(names[1])}</span><small>${dateLabel}</small></div></footer>`;
  const cover = `<section class="cover" aria-label="초대장 표지">${coverReel}<p class="cover-script" aria-hidden="true">Our Wedding</p><div class="cover-bottom"><h1><span class="cover-person"><small>신랑</small>${escape(names[0])}</span><span class="cover-join" aria-hidden="true">·</span><span class="cover-person"><small>신부</small>${escape(names[1])}</span></h1></div><p class="cover-details"><time datetime="${escape(data.dateTime)}">${escape(fullDate)}</time><span>${escape(data.venue.name || "우리의 예식장")}</span></p></section>`;
  document.getElementById("invitation").innerHTML = `<main class="book-shell">${cover}${story}${gallery}${event}${closing}</main><nav class="book-dock" aria-label="빠른 이동"><a href="#gallery">사진첩</a><a href="#event">예식 안내</a><a href="#location">오시는 길</a></nav><dialog id="lightbox" aria-label="사진 크게 보기"><div class="lightbox-bar"><span id="photo-count"></span><button type="button" class="icon-button" id="close-photo" aria-label="사진 닫기" title="닫기">${icon("close")}</button></div><img id="large-photo" alt=""><div class="lightbox-controls"><button type="button" class="icon-button" id="prev-photo" aria-label="이전 사진" title="이전 사진">${icon("prev")}</button><button type="button" class="icon-button" id="next-photo" aria-label="다음 사진" title="다음 사진">${icon("next")}</button></div></dialog><div class="toast" id="toast" role="status"></div>`;
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
        countdown.setAttribute("aria-label", seconds > 0 ? "결혼식까지 남은 시간" : "함께해 주셔서 감사합니다");
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
    });
    const revealElements = document.querySelectorAll(".book-shell .section-heading, .book-shell .invitation-copy, .book-shell .signature, .album-heading, .closing-message");
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
    document.getElementById("large-photo").alt = photos[selectedPhoto].alt || "우리의 사진";
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
  document.getElementById("copy-address").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(data.venue.address); notify("주소를 복사했습니다."); }
    catch { notify("복사 권한이 없습니다. 표시된 주소를 직접 선택해 주세요."); }
  });
  document.getElementById("save-date").addEventListener("click", () => {
    const stamp = (value) => value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    const icsText = (value) => String(value).replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
    const content = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//JT Invitation//KO", "BEGIN:VEVENT", `UID:${stamp(date)}@jt-invitation`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(date)}`, `DTEND:${stamp(new Date(date.getTime() + 3600000))}`, `SUMMARY:${icsText(title)}`, `LOCATION:${icsText(`${data.venue.name} ${data.venue.address}`)}`, "END:VEVENT", "END:VCALENDAR", ""].join("\r\n");
    const url = URL.createObjectURL(new Blob([content], {type: "text/calendar;charset=utf-8"}));
    const link = document.createElement("a");
    link.href = url;
    link.download = "wedding.ics";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();