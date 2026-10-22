(function () {
  const nav = document.getElementById("site-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navBackdrop = document.querySelector(".nav-backdrop");
  const subToggle = document.querySelector(".sub-toggle");
  const subItem = document.querySelector(".has-sub");
  const live = document.getElementById("live-status");
  const mq = window.matchMedia("(max-width: 979px)");
  const CART_KEY = "chiaras-cart-v1";

  let lockCount = 0;
  let activeDialog = null;
  let lastFocus = null;

  function setStatus(message) {
    if (!live) return;
    live.textContent = "";
    window.setTimeout(function () {
      live.textContent = message;
    }, 30);
  }

  function lockScroll(on) {
    lockCount += on ? 1 : -1;
    if (lockCount < 0) lockCount = 0;
    document.body.classList.toggle("is-locked", lockCount > 0);
  }

  function isVisible(el) {
    if (!el || el.closest("[hidden]")) return false;
    const style = window.getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden";
  }

  function focusable(root) {
    return Array.from(
      root.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(isVisible);
  }

  function trapTab(event, root) {
    if (event.key !== "Tab") return;
    const items = focusable(root);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function syncNav() {
    if (!nav) return;
    const mobile = mq.matches;
    const open = nav.classList.contains("is-open");
    if (!mobile) {
      nav.classList.remove("is-open");
      nav.removeAttribute("aria-hidden");
      nav.removeAttribute("inert");
      if (navBackdrop) navBackdrop.classList.remove("is-open");
      if (navToggle) navToggle.setAttribute("aria-expanded", "false");
      return;
    }
    nav.setAttribute("aria-hidden", open ? "false" : "true");
    if (open) nav.removeAttribute("inert");
    else nav.setAttribute("inert", "");
  }

  function openNav() {
    if (!nav || !navToggle) return;
    lastFocus = document.activeElement;
    nav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    if (navBackdrop) navBackdrop.classList.add("is-open");
    lockScroll(true);
    syncNav();
    const first = focusable(nav)[0];
    if (first) first.focus();
  }

  function closeNav(restore) {
    if (!nav || !navToggle) return;
    const wasOpen = nav.classList.contains("is-open");
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    if (navBackdrop) navBackdrop.classList.remove("is-open");
    if (wasOpen) lockScroll(false);
    syncNav();
    if (restore && wasOpen && lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) closeNav(true);
      else openNav();
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener("click", function () {
      closeNav(true);
    });
  }

  if (nav) {
    nav.addEventListener("click", function (event) {
      const link = event.target.closest("a");
      if (link && mq.matches) closeNav(false);
    });
  }

  function closeSub() {
    if (!subItem || !subToggle) return;
    subItem.classList.remove("is-open");
    subToggle.setAttribute("aria-expanded", "false");
  }

  if (subToggle && subItem) {
    subToggle.addEventListener("click", function () {
      const open = subItem.classList.toggle("is-open");
      subToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (event) {
      if (!subItem.contains(event.target)) closeSub();
    });
  }

  if (mq.addEventListener) {
    mq.addEventListener("change", function () {
      if (!mq.matches) closeNav(false);
      syncNav();
    });
  }
  syncNav();

  function setBackgroundInert(on) {
    Array.from(document.body.children).forEach(function (el) {
      if (el.classList && el.classList.contains("dialog")) return;
      if (el.id === "live-status") return;
      if (on) el.setAttribute("inert", "");
      else el.removeAttribute("inert");
    });
  }

  function openDialog(dialog) {
    if (!dialog) return;
    lastFocus = document.activeElement;
    activeDialog = dialog;
    dialog.hidden = false;
    setBackgroundInert(true);
    lockScroll(true);
    const panel = dialog.querySelector(".dialog__panel");
    const first = panel ? focusable(panel)[0] : null;
    if (first) first.focus();
  }

  function closeDialog() {
    if (!activeDialog) return;
    const dialog = activeDialog;
    dialog.hidden = true;
    activeDialog = null;
    setBackgroundInert(false);
    syncNav();
    lockScroll(false);
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  document.querySelectorAll("[data-open-dialog]").forEach(function (button) {
    button.addEventListener("click", function () {
      openDialog(document.getElementById(button.getAttribute("data-open-dialog")));
    });
  });

  document.querySelectorAll("[data-close-dialog]").forEach(function (button) {
    button.addEventListener("click", closeDialog);
  });

  document.addEventListener("keydown", function (event) {
    if (activeDialog) {
      const panel = activeDialog.querySelector(".dialog__panel");
      if (panel) trapTab(event, panel);
    } else if (nav && nav.classList.contains("is-open")) {
      trapTab(event, nav);
    }
    if (event.key !== "Escape") return;
    if (activeDialog) {
      event.preventDefault();
      closeDialog();
      return;
    }
    if (nav && nav.classList.contains("is-open")) {
      event.preventDefault();
      closeNav(true);
      return;
    }
    if (subItem && subItem.classList.contains("is-open")) {
      closeSub();
      if (subToggle) subToggle.focus();
    }
  });

  function readCart() {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function writeCart(items) {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    renderCart();
  }

  function money(value) {
    const number = Number(value);
    if (Number.isInteger(number)) return "$" + number;
    return "$" + number.toFixed(2);
  }

  function renderCart() {
    const items = readCart();
    const count = items.reduce(function (sum, item) {
      return sum + item.qty;
    }, 0);
    const badge = document.querySelector(".cart-count");
    const cartButton = document.querySelector(".cart-open");
    if (badge) {
      badge.textContent = String(count);
      badge.hidden = count === 0;
    }
    if (cartButton) {
      cartButton.setAttribute("aria-label", count ? "Open cart, " + count + " items" : "Open cart, empty");
    }
    const list = document.querySelector(".cart-list");
    const sub = document.querySelector(".cart-sub");
    const empty = document.querySelector(".cart-empty");
    if (!list || !sub || !empty) return;
    list.innerHTML = "";
    if (!items.length) {
      empty.hidden = false;
      sub.hidden = true;
      return;
    }
    empty.hidden = true;
    sub.hidden = false;
    let total = 0;
    items.forEach(function (item) {
      total += item.price * item.qty;
      const li = document.createElement("li");
      const name = document.createElement("p");
      name.textContent = item.name;
      name.style.margin = "0";
      name.style.fontWeight = "700";
      const meta = document.createElement("div");
      meta.className = "qty";
      const minus = document.createElement("button");
      minus.type = "button";
      minus.textContent = "−";
      minus.setAttribute("aria-label", "Decrease " + item.name);
      const qty = document.createElement("span");
      qty.textContent = String(item.qty);
      const plus = document.createElement("button");
      plus.type = "button";
      plus.textContent = "+";
      plus.setAttribute("aria-label", "Increase " + item.name);
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "btn btn--small";
      remove.textContent = "Remove";
      remove.style.gridColumn = "1 / -1";
      minus.addEventListener("click", function () {
        updateQty(item.id, item.qty - 1);
      });
      plus.addEventListener("click", function () {
        updateQty(item.id, item.qty + 1);
      });
      remove.addEventListener("click", function () {
        updateQty(item.id, 0);
      });
      meta.append(minus, qty, plus);
      const price = document.createElement("p");
      price.style.margin = "0";
      price.textContent = money(item.price * item.qty);
      li.append(name, price, meta, remove);
      list.append(li);
    });
    sub.textContent = "Subtotal " + money(total);
  }

  function updateQty(id, qty) {
    const items = readCart().filter(function (item) {
      return item.id !== id || qty > 0;
    }).map(function (item) {
      if (item.id === id) item.qty = qty;
      return item;
    });
    const next = qty > 0 ? items : items.filter(function (item) { return item.id !== id; });
    writeCart(next);
  }

  document.querySelectorAll("[data-add]").forEach(function (button) {
    button.addEventListener("click", function () {
      const id = button.getAttribute("data-id");
      const name = button.getAttribute("data-name");
      const price = Number(button.getAttribute("data-price"));
      const items = readCart();
      const existing = items.find(function (item) { return item.id === id; });
      if (existing) existing.qty += 1;
      else items.push({ id: id, name: name, price: price, qty: 1 });
      writeCart(items);
      setStatus(name + " added to the demo cart.");
    });
  });

  renderCart();

  function showFormErrors(form, errors) {
    const summary = form.querySelector(".form-errors");
    form.querySelectorAll(".error").forEach(function (node) { node.remove(); });
    form.querySelectorAll("[aria-invalid]").forEach(function (field) {
      field.removeAttribute("aria-invalid");
    });
    const names = Object.keys(errors);
    if (!names.length) {
      if (summary) {
        summary.hidden = true;
        summary.innerHTML = "";
      }
      return;
    }
    if (summary) {
      summary.hidden = false;
      const list = document.createElement("ul");
      names.forEach(function (name) {
        const li = document.createElement("li");
        li.textContent = errors[name];
        list.append(li);
        const field = form.elements[name];
        if (!field) return;
        const target = field.length && !field.tagName ? field[0] : field;
        target.setAttribute("aria-invalid", "true");
        const message = document.createElement("p");
        message.className = "error";
        message.textContent = errors[name];
        const holder = target.closest(".field") || target.parentElement;
        if (holder) holder.append(message);
      });
      summary.innerHTML = "";
      const title = document.createElement("p");
      title.style.margin = "0 0 0.35rem";
      title.textContent = "Please fix the following:";
      summary.append(title, list);
      summary.focus();
    }
  }

  function emailOk(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  document.querySelectorAll("form.js-form").forEach(function (form) {
    const date = form.querySelector('input[type="date"]');
    if (date) {
      const today = new Date();
      const iso = today.toISOString().slice(0, 10);
      date.min = iso;
    }
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const kind = form.getAttribute("data-form");
      const data = new FormData(form);
      const errors = {};
      if (kind === "newsletter") {
        const email = String(data.get("email") || "").trim();
        if (!emailOk(email)) errors.email = "Enter an email address like name@example.com.";
        if (!data.get("consent")) errors.consent = "Confirm you understand this demo does not send mail.";
      } else if (kind === "contact") {
        if (!String(data.get("name") || "").trim()) errors.name = "Enter your name.";
        if (!emailOk(String(data.get("email") || "").trim())) errors.email = "Enter an email address like name@example.com.";
        if (String(data.get("message") || "").trim().length < 10) errors.message = "Write a message of at least 10 characters.";
        if (!data.get("consent")) errors.consent = "Confirm you understand this form stays on this page.";
      } else if (kind === "inquiry") {
        if (!String(data.get("name") || "").trim()) errors.name = "Enter your name.";
        if (!emailOk(String(data.get("email") || "").trim())) errors.email = "Enter an email address like name@example.com.";
        if (!data.get("date")) errors.date = "Choose an event date.";
        else if (data.get("date") < new Date().toISOString().slice(0, 10)) errors.date = "Choose today or a future date.";
        if (!String(data.get("flavor") || "").trim()) errors.flavor = "Tell us a flavor direction.";
        if (!data.get("consent")) errors.consent = "Confirm you understand this request is not sent.";
      }
      showFormErrors(form, errors);
      if (Object.keys(errors).length) {
        setStatus("The form needs a few fixes.");
        return;
      }
      form.querySelectorAll(":scope > h2, :scope > .form-grid, :scope > .field, :scope > .check, :scope > .form-note, :scope > button").forEach(function (node) {
        node.hidden = true;
      });
      const done = form.querySelector(".success-panel");
      if (done) {
        done.hidden = false;
        const heading = done.querySelector("h2, h3");
        if (heading) heading.focus();
      }
      if (kind === "newsletter") setStatus("Newsletter note saved on this page only. Nothing was sent.");
      else if (kind === "contact") setStatus("Message kept on this page only. Nothing was sent.");
      else setStatus("Cake inquiry kept on this page only. Nothing was sent.");
    });
  });

  const searchInput = document.getElementById("site-search");
  if (searchInput) {
    const existingQuery = new URLSearchParams(window.location.search).get("q");
    if (existingQuery) searchInput.value = existingQuery;
  }

  const filterRoot = document.querySelector("[data-filters]");
  if (filterRoot) {
    const chips = Array.from(filterRoot.querySelectorAll(".chip"));
    const cards = Array.from(document.querySelectorAll("[data-category]"));
    const groups = Array.from(document.querySelectorAll(".menu-group"));
    const empty = document.querySelector(".empty-state");
    const params = new URLSearchParams(window.location.search);
    const query = (params.get("q") || "").trim().toLowerCase();
    const queryNote = document.querySelector(".query-note");
    let active = "all";
    const hash = window.location.hash.replace("#", "");
    if (chips.some(function (chip) { return chip.getAttribute("data-filter") === hash; })) {
      active = hash;
    }

    function applyFilters() {
      let shown = 0;
      cards.forEach(function (card) {
        const category = card.getAttribute("data-category");
        const text = card.textContent.toLowerCase();
        const categoryOk = active === "all" || category === active;
        const queryOk = !query || text.indexOf(query) !== -1;
        const visible = categoryOk && queryOk;
        card.hidden = !visible;
        if (visible) shown += 1;
      });
      groups.forEach(function (group) {
        const visibleCard = group.querySelector("[data-category]:not([hidden])");
        group.hidden = !visibleCard;
      });
      if (empty) empty.hidden = shown !== 0;
      chips.forEach(function (chip) {
        const on = chip.getAttribute("data-filter") === active;
        chip.setAttribute("aria-pressed", on ? "true" : "false");
      });
      if (queryNote) {
        queryNote.hidden = !query;
        queryNote.textContent = query
          ? "Showing " + shown + " result" + (shown === 1 ? "" : "s") + " for “" + query + "”."
          : "";
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        active = chip.getAttribute("data-filter");
        applyFilters();
      });
    });
    applyFilters();
  }
})();
