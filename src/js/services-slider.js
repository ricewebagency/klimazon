// services-slider.js
(() => {
  const card = document.getElementById("servicesCard");
  const track = document.getElementById("servicesTrack");
  const allServices = document.getElementById("allServicesBtn");
  const prev = document.getElementById("prevBtn");
  const next = document.getElementById("nextBtn");
  const dots = Array.from(document.querySelectorAll(".dot"));

  if (!card || !track || !allServices || !prev || !next || dots.length < 2) return;

  let index = 0;
  const max = 1;

  // ----- UI helpers -----
  function setNavDisabled() {
    const atStart = index === 0;
    const atEnd = index === max;

    prev.disabled = atStart;
    next.disabled = atEnd;

    prev.classList.toggle("opacity-40", atStart);
    prev.classList.toggle("cursor-not-allowed", atStart);

    next.classList.toggle("opacity-40", atEnd);
    next.classList.toggle("cursor-not-allowed", atEnd);
  }

  function animateAllServicesBtn(toBusiness) {
    allServices.classList.remove("is-animate");
    allServices.classList.toggle("is-business", toBusiness);

    // change href
    allServices.href = toBusiness
      ? "./diensten-zakelijk"
      : "./diensten";

    void allServices.offsetHeight;

    if (toBusiness) {
      allServices.classList.add("is-animate");
    }
  }

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);

      if (dot.getAttribute("aria-label") === "Zakelijk") {
        dot.classList.toggle("is-business", i === index);
      } else {
        dot.classList.remove("is-business");
      }
    });

    animateAllServicesBtn(index === 1);
    setNavDisabled();
  }

  function goTo(i) {
    index = Math.max(0, Math.min(max, i));
    update();
  }

  // ----- Controls -----
  prev.addEventListener("click", (e) => {
    e.preventDefault();
    if (prev.disabled) return;
    goTo(index - 1);
  });

  next.addEventListener("click", (e) => {
    e.preventDefault();
    if (next.disabled) return;
    goTo(index + 1);
  });

  dots.forEach((dot, i) =>
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      goTo(i);
    })
  );

  // ----- Swipe / drag -----
  // Allow vertical scroll; horizontal drag handled by JS
  card.style.touchAction = "pan-y";

  const SWIPE_THRESHOLD = 40;     // px to trigger slide change
  const INTENT_THRESHOLD = 8;     // px before locking intent

  let startX = 0;
  let startY = 0;
  let isDown = false;
  let hasHorizontalIntent = false;
  let didSwipe = false;
  let pointerId = null;

  function isNoSwipeTarget(el) {
    return !!el.closest("[data-no-swipe]");
  }

  card.addEventListener("pointerdown", (e) => {
    if (isNoSwipeTarget(e.target)) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    isDown = true;
    hasHorizontalIntent = false;
    didSwipe = false;
    pointerId = e.pointerId;

    startX = e.clientX;
    startY = e.clientY;
  });

  card.addEventListener(
    "pointermove",
    (e) => {
      if (!isDown) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // Determine intent (without breaking normal taps)
      if (!hasHorizontalIntent) {
        if (Math.abs(dx) < INTENT_THRESHOLD && Math.abs(dy) < INTENT_THRESHOLD) return;

        hasHorizontalIntent = Math.abs(dx) > Math.abs(dy);

        // As soon as it's clearly horizontal: capture + prevent defaults
        if (hasHorizontalIntent) {
          card.setPointerCapture?.(pointerId);
        }
      }

      if (hasHorizontalIntent) {
        didSwipe = true;
        e.preventDefault(); // stops accidental link scroll/click behavior
      }
    },
    { passive: false }
  );

  card.addEventListener("pointerup", (e) => {
    if (!isDown) return;
    isDown = false;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0 && index < max) goTo(index + 1);
      else if (dx > 0 && index > 0) goTo(index - 1);
    }
  });

  card.addEventListener("pointercancel", () => {
    isDown = false;
  });

  // Cancel click if user actually swiped (so service links don't navigate)
  card.addEventListener(
    "click",
    (e) => {
      if (!didSwipe) return;
      e.preventDefault();
      e.stopPropagation();
      didSwipe = false;
    },
    true // capture phase so we block navigation reliably
  );

  // Init
  update();
})();
