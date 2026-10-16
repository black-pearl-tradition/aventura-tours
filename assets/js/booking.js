(() => {
  const form = document.querySelector("#booking-form");

  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  const tour = form.querySelector("#tour");
  const date = form.querySelector("#date");
  const guests = form.querySelector("#guests");
  const paymentPlan = form.querySelector("#payment-plan");
  const paymentMethod = form.querySelector("#payment-method");
  const estimate = form.querySelector("#booking-estimate");
  const status = form.querySelector("#booking-status");
  const prices = new Map([
    ["Wild Uganda Safari", 3108000],
    ["Nile River Cruise", 1165500],
    ["Kampala City Secrets", 207200],
    ["Weekend Getaways", 647500],
  ]);

  if (!(tour instanceof HTMLSelectElement) || !(date instanceof HTMLInputElement) ||
      !(guests instanceof HTMLInputElement) || !(paymentPlan instanceof HTMLSelectElement) ||
      !(paymentMethod instanceof HTMLSelectElement) || !estimate || !status) {
    throw new Error("The booking form is missing a required control.");
  }

  const localToday = new Date();
  localToday.setMinutes(localToday.getMinutes() - localToday.getTimezoneOffset());
  date.min = localToday.toISOString().slice(0, 10);

  const calendar = form.querySelector("#booking-calendar");
  const calendarToggle = form.querySelector(".date-picker-toggle");
  const calendarMonthLabel = form.querySelector("[data-calendar-month]");
  const calendarDays = form.querySelector("[data-calendar-days]");
  const previousMonth = form.querySelector("[data-calendar-previous]");
  const nextMonth = form.querySelector("[data-calendar-next]");
  if (!(calendar instanceof HTMLElement) || !(calendarToggle instanceof HTMLButtonElement) ||
      !(calendarMonthLabel instanceof HTMLElement) || !(calendarDays instanceof HTMLElement) ||
      !(previousMonth instanceof HTMLButtonElement) || !(nextMonth instanceof HTMLButtonElement)) {
    throw new Error("The booking calendar is missing a required control.");
  }

  const today = new Date(`${date.min}T00:00:00`);
  const monthFormatter = new Intl.DateTimeFormat("en-UG", { month: "long", year: "numeric" });
  const dayFormatter = new Intl.DateTimeFormat("en-UG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  let visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const renderCalendar = () => {
    calendarMonthLabel.textContent = monthFormatter.format(visibleMonth);
    previousMonth.disabled = visibleMonth.getFullYear() === today.getFullYear() &&
      visibleMonth.getMonth() === today.getMonth();
    calendarDays.replaceChildren();

    const firstWeekday = (new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1).getDay() + 6) % 7;
    const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();

    for (let blank = 0; blank < firstWeekday; blank += 1) {
      const spacer = document.createElement("span");
      spacer.setAttribute("aria-hidden", "true");
      calendarDays.append(spacer);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateValue = `${visibleMonth.getFullYear()}-${String(visibleMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayDate = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "booking-calendar-day";
      button.textContent = String(day);
      button.setAttribute("aria-label", dayFormatter.format(dayDate));
      button.setAttribute("aria-pressed", String(date.value === dateValue));
      button.disabled = dateValue < date.min;
      button.addEventListener("click", () => {
        date.value = dateValue;
        date.dispatchEvent(new Event("input", { bubbles: true }));
        date.dispatchEvent(new Event("change", { bubbles: true }));
        calendar.hidden = true;
        calendarToggle.setAttribute("aria-expanded", "false");
        date.focus();
      });
      calendarDays.append(button);
    }
  };

  calendarToggle.addEventListener("click", () => {
    const isOpen = calendar.hidden;
    calendar.hidden = !isOpen;
    calendarToggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      if (date.value) {
        const [year, month] = date.value.split("-").map(Number);
        visibleMonth = new Date(year, month - 1, 1);
      }
      renderCalendar();
    }
  });
  previousMonth.addEventListener("click", () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
    renderCalendar();
  });
  nextMonth.addEventListener("click", () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
    renderCalendar();
  });
  date.addEventListener("change", () => {
    if (date.value) {
      const [year, month] = date.value.split("-").map(Number);
      visibleMonth = new Date(year, month - 1, 1);
    }
    if (!calendar.hidden) renderCalendar();
  });

  const updateEstimate = () => {
    const price = prices.get(tour.value);
    const guestCount = Number(guests.value);

    if (tour.value === "Custom Itinerary") {
      estimate.textContent = "Custom itinerary pricing is tailored to your plans. Our team will prepare a quote and confirm any deposit before payment.";
      return;
    }

    if (price === undefined || !Number.isInteger(guestCount) || guestCount < 1) {
      estimate.textContent = "Choose a tour and guest count to see an estimated starting price.";
      return;
    }

    const total = new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      currencyDisplay: "code",
      maximumFractionDigits: 0,
    }).format(price * guestCount);
    const totalLabel = `Estimated starting total for ${guestCount} ${guestCount === 1 ? "guest" : "guests"}: <strong>${total}</strong>.`;
    const paymentLabel = paymentPlan.value === "Full estimated amount"
      ? ` Your preference is to pay the full estimated amount (${total}); the final quote will be confirmed by our team.`
      : paymentPlan.value === "Deposit (amount to be confirmed)"
        ? " Your preference is to pay a deposit; our team will confirm the deposit amount in your quote."
        : "";
    estimate.innerHTML = `${totalLabel}${paymentLabel} Based on listed starting prices; no payment will be taken online.`;
  };

  const selectedTour = new URLSearchParams(window.location.search).get("tour");
  if (selectedTour && [...tour.options].some((option) => option.value === selectedTour)) {
    tour.value = selectedTour;
  }

  tour.addEventListener("change", updateEstimate);
  guests.addEventListener("input", updateEstimate);
  paymentPlan.addEventListener("change", updateEstimate);
  updateEstimate();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.replaceChildren();

    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const subject = `Trip inquiry: ${formData.get("tour")}`;
    const body = [
      `Name: ${formData.get("name")}`,
      `Email: ${formData.get("email")}`,
      `Phone: ${formData.get("phone")}`,
      `Tour: ${formData.get("tour")}`,
      `Preferred start date: ${formData.get("date")}`,
      `Guests: ${formData.get("guests")}`,
      `Payment preference: ${formData.get("paymentPlan")}`,
      `Preferred payment method: ${formData.get("paymentMethod")}`,
      `Notes: ${formData.get("message") || "None"}`,
      "Payment is not enabled on the website; these are preferences only. No charge has been made.",
    ].join("\n");

    status.append(document.createTextNode("Your inquiry is ready. No payment has been collected. Use the link below to email your booking and payment preferences to our team."));
    const emailLink = document.createElement("a");
    emailLink.href = `mailto:info@aventuratoursandtravels.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    emailLink.textContent = "Open email to send your inquiry";
    status.append(document.createElement("br"), emailLink);
  });
})();
