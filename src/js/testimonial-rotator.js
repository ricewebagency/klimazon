import { AIRCO_TESTIMONIALS } from "./airco-testimonials.js";

(function () {
  var testimonials = document.querySelector("[data-testimonials]");
  if (!testimonials) return;

  var quoteEl = testimonials.querySelector("[data-testimonial-quote]");
  var authorEl = testimonials.querySelector("[data-testimonial-author]");
  var sourceEl = testimonials.querySelector("[data-testimonial-source]");
  var pickButtons = testimonials.querySelectorAll("[data-testimonial-pick]");
  if (!quoteEl || !authorEl || !sourceEl || !pickButtons.length || pickButtons.length !== AIRCO_TESTIMONIALS.length)
    return;

  var entries = AIRCO_TESTIMONIALS;
  var activeIndex = 0;
  var animationFrameId = null;
  var intervalMs = 8000;
  var cycleStartTime = 0;
  var activeRingColor = "rgb(255, 255, 255)";
  var inactiveRingColor = "rgba(255, 255, 255, 0.35)";
  var resizeTimer = null;
  var pathPrefix = getPathPrefix();

  function normalizeIndex(index) {
    var length = entries.length;
    return ((index % length) + length) % length;
  }

  function getPathPrefix() {
    var customPrefix = testimonials.getAttribute("data-testimonial-path-prefix");
    if (customPrefix !== null && customPrefix !== "") {
      return customPrefix;
    }

    var depthAttr = testimonials.getAttribute("data-testimonial-path-depth");
    var depth = Number(depthAttr);
    if (!Number.isFinite(depth) || depth < 0) {
      return "";
    }

    return "../".repeat(Math.floor(depth));
  }

  function resolveSourcePath(sourcePath) {
    if (!sourcePath || /^([a-z]+:|\/\/|\/)/i.test(sourcePath)) {
      return sourcePath;
    }

    var normalizedPath = sourcePath.replace(/^\.\//, "");
    return pathPrefix + normalizedPath;
  }

  function lockTestimonialsHeight() {
    var originalQuote = quoteEl.textContent;
    var originalAuthor = authorEl.innerHTML;
    var maxHeight = 0;

    testimonials.style.minHeight = "0px";

    for (var i = 0; i < entries.length; i += 1) {
      quoteEl.textContent = entries[i].quote;
      authorEl.innerHTML = entries[i].author;
      maxHeight = Math.max(maxHeight, testimonials.offsetHeight);
    }

    quoteEl.textContent = originalQuote;
    authorEl.innerHTML = originalAuthor;
    testimonials.style.minHeight = maxHeight + "px";
  }

  function render(index) {
    var safeIndex = normalizeIndex(index);
    activeIndex = safeIndex;
    quoteEl.textContent = entries[safeIndex].quote;
    authorEl.innerHTML = entries[safeIndex].author;
    if (entries[safeIndex].source) {
      sourceEl.src = resolveSourcePath(entries[safeIndex].source.src);
      sourceEl.alt = entries[safeIndex].source.alt;
    }

    for (var i = 0; i < pickButtons.length; i += 1) {
      var isActive = i === safeIndex;
      pickButtons[i].setAttribute("aria-pressed", isActive ? "true" : "false");
      pickButtons[i].style.zIndex = isActive ? "30" : String(10 - i);
      pickButtons[i].style.transform = isActive ? "translateY(-1px) scale(1) rotate(45deg)" : "translateY(0) scale(0.8) rotate(45deg)";
      pickButtons[i].style.background = "conic-gradient(" + inactiveRingColor + " 360deg, " + inactiveRingColor + " 360deg)";
    }
  }

  function paintProgress(progressRatio) {
    var progressDegrees = Math.max(0, Math.min(progressRatio, 1)) * 360;
    for (var i = 0; i < pickButtons.length; i += 1) {
      if (i === activeIndex) {
        pickButtons[i].style.background =
          "conic-gradient(" +
          activeRingColor +
          " " +
          progressDegrees +
          "deg, " +
          inactiveRingColor +
          " " +
          progressDegrees +
          "deg 360deg)";
      }
    }
  }

  function stopAnimation() {
    if (animationFrameId !== null) {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  function animationStep(now) {
    if (!cycleStartTime) {
      cycleStartTime = now;
    }

    var elapsed = now - cycleStartTime;
    if (elapsed >= intervalMs) {
      render(activeIndex + 1);
      cycleStartTime = now;
      elapsed = 0;
    }

    paintProgress(elapsed / intervalMs);
    animationFrameId = window.requestAnimationFrame(animationStep);
  }

  function startAnimation() {
    stopAnimation();
    cycleStartTime = 0;
    animationFrameId = window.requestAnimationFrame(animationStep);
  }

  function setActiveAndRestartCycle(index) {
    render(index);
    startAnimation();
  }

  for (var i = 0; i < pickButtons.length; i += 1) {
    (function (index) {
      pickButtons[index].addEventListener("click", function () {
        setActiveAndRestartCycle(index);
      });
    })(i);
  }

  render(0);
  lockTestimonialsHeight();

  if (document.fonts && typeof document.fonts.ready === "object") {
    document.fonts.ready.then(lockTestimonialsHeight);
  } else {
    window.addEventListener("load", lockTestimonialsHeight, { once: true });
  }

  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(lockTestimonialsHeight, 120);
  });

  startAnimation();
})();
