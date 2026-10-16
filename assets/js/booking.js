(() => {
  const form = document.querySelector("#booking-form");

  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  const tour = form.querySelector("#tour");
  const date = form.querySelector("#date");
  const guests = form.querySelector("#guests");
  const estimate = form.querySelector("#booking-estimate");
  const status = form.querySelector("#booking-status");
  const prices = new Map([
    ["Wild Uganda Safari", 3108000],
    ["Nile River Cruise", 1165500],
    ["Kampala City Secrets", 207200],
    ["Weekend Getaways", 647500],
  ]);

  if (!(tour instanceof HTMLSelectElement) || !(date instanceof HTMLInputElement) ||
      !(guests instanceof HTMLInputElement) || !estimate || !status) {
    throw new Error("The booking form is missing a required control.");
  }

  const localToday = new Date();
  localToday.setMinutes(localToday.getMinutes() - localToday.getTimezoneOffset());
  date.min = localToday.toISOString().slice(0, 10);

  const updateEstimate = () => {
    const price = prices.get(tour.value);
    const guestCount = Number(guests.value);

    if (tour.value === "Custom Itinerary") {
      estimate.textContent = "Custom itinerary pricing is tailored to your plans; our team will prepare a quote.";
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
    estimate.innerHTML = `Estimated starting total for ${guestCount} ${guestCount === 1 ? "guest" : "guests"}: <strong>${total}</strong>. Based on the listed starting price per person; your final quote depends on your dates, group, and confirmed trip details.`;
  };

  const selectedTour = new URLSearchParams(window.location.search).get("tour");
  if (selectedTour && [...tour.options].some((option) => option.value === selectedTour)) {
    tour.value = selectedTour;
  }

  tour.addEventListener("change", updateEstimate);
  guests.addEventListener("input", updateEstimate);
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
      `Notes: ${formData.get("message") || "None"}`,
    ].join("\n");

    status.append(document.createTextNode("Your request is ready. This static site cannot send bookings directly; use the link below to send it to our team."));
    const emailLink = document.createElement("a");
    emailLink.href = `mailto:info@aventuratoursandtravels.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    emailLink.textContent = "Open email to send your inquiry";
    status.append(document.createElement("br"), emailLink);
  });
})();
