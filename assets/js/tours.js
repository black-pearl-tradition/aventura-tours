(() => {
  const search = document.querySelector("#tour-search");
  const priceFilter = document.querySelector("#tour-price");
  const cards = [...document.querySelectorAll("[data-tour-card]")];
  const count = document.querySelector("#tour-results-count");
  const emptyState = document.querySelector("#tour-empty-state");
  const categoryButtons = [...document.querySelectorAll("[data-category-filter]")];

  if (!search || !priceFilter || cards.length === 0 || !count || !emptyState) {
    return;
  }

  let activeCategory = "all";

  const applyFilters = () => {
    const query = search.value.trim().toLocaleLowerCase();
    const maxPrice = priceFilter.value === "any" ? Number.POSITIVE_INFINITY : Number(priceFilter.value);
    let visibleCount = 0;

    cards.forEach((card) => {
      const matchesQuery = (card.dataset.name || card.textContent || "").toLocaleLowerCase().includes(query);
      const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
      const matchesPrice = card.dataset.price === "custom" || Number(card.dataset.price) <= maxPrice;
      const isVisible = matchesQuery && matchesCategory && matchesPrice;
      card.hidden = !isVisible;
      visibleCount += Number(isVisible);
    });

    count.textContent = `${visibleCount} ${visibleCount === 1 ? "experience" : "experiences"}`;
    emptyState.hidden = visibleCount !== 0;
  };

  search.addEventListener("input", applyFilters);
  priceFilter.addEventListener("change", applyFilters);

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.categoryFilter || "all";
      categoryButtons.forEach((categoryButton) => {
        categoryButton.setAttribute("aria-pressed", String(categoryButton === button));
      });
      applyFilters();
    });
  });

  applyFilters();
})();
