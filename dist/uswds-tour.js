function initTourStartTriggers() {
  const startEls = document.querySelectorAll("[data-tour-start]");
  startEls.forEach((el) => {
    el.addEventListener("click", () => {
      startTour([], {});
    });
  });
}
function initTourTriggers() {
  const tourTargets = document.querySelectorAll("[data-tour-trigger]");
  tourTargets.forEach((target) => {
    const triggerId = target.getAttribute("data-tour-trigger");
    if (!triggerId)
      return;
    const trigger = document.getElementById(triggerId);
    if (!trigger)
      return;
    const handler = () => {
      showTooltip({
        element: target,
        title: target.getAttribute("data-tour-title") || "",
        description: target.getAttribute("data-tour-description") || "",
        position: target.getAttribute("data-tour-position") || "bottom",
        className: target.getAttribute("data-tour-class") || "",
        showControls: false
      });
    };
    trigger.removeEventListener("click", handler);
    trigger.addEventListener("click", handler);
  });
}
if (typeof window !== "undefined" && typeof document !== "undefined") {
  let runAllTourAutoInit = function() {
    initTourTriggers();
    initTourStartTriggers();
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runAllTourAutoInit);
  } else {
    runAllTourAutoInit();
  }
}
let cachedPageHeight = null;
function getPageHeight() {
  if (cachedPageHeight !== null) {
    return cachedPageHeight;
  }
  cachedPageHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight,
    window.innerHeight
  );
  return cachedPageHeight;
}
function showTooltip({ element, title, description, position = "bottom", className = "", showControls = false, onNext, onPrev, onClose, isLastStep = false }) {
  const target = typeof element === "string" ? document.querySelector(element) : element;
  if (!target) {
    console.warn("USWDS-Tour: Target element not found.");
    return;
  }
  let rect = getAdjustedBoundingClientRect(target);
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const modalHeight = Math.floor(window.innerHeight / 3);
  const modalTop = window.innerHeight - modalHeight;
  const desiredScroll = window.scrollY + rect.top - (modalTop - 2 * rem);
  if (desiredScroll !== window.scrollY) {
    console.log("Scrolling to position:", desiredScroll);
    window.scrollTo({ top: desiredScroll, behavior: "smooth" });
  }
  rect = getAdjustedBoundingClientRect(target);
  document.querySelectorAll(".uswds-tour-tooltip, .uswds-tour-overlay, .usa-modal__overlay, .usa-modal").forEach((el) => el.remove());
  const padding = 16;
  const borderRadius = 12;
  const cutout = {
    x: rect.left - padding,
    y: rect.top - padding,
    width: rect.width + 2 * padding,
    height: rect.height + 2 * padding
  };
  const overlay = document.createElement("div");
  overlay.className = "uswds-tour-spotlight-overlay";
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = `${getPageHeight()}px`;
  overlay.style.background = "transparent";
  overlay.style.margin = "0";
  overlay.style.zIndex = 1e3;
  overlay.style.pointerEvents = "auto";
  overlay.style.transition = "background 0.2s";
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      remove();
      if (onClose)
        onClose();
    }
  });
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", window.innerWidth);
  svg.setAttribute("height", getPageHeight());
  svg.setAttribute("viewBox", `0 0 ${window.innerWidth} ${getPageHeight()}`);
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.width = `${window.innerWidth}px`;
  svg.style.height = `${getPageHeight()}px`;
  svg.style.pointerEvents = "none";
  function updateOverlayDimensions() {
    const pageHeight = getPageHeight();
    svg.setAttribute("width", window.innerWidth);
    svg.setAttribute("height", pageHeight);
    svg.setAttribute("viewBox", `0 0 ${window.innerWidth} ${pageHeight}`);
    svg.style.width = `${window.innerWidth}px`;
    svg.style.height = `${pageHeight}px`;
    fullRect.setAttribute("width", window.innerWidth);
    fullRect.setAttribute("height", pageHeight);
    overlayRect.setAttribute("width", window.innerWidth);
    overlayRect.setAttribute("height", pageHeight);
  }
  window.addEventListener("resize", updateOverlayDimensions);
  const maskId = "uswds-tour-mask";
  const mask = document.createElementNS(svgNS, "mask");
  mask.setAttribute("id", maskId);
  const fullRect = document.createElementNS(svgNS, "rect");
  fullRect.setAttribute("x", "0");
  fullRect.setAttribute("y", "0");
  fullRect.setAttribute("width", window.innerWidth);
  fullRect.setAttribute("height", getPageHeight());
  fullRect.setAttribute("fill", "white");
  mask.appendChild(fullRect);
  const hole = document.createElementNS(svgNS, "rect");
  hole.setAttribute("x", cutout.x);
  hole.setAttribute("y", cutout.y);
  hole.setAttribute("width", cutout.width);
  hole.setAttribute("height", cutout.height);
  hole.setAttribute("rx", borderRadius);
  hole.setAttribute("fill", "black");
  mask.appendChild(hole);
  svg.appendChild(mask);
  const overlayRect = document.createElementNS(svgNS, "rect");
  overlayRect.setAttribute("x", "0");
  overlayRect.setAttribute("y", "0");
  overlayRect.setAttribute("width", window.innerWidth);
  overlayRect.setAttribute("height", getPageHeight());
  overlayRect.setAttribute("fill", "currentColor");
  overlayRect.setAttribute("mask", `url(#${maskId})`);
  svg.appendChild(overlayRect);
  overlay.appendChild(svg);
  overlay.style.color = "rgba(0,0,0,0.5)";
  overlay.style.background = "transparent";
  document.body.appendChild(overlay);
  const modal = document.createElement("div");
  modal.className = `usa-modal uswds-tour-tooltip ${className ? className : ""}`;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "uswds-tour-title");
  modal.setAttribute("aria-describedby", "uswds-tour-desc");
  modal.style.zIndex = 1001;
  if (window.innerWidth < 800) {
    modal.style.position = "fixed";
    modal.style.left = "0";
    modal.style.right = "0";
    modal.style.bottom = "0";
    modal.style.top = "";
    modal.style.width = "100vw";
    modal.style.maxWidth = "100vw";
    modal.style.minWidth = "100vw";
    modal.style.borderRadius = "0";
    modal.style.margin = "0";
    modal.style.height = "auto";
    modal.style.maxHeight = "420px";
    modal.style.display = "block";
  } else {
    modal.style.position = "absolute";
    modal.style.width = "auto";
    modal.style.height = "auto";
    modal.style.display = "block";
    modal.style.minWidth = "320px";
    modal.style.maxWidth = "400px";
    modal.style.margin = "0";
  }
  let controls = "";
  if (showControls) {
    const nextLabel = isLastStep ? "End Tour" : "Next";
    controls = `
      <div class="usa-modal__footer">
        <ul class="usa-button-group">
          <li class="usa-button-group__item">
            <button type="button" class="usa-button usa-button--unstyled padding-105 text-center" id="uswds-tour-prev">Back</button>
          </li>
          <li class="usa-button-group__item">
            <button type="button" class="usa-button" id="uswds-tour-next">${nextLabel}</button>
          </li>
        </ul>
      </div>
    `;
  }
  modal.innerHTML = `
    <div class="usa-modal__content">
      <div class="usa-modal__main">
        <h2 class="usa-modal__heading" id="uswds-tour-title">${title}</h2>
        <div class="usa-prose" style="max-height:200px; overflow-y: auto;">
          <p id="uswds-tour-desc">${description}</p>
        </div>
        ${controls}
      </div>
      <button type="button" class="usa-button usa-modal__close" aria-label="Close this window" id="uswds-tour-close">
        <svg class="usa-icon padding-right-1" aria-hidden="true" focusable="false" role="img" style="width: 1.5rem; height: 1.5rem; vertical-align: middle;">
          <path d="M16.97 4.97a.75.75 0 0 0-1.06-1.06L12 7.94 8.09 3.91A.75.75 0 1 0 7.03 4.97l3.91 4.03-3.91 4.03a.75.75 0 1 0 1.06 1.06L12 10.06l3.91 4.03a.75.75 0 1 0 1.06-1.06l-3.91-4.03 3.91-4.03z"/>
        </svg>
      </button>
    </div>
  `;
  document.body.appendChild(modal);
  const tipRect = getAdjustedBoundingClientRect(modal);
  if (window.innerWidth >= 800) {
    let top = 0, left = 0;
    switch (position) {
      case "top":
        top = rect.top - tipRect.height - 2 * rem;
        left = rect.left - rem;
        break;
      case "right":
        top = rect.top - rem;
        left = rect.right + 2 * rem;
        break;
      case "left":
        top = rect.top - rem;
        left = rect.left - tipRect.width - 2 * rem;
        break;
      case "bottom":
      default:
        top = rect.bottom + 2 * rem;
        left = rect.left - rem;
        break;
    }
    modal.style.top = `${top}px`;
    modal.style.left = `${left}px`;
  }
  const closeBtn = modal.querySelector("#uswds-tour-close");
  const nextBtn = modal.querySelector("#uswds-tour-next");
  const prevBtn = modal.querySelector("#uswds-tour-prev");
  const focusable = [prevBtn, nextBtn, closeBtn].filter(Boolean);
  let focusIndex = 0;
  (focusable[0] || closeBtn).focus();
  function remove() {
    modal.remove();
    overlay.remove();
    if (target && typeof target.focus === "function" && document.body.contains(target)) {
      target.focus();
    }
    document.removeEventListener("keydown", keyHandler);
    window.removeEventListener("resize", updateOverlayDimensions);
  }
  if (closeBtn)
    closeBtn.addEventListener("click", () => {
      remove();
    });
  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      remove();
      if (onNext)
        onNext();
    });
  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      remove();
      if (onPrev)
        onPrev();
    });
  function keyHandler(e) {
    if (e.key === "Tab") {
      if (focusable.length === 0)
        return;
      e.preventDefault();
      if (e.shiftKey) {
        focusIndex = (focusIndex - 1 + focusable.length) % focusable.length;
      } else {
        focusIndex = (focusIndex + 1) % focusable.length;
      }
      focusable[focusIndex].focus();
    }
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      if (nextBtn) {
        e.preventDefault();
        nextBtn.focus();
        if (e.type === "keydown" && document.activeElement === nextBtn) {
          remove();
          if (onNext)
            onNext();
        }
      }
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      if (prevBtn) {
        e.preventDefault();
        prevBtn.focus();
        if (e.type === "keydown" && document.activeElement === prevBtn) {
          remove();
          if (onPrev)
            onPrev();
        }
      }
    }
    if (e.key === "Escape") {
      remove();
      if (onClose)
        onClose();
    }
  }
  document.addEventListener("keydown", keyHandler);
}
function startTour(steps = [], options = {}) {
  if (!Array.isArray(steps) || steps.length === 0) {
    const nodeList = Array.from(document.querySelectorAll("[data-tour-step]"));
    nodeList.sort((a, b) => {
      const sa = parseInt(a.getAttribute("data-tour-step"), 10);
      const sb = parseInt(b.getAttribute("data-tour-step"), 10);
      return sa - sb;
    });
    steps = nodeList.map((el) => ({
      element: el,
      title: el.getAttribute("data-tour-title") || "",
      description: el.getAttribute("data-tour-description") || "",
      position: el.getAttribute("data-tour-position") || "bottom",
      className: el.getAttribute("data-tour-class") || ""
    }));
  }
  let currentIndex = 0;
  const { onStart, onComplete, onStepChange } = options;
  let started = false;
  function showStep(index) {
    if (index < 0 || index >= steps.length) {
      if (started && typeof onComplete === "function")
        onComplete();
      started = false;
      return;
    }
    if (!started) {
      started = true;
      if (typeof onStart === "function")
        onStart();
    }
    if (typeof onStepChange === "function")
      onStepChange(index, steps[index]);
    const step = steps[index];
    showTooltip({
      ...step,
      showControls: true,
      isLastStep: index === steps.length - 1,
      onNext: () => showStep(index + 1),
      onPrev: () => showStep(index - 1),
      onClose: () => {
        if (started && typeof onComplete === "function")
          onComplete();
        started = false;
        currentIndex = 0;
      }
    });
  }
  showStep(currentIndex);
}
window.USWDSTour = {
  showTooltip,
  startTour
};
function getAdjustedBoundingClientRect(element) {
  const rect = element.getBoundingClientRect();
  const adjustedRect = {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    bottom: rect.bottom + window.scrollY,
    right: rect.right + window.scrollX,
    width: rect.width,
    height: rect.height
  };
  console.log("Adjusted Rect:", adjustedRect);
  console.log("Original Rect:", rect);
  return adjustedRect;
}
export {
  showTooltip,
  startTour
};
