const form = document.querySelector("#form-waitlist");
const statusBox = document.querySelector("#form-status");
const submitButton = form?.querySelector('button[type="submit"]');
const telefoneInput = form?.querySelector("#telefone");
const currentYearEl = document.querySelector("#current-year");
const customSelectInstances = new Set();
const countdownControllers = new WeakMap();

const API_BASE_URL = window.API_BASE_URL ?? "/api";
const COUNTDOWN_TIME_ZONE = "America/Sao_Paulo";

if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

function showStatus(message, { isError = false } = {}) {
  if (!statusBox) return;
  statusBox.textContent = message;
  statusBox.classList.add("is-visible");
  statusBox.classList.toggle("is-success", !isError);
  statusBox.classList.toggle("is-error", isError);
}

function clearStatus() {
  if (!statusBox) return;
  statusBox.textContent = "";
  statusBox.classList.remove("is-visible", "is-success", "is-error");
}

function enhanceSelect(select) {
  if (!select) return;
  if (select.dataset.enhanced === "true") return;

  const wrapper = document.createElement("div");
  wrapper.className = "custom-select";

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "custom-select__trigger";
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");

  const valueSpan = document.createElement("span");
  valueSpan.className = "custom-select__value";
  trigger.appendChild(valueSpan);

  const arrowSpan = document.createElement("span");
  arrowSpan.className = "custom-select__arrow";
  trigger.appendChild(arrowSpan);

  const list = document.createElement("ul");
  list.className = "custom-select__list";
  list.setAttribute("role", "listbox");
  list.tabIndex = -1;

  const optionElements = Array.from(select.options).map((option, index) => {
    const item = document.createElement("li");
    item.className = "custom-select__option";
    item.dataset.value = option.value;
    item.textContent = option.textContent;
    item.setAttribute("role", "option");
    item.id = `${select.id || "select"}-option-${index}`;

    if (option.disabled) {
      item.setAttribute("aria-disabled", "true");
    }

    if (option.selected) {
      item.classList.add("is-selected");
      item.setAttribute("aria-selected", "true");
    } else {
      item.setAttribute("aria-selected", "false");
    }

    list.appendChild(item);
    return item;
  });

  select.parentNode.insertBefore(wrapper, select);
  wrapper.append(trigger, list, select);
  select.classList.add("custom-select__native");
  select.setAttribute("tabindex", "-1");
  select.dataset.enhanced = "true";

  let activeIndex = -1;

  function getEnabledOptions() {
    return optionElements.filter((element) => element.getAttribute("aria-disabled") !== "true");
  }

  function updateSelected(value) {
    const selectedOption = optionElements.find((optionElement) => optionElement.dataset.value === value && optionElement.getAttribute("aria-disabled") !== "true");
    optionElements.forEach((optionElement) => {
      const isSelected = optionElement === selectedOption;
      optionElement.classList.toggle("is-selected", isSelected);
      optionElement.setAttribute("aria-selected", isSelected ? "true" : "false");
    });

    const label = selectedOption ?? optionElements[0];
    if (label) {
      valueSpan.textContent = label.textContent;
    }

    const enabled = getEnabledOptions();
    const selectedValue = selectedOption?.dataset.value ?? "";
    const enabledIndex = enabled.findIndex((optionElement) => optionElement.dataset.value === selectedValue);
    if (enabledIndex !== -1) {
      activeIndex = enabledIndex;
    }

    wrapper.classList.toggle("is-placeholder", !value);
    wrapper.classList.remove("has-error");
    trigger.removeAttribute("aria-invalid");
  }

  function resetActiveOption() {
    activeIndex = -1;
    const enabled = getEnabledOptions();
    enabled.forEach((optionElement) => {
      optionElement.classList.remove("is-active");
    });
    list.removeAttribute("aria-activedescendant");
  }

  function setActiveOption(index) {
    const enabled = getEnabledOptions();
    if (!enabled.length) return;
    const boundedIndex = ((index % enabled.length) + enabled.length) % enabled.length;
    activeIndex = boundedIndex;
    enabled.forEach((optionElement, idx) => {
      optionElement.classList.toggle("is-active", idx === boundedIndex);
    });
    const activeOption = enabled[boundedIndex];
    if (activeOption) {
      list.setAttribute("aria-activedescendant", activeOption.id);
      activeOption.scrollIntoView({ block: "nearest" });
    }
  }

  function closeList(focusTrigger = false) {
    if (!wrapper.classList.contains("is-open")) return;
    wrapper.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    resetActiveOption();
    if (focusTrigger) {
      trigger.focus();
    }
  }

  function openList({ alignWithCurrent = false } = {}) {
    if (wrapper.classList.contains("is-open")) return;
    wrapper.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
    if (alignWithCurrent) {
      const currentValue = select.value;
      const enabled = getEnabledOptions();
      const currentIndex = enabled.findIndex((optionElement) => optionElement.dataset.value === currentValue);
      if (currentIndex !== -1) {
        setActiveOption(currentIndex);
      } else {
        resetActiveOption();
      }
    } else {
      resetActiveOption();
    }
    window.requestAnimationFrame(() => {
      list.focus();
    });
  }

  function toggleList() {
    if (wrapper.classList.contains("is-open")) {
      closeList(true);
    } else {
      openList();
    }
  }

  function chooseOption(optionElement) {
    if (!optionElement || optionElement.getAttribute("aria-disabled") === "true") return;
    const previousValue = select.value;
    select.value = optionElement.dataset.value;
    if (previousValue !== select.value) {
      select.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      updateSelected(select.value);
    }
    closeList(true);
  }

  trigger.addEventListener("click", () => {
    toggleList();
  });

  list.addEventListener("click", (event) => {
    const optionElement = event.target.closest(".custom-select__option");
    if (!optionElement) return;
    event.preventDefault();
    chooseOption(optionElement);
  });

  function handleKeyboard(event) {
    const enabled = getEnabledOptions();
    if (!enabled.length) return;

    switch (event.key) {
      case "ArrowDown":
      case "Down":
        event.preventDefault();
        if (!wrapper.classList.contains("is-open")) {
          openList({ alignWithCurrent: true });
        }
        setActiveOption(activeIndex === -1 ? 0 : activeIndex + 1);
        break;
      case "ArrowUp":
      case "Up":
        event.preventDefault();
        if (!wrapper.classList.contains("is-open")) {
          openList({ alignWithCurrent: true });
        }
        setActiveOption(activeIndex === -1 ? enabled.length - 1 : activeIndex - 1);
        break;
      case "Home":
        event.preventDefault();
        if (!wrapper.classList.contains("is-open")) {
          openList({ alignWithCurrent: true });
        }
        setActiveOption(0);
        break;
      case "End":
        event.preventDefault();
        if (!wrapper.classList.contains("is-open")) {
          openList({ alignWithCurrent: true });
        }
        setActiveOption(enabled.length - 1);
        break;
      case " ":
      case "Enter":
        event.preventDefault();
        if (!wrapper.classList.contains("is-open")) {
          openList({ alignWithCurrent: true });
        } else {
          const activeOption = enabled[activeIndex];
          chooseOption(activeOption);
        }
        break;
      case "Tab":
        if (wrapper.classList.contains("is-open")) {
          closeList();
        }
        break;
      case "Escape":
        if (wrapper.classList.contains("is-open")) {
          event.preventDefault();
          closeList(true);
        }
        break;
      default:
        break;
    }
  }

  trigger.addEventListener("keydown", handleKeyboard);
  list.addEventListener("keydown", handleKeyboard);

  select.addEventListener("change", () => {
    updateSelected(select.value);
  });

  select.addEventListener("invalid", (event) => {
    event.preventDefault();
    wrapper.classList.add("has-error");
    trigger.setAttribute("aria-invalid", "true");
    trigger.focus();
  });

  if (select.form) {
    select.form.addEventListener("reset", () => {
      window.requestAnimationFrame(() => {
        updateSelected(select.value);
      });
    });
  }

  updateSelected(select.value);
  customSelectInstances.add({
    wrapper,
    close: (focusTrigger = false) => closeList(focusTrigger),
    isOpen: () => wrapper.classList.contains("is-open")
  });
}

