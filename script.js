document.addEventListener("DOMContentLoaded", () => {
    // Loading Screen Logic
    const loader = document.getElementById("loader");

    setTimeout(() => {
        if (loader) {
            loader.classList.add("loader-hidden");
            // Remove from DOM after transition to free up resources
            loader.addEventListener("transitionend", () => {
                loader.remove();
            });
        }
    }, 1500); // 1.5 seconds loading time

    // Mobile Menu Toggle
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const links = document.querySelectorAll(".nav-links li");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("open");
            hamburger.classList.toggle("toggle");
            console.log("Hamburger clicked, menu toggled");
        });
    }

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            hamburger.classList.remove("toggle");
            console.log("Link clicked, menu closed");
        });
    });
});
