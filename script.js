/* N Студия v3 */
(function () {
  "use strict";

  var rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Nav scroll shadow ── */
  var nav = document.getElementById("nav");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 6); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ── */
  var burger = document.getElementById("nav-burger");
  var mobileNav = document.getElementById("nav-mobile");
  if (burger && mobileNav) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      mobileNav.classList.toggle("is-open", !open);
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        burger.setAttribute("aria-expanded", "false");
        mobileNav.classList.remove("is-open");
      });
    });
  }

  /* ── Scroll reveal ── */
  var reveals = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (!rm && "IntersectionObserver" in window) {
    reveals.forEach(function (el) {
      var siblings = el.parentElement
        ? Array.prototype.filter.call(el.parentElement.children, function (c) { return c.hasAttribute("data-reveal"); })
        : [el];
      var idx = siblings.indexOf(el);
      el.style.setProperty("--d", Math.min(idx, 5) * 80 + "ms");
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.07 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ── Smooth scroll offset for sticky nav ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: rm ? "auto" : "smooth" });
      history.replaceState(null, "", id);
    });
  });

  /* ── Lead form ── */
  var form = document.getElementById("lead-form");
  if (form) {
    var success = form.querySelector(".lead-form__success");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.classList.add("tried");
      if (!form.checkValidity()) {
        var bad = form.querySelector("input:invalid");
        if (bad) bad.focus();
        return;
      }
      form.classList.add("sent");
      if (success) success.hidden = false;
      form.scrollIntoView({ behavior: rm ? "auto" : "smooth", block: "center" });
    });
  }
})();
