"use strict";

/* =========================================
   BARCARDI RESTAURANT & CAFE
   Navigation, Scroll Animations & Interactions
   ========================================= */


/* ---------- 1. MOBILE NAVIGATION ---------- */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function closeMobileMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
    );
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("active");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );
    });

    // Close the menu after a navigation link is selected.
    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    // Close the menu when Escape is pressed.
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    // Close the menu when the user taps outside it.
    document.addEventListener("click", (event) => {
        const clickedInsideMenu = navLinks.contains(event.target);
        const clickedToggle = menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {
            closeMobileMenu();
        }
    });

    // Reset mobile navigation when switching to desktop width.
    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            closeMobileMenu();
        }
    });
}


/* ---------- 2. SCROLL REVEAL ANIMATIONS ---------- */

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

const revealTargets = [
    ".intro .section-heading",
    ".intro .intro-content",
    ".feature-card",
    ".menu-heading",
    ".menu-card",
    ".gallery-heading",
    ".gallery-item",
    ".contact-copy",
    ".contact-card"
];

if (
    !prefersReducedMotion &&
    "IntersectionObserver" in window
) {
    const revealElements = document.querySelectorAll(
        revealTargets.join(", ")
    );

    if (revealElements.length > 0) {
        // Prepare elements before enabling the animation system.
        revealElements.forEach((element) => {
            element.classList.add("reveal");
        });

        document.documentElement.classList.add("js-motion");

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");

                        // Animate each element only once.
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    }
}


/* ---------- 3. STAGGERED CARD ANIMATIONS ---------- */

// Give cards a subtle sequence when they enter the viewport.
const cardGroups = [
    ".features",
    ".menu-grid",
    ".gallery-grid"
];

if (!prefersReducedMotion) {
    cardGroups.forEach((selector) => {
        const group = document.querySelector(selector);

        if (!group) return;

        const cards = group.querySelectorAll(
            ".feature-card, .menu-card, .gallery-item"
        );

        cards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 100}ms`;
        });
    });
}


/* ---------- 4. SMOOTH ANCHOR NAVIGATION ---------- */

// Account for the header when navigating to page sections.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start"
        });

        // Keep the browser URL in sync with the selected section.
        if (window.location.hash !== targetId) {
            history.replaceState(null, "", targetId);
        }
    });
});


/* ---------- 5. IMAGE FALLBACK SUPPORT ---------- */

// Background images are loaded through CSS.
// This script intentionally does not replace images
// automatically, so the approved design remains unchanged.


/* ---------- 6. INITIALIZATION ---------- */

document.documentElement.classList.add("js-ready");

console.log("Barcardi website interactions initialized.");
/* =========================================
   INTERACTIVE MENU FILTER
   ========================================= */

const menuGrid = document.getElementById("menuGrid");

if (menuGrid) {
    const filterButtons = document.querySelectorAll(
        ".menu-filter"
    );

    const menuCards = menuGrid.querySelectorAll(
        ".menu-card"
    );

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let currentFilter = "all";

    function filterMenu(category) {
        currentFilter = category;

        // Update the selected filter button.
        filterButtons.forEach((button) => {
            const isActive =
                button.dataset.filter === category;

            button.classList.toggle("active", isActive);

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );
        });

        menuCards.forEach((card) => {
            const matches =
                category === "all" ||
                card.dataset.category === category;

            // Cancel any pending filtering transition.
            card.classList.remove("is-filtering-out");

            if (matches) {
                card.classList.remove("is-hidden");
            } else {
                card.classList.add("is-filtering-out");

                if (reducedMotion) {
                    card.classList.add("is-hidden");
                    return;
                }

                window.setTimeout(() => {
                    // Do not hide a card if it matches
                    // the latest filter selection.
                    const stillMatches =
                        currentFilter === "all" ||
                        card.dataset.category === currentFilter;

                    if (!stillMatches) {
                        card.classList.add("is-hidden");
                    }

                    card.classList.remove("is-filtering-out");
                }, 250);
            }
        });
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filterMenu(button.dataset.filter);
        });
    });
}
