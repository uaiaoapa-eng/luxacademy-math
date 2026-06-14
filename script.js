/* =========================================================
   LUX ACADEMY 수학관 — 인터랙션
   ========================================================= */
(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- 모바일 메뉴 ---------- */
  const burger = $("#burger");
  const moMenu = $("#moMenu");
  const moAcc = $("#moAcc");

  if (burger && moMenu) {
    burger.addEventListener("click", () => {
      const open = moMenu.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
  }
  if (moAcc) moAcc.querySelector("button").addEventListener("click", () => moAcc.classList.toggle("open"));
  // 메뉴 내 링크 클릭 시 닫기
  $$("#moMenu a").forEach((a) =>
    a.addEventListener("click", () => {
      moMenu.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    })
  );

  /* ---------- 실적 탭 (MAIN-07) ---------- */
  const tabs = $$(".tab");
  function activateTab(name) {
    tabs.forEach((t) => t.classList.toggle("active", t.dataset.tab === name));
    $$(".tab-panel").forEach((p) => p.classList.toggle("active", p.id === "tab-" + name));
  }
  tabs.forEach((t) => t.addEventListener("click", () => {
    activateTab(t.dataset.tab);
    if (t.dataset.tab === "up") history.replaceState(null, "", "#results-up");
  }));
  // URL 해시로 직접 진입 (#results-up)
  if (location.hash === "#results-up") activateTab("up");

  /* ---------- FAQ 아코디언 (MAIN-10) ---------- */
  $$(".faq-q").forEach((q) =>
    q.addEventListener("click", () => {
      const item = q.closest(".faq-item");
      const a = item.querySelector(".faq-a");
      const isOpen = item.classList.toggle("open");
      a.style.maxHeight = isOpen ? a.scrollHeight + "px" : "0";
    })
  );
  // 기본 열림 항목 높이 세팅
  $$(".faq-item.open .faq-a").forEach((a) => (a.style.maxHeight = a.scrollHeight + "px"));

  /* ---------- 입학테스트 신청 폼 (MAIN-09 / SUB-ADM-01) ---------- */
  const form = $("#applyForm");
  // 폼 수신 이메일 (실 사이트 고객센터 기준). 운영 시 아임웹 폼/알림톡으로 교체 권장.
  const FORM_EMAIL = "luxacademy2024@naver.com";
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const f = new FormData(form);
      const name = (f.get("name") || "").toString().trim();
      const subject = `[입학테스트 신청] ${name} 학생`;
      const body = [
        `학생 이름: ${f.get("name") || ""}`,
        `학교·학년: ${f.get("school") || ""}`,
        `학부모 연락처: ${f.get("phone") || ""}`,
        `희망 과정: ${f.get("course") || ""}`,
        "",
        "(럭스아카데미 홈페이지 입학테스트 신청)",
      ].join("\n");
      // 실제 수신 이메일로 메일 작성 (사용자 메일앱에서 발송)
      window.location.href =
        `mailto:${FORM_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      form.style.display = "none";
      const done = $("#formDone");
      if (done) done.classList.add("show");
    });
  }

  /* ---------- 숫자 카운팅 (MAIN-02, 1회) ---------- */
  function countUp(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.querySelector(".u") ? el.querySelector(".u").outerHTML : "";
    const dur = 1200;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.innerHTML = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Reveal + 카운팅 IntersectionObserver ---------- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add("in");
          // 스탯 카드 안의 카운트 숫자 실행
          $$(".num[data-count]", en.target).forEach((n) => {
            if (!n.dataset.done) { n.dataset.done = "1"; countUp(n); }
          });
          obs.unobserve(en.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    $$(".reveal").forEach((el) => io.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("in"));
    $$(".num[data-count]").forEach((n) => (n.textContent = n.dataset.count + (n.dataset.suffix || "")));
  }

  /* ---------- 모바일 하단 CTA 바: 폼 진입 시 숨김 ---------- */
  const moBar = $("#moBar");
  const applySec = $("#apply");
  if (moBar && applySec && "IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => entries.forEach((en) => moBar.classList.toggle("hide", en.isIntersecting)),
      { threshold: 0.25 }
    ).observe(applySec);
  }

  /* ---------- 스크롤 시 GNB 전환 (투명↔흰 배경) ---------- */
  const gnb = $("#gnb");
  const onScroll = () => gnb.classList.toggle("gnb--solid", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