function getTimeZoneOffsetMs(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  })
    .formatToParts(date)
    .reduce((accumulator, part) => {
      if (part.type !== "literal") {
        accumulator[part.type] = part.value;
      }
      return accumulator;
    }, {});

  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );

  return asUtc - date.getTime();
}

function parseCountdownTarget(rawTarget, timeZone) {
  if (!rawTarget) return null;

  const trimmed = rawTarget.trim();
  if (!trimmed) return null;

  const hasExplicitOffset = /([zZ]|[+-]\d\d:\d\d)$/.test(trimmed);
  if (hasExplicitOffset) {
    const dateWithOffset = new Date(trimmed);
    return Number.isNaN(dateWithOffset.getTime()) ? null : dateWithOffset;
  }

  const [datePart, timePart = "00:00:00"] = trimmed.replace(/\s+/, "T").split("T");
  if (!datePart) return null;

  const [yearString, monthString = "01", dayString = "01"] = datePart.split("-");
  const [hourString = "00", minuteString = "00", secondString = "00"] = timePart.split(":");

  const components = [
    Number(yearString),
    Number(monthString),
    Number(dayString),
    Number(hourString),
    Number(minuteString),
    Number(secondString)
  ];

  if (components.some((value) => Number.isNaN(value))) {
    return null;
  }

  const [year, month, day, hour, minute, second] = components;
  const baseUtcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  const offsetMs = getTimeZoneOffsetMs(baseUtcDate, timeZone);
  return new Date(baseUtcDate.getTime() - offsetMs);
}

