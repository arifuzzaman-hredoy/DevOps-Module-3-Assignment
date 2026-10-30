document.addEventListener("DOMContentLoaded", () => {
    // Smooth navigation feedback
    const navLinks = document.querySelectorAll('nav a, .logo');

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            console.log(`Navigating to: ${link.getAttribute("href")}`);
        });
    });

    // Shop button interaction
    const shopButtons = document.querySelectorAll(
        '.nav-button, .primary-button'
    );

    shopButtons.forEach((button) => {
        button.addEventListener("click", () => {
            console.log("Welcome to ShopBondhu!");
        });
    });

    // Footer year
    const footer = document.querySelector("footer p");

    if (footer) {
        footer.textContent =
            `© ${new Date().getFullYear()} ShopBondhu. Built for a better shopping experience.`;
    }

    console.log("ShopBondhu frontend loaded successfully!");
});