function initializeCountdowns() {
  const countdownElements = document.querySelectorAll("[data-target-date]");
  if (!countdownElements.length) return;

  countdownElements.forEach((element) => {
    if (countdownControllers.has(element)) {
      return;
    }

    const rawTarget = element.dataset.targetDate;
    if (!rawTarget) return;

    const targetDate = parseCountdownTarget(rawTarget, COUNTDOWN_TIME_ZONE);

    if (Number.isNaN(targetDate.getTime())) return;

    const partElements = {
      days: element.querySelector('[data-countdown-part="days"]'),
      hours: element.querySelector('[data-countdown-part="hours"]'),
      minutes: element.querySelector('[data-countdown-part="minutes"]'),
      seconds: element.querySelector('[data-countdown-part="seconds"]')
    };

    const hasAllParts = Object.values(partElements).every(Boolean);
    if (!hasAllParts) return;

    function format(value, minLength = 2) {
      return String(Math.max(0, value)).padStart(minLength, "0");
    }

    function updateCountdown() {
      const now = new Date();
      let diffMs = targetDate.getTime() - now.getTime();
      if (diffMs < 0) {
        diffMs = 0;
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      partElements.days.textContent = format(days, 2);
      partElements.hours.textContent = format(hours);
      partElements.minutes.textContent = format(minutes);
      partElements.seconds.textContent = format(seconds);

      element.dataset.countdownState = diffMs === 0 ? "finished" : "running";
      element.setAttribute(
        "aria-label",
        diffMs === 0
          ? "Evento iniciado"
          : `Faltam ${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos`
      );

      if (diffMs === 0) {
        const intervalId = countdownControllers.get(element);
        if (intervalId) {
          window.clearInterval(intervalId);
        }
      }
    }

    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);
    countdownControllers.set(element, intervalId);
  });
}

document.addEventListener("click", (event) => {
  customSelectInstances.forEach((instance) => {
    if (!instance.wrapper.contains(event.target)) {
      instance.close();
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  let handled = false;
  customSelectInstances.forEach((instance) => {
    if (instance.isOpen()) {
      instance.close(true);
      handled = true;
    }
  });
  if (handled) {
    event.preventDefault();
  }
});

function formatPhone(value = "") {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`.trim();
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function handlePhoneInput(event) {
  const input = event.target;
  const cursorPosition = input.selectionStart ?? 0;
  const digitsBeforeCursor = input.value.slice(0, cursorPosition).replace(/\D/g, "");

  input.value = formatPhone(input.value);

  let newCursor = input.value.length;
  let digitCount = 0;
  for (let i = 0; i < input.value.length; i += 1) {
    if (/\d/.test(input.value[i])) {
      digitCount += 1;
    }
    if (digitCount === digitsBeforeCursor.length) {
      newCursor = i + 1;
      break;
    }
  }

  input.setSelectionRange(newCursor, newCursor);
}

async function handleSubmit(event) {
  event.preventDefault();
  clearStatus();

  if (!form) return;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    submitButton?.setAttribute("disabled", "true");

    const response = await fetch(`${API_BASE_URL}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const { message } = await response.json().catch(() => ({ message: "Erro desconhecido" }));
      throw new Error(message || "Falha ao enviar. Tente novamente.");
    }

    form.reset();
    updateSelectedSelects();
    showStatus("Obrigado! Seu nome está na lista.", { isError: false });
  } catch (error) {
    console.error("Erro ao enviar lead", error);
    let message = "Ops! Algo deu errado. Tente novamente.";
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      message = "Não foi possível conectar à API. Verifique se o servidor está rodando.";
    } else if (error.message) {
      message = error.message;
    }
    showStatus(message, { isError: true });
  } finally {
    submitButton?.removeAttribute("disabled");
  }
}

if (telefoneInput) {
  telefoneInput.addEventListener("input", handlePhoneInput);
}

initializeCountdowns();

function updateSelectedSelects() {
  customSelectInstances.forEach((instance) => {
    const nativeSelect = instance.wrapper.querySelector(".custom-select__native");
    if (!nativeSelect) return;
    nativeSelect.value = "";
    nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
    instance.close();
    instance.wrapper.classList.add("is-placeholder");
  });
}

if (form) {
  form.addEventListener("submit", handleSubmit);
}

const atuacaoSelect = document.querySelector("#atuacao");
if (atuacaoSelect) {
  enhanceSelect(atuacaoSelect);
}

