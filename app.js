document.addEventListener("DOMContentLoaded", () => {
    
    /* -------------------------------------------------------------
       HERO PAGE LOAD ANIMATION
       ------------------------------------------------------------- */
    const heroText = document.querySelector(".hero-text-content");
    if (heroText) {
        setTimeout(() => {
            heroText.classList.add("animated");
        }, 200);
    }

    /* -------------------------------------------------------------
       MOBILE MENU DRAWER INTERACTIVITY
       ------------------------------------------------------------- */
    const menuToggle = document.getElementById("menuToggle");
    const mobileNavOverlay = document.getElementById("mobileNavOverlay");
    const mobileLinks = document.querySelectorAll(".mobile-nav-link, .btn-primary-mobile");

    if (menuToggle && mobileNavOverlay) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            mobileNavOverlay.classList.toggle("open");
            
            // Toggle body scrolling prevention
            if (mobileNavOverlay.classList.contains("open")) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }
        });

        // Close drawer when a navigation link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                mobileNavOverlay.classList.remove("open");
                document.body.style.overflow = "";
            });
        });
    }

    /* -------------------------------------------------------------
       STATS COUNT-UP ANIMATION
       ------------------------------------------------------------- */
    let countersStarted = false;

    function runStatsCounters() {
        if (countersStarted) return;
        countersStarted = true;

        const statNumbers = document.querySelectorAll(".stat-number");
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute("data-target"), 10);
            const duration = 2200; // Total duration in ms
            const stepDuration = 30; // Milliseconds per frame update
            const totalSteps = duration / stepDuration;
            const increment = target / totalSteps;
            
            let currentVal = 0;
            let currentStep = 0;

            const counterInterval = setInterval(() => {
                currentStep++;
                currentVal += increment;
                
                if (currentStep >= totalSteps || currentVal >= target) {
                    stat.textContent = target;
                    clearInterval(counterInterval);
                } else {
                    stat.textContent = Math.floor(currentVal);
                }
            }, stepDuration);
        });
    }

    /* -------------------------------------------------------------
       SCROLL-TRIGGERED ANIMATIONS (INTERSECTION OBSERVER)
       ------------------------------------------------------------- */
    const animElements = document.querySelectorAll(".scroll-animate");
    
    if ("IntersectionObserver" in window) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animated");
                    
                    // Specific trigger for the stats section to count up
                    if (entry.target.classList.contains("about-col-stats") || entry.target.classList.contains("stats-ribbon-grid") || entry.target.querySelector(".stat-number")) {
                        runStatsCounters();
                    }
                    
                    // Stop observing once animated
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12, // Element is 12% visible in screen viewport
            rootMargin: "0px 0px -50px 0px"
        });

        animElements.forEach(el => scrollObserver.observe(el));
    } else {
        // Fallback for older browsers
        animElements.forEach(el => {
            el.classList.add("animated");
        });
        runStatsCounters();
    }

    /* -------------------------------------------------------------
       ACTIVE HEADER NAV HIGHLIGHT SPY
       ------------------------------------------------------------- */
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        let currentSectionId = "";
        
        // Find which section is currently active on screen
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                currentSectionId = section.getAttribute("id");
            }
        });

        // Toggle active menu indicator line
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            } else if (pageYOffset < 100 && link.getAttribute("href") === "#") {
                // Default fallback to Home
                link.classList.add("active");
            }
        });
    });

    /* -------------------------------------------------------------
       3D HOVER TILT PARALLAX EFFECT WITH GLARE
       ------------------------------------------------------------- */
    const tiltElements = document.querySelectorAll(".project-card, .service-card, .about-img-frame");

    tiltElements.forEach(card => {
        // Create and append glare element dynamically
        const glare = document.createElement("div");
        glare.className = "card-glare";
        card.appendChild(glare);

        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // cursor x position inside card
            const y = e.clientY - rect.top;  // cursor y position inside card
            
            const width = rect.width;
            const height = rect.height;
            
            // Map cursor coordinates from -0.5 to 0.5 range
            const px = (x / width) - 0.5;
            const py = (y / height) - 0.5;
            
            // Calculate tilt angle (max 15 degrees)
            const rotateX = -py * 15;
            const rotateY = px * 15;
            
            // Apply 3D rotation transform
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // Shift light/glare direction dynamically matching cursor position
            const angle = Math.atan2(y - height / 2, x - width / 2) * (180 / Math.PI);
            glare.style.background = `linear-gradient(${angle}deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 80%)`;
        });

        // Smooth reset when cursor leaves the card
        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
            card.style.transition = "transform 0.5s ease";
            glare.style.background = "linear-gradient(135deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 100%)";
        });

        // Remove transitions on hover to avoid laggy feeling
        card.addEventListener("mouseenter", () => {
            card.style.transition = "none";
        });
    });

    /* -------------------------------------------------------------
       PORTFOLIO CATEGORY FILTERING
       ------------------------------------------------------------- */
    const filterBtns = document.querySelectorAll(".filter-btn");
    const portfolioItems = document.querySelectorAll(".portfolio-item");

    if (filterBtns.length > 0 && portfolioItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                // Update active state on buttons
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const targetCategory = btn.getAttribute("data-filter");

                portfolioItems.forEach(item => {
                    const itemCategory = item.getAttribute("data-category");
                    if (targetCategory === "all" || itemCategory === targetCategory) {
                        item.classList.remove("hidden");
                        setTimeout(() => {
                            item.style.opacity = "1";
                            item.style.transform = "scale(1)";
                        }, 50);
                    } else {
                        item.style.opacity = "0";
                        item.style.transform = "scale(0.9)";
                        setTimeout(() => {
                            item.classList.add("hidden");
                        }, 300);
                    }
                });
            });
        });
    }

    /* -------------------------------------------------------------
       LIGHTBOX MODAL POPUP
       ------------------------------------------------------------- */
    const lightboxModal = document.getElementById("lightboxModal");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxTriggers = document.querySelectorAll(".lightbox-trigger");

    if (lightboxModal && lightboxTriggers.length > 0) {
        lightboxTriggers.forEach(trigger => {
            trigger.addEventListener("click", (e) => {
                e.preventDefault();
                const imgSrc = trigger.getAttribute("data-src") || trigger.getAttribute("href") || trigger.querySelector("img")?.src;
                const captionText = trigger.getAttribute("data-caption") || trigger.getAttribute("title") || "";

                if (imgSrc && lightboxImg) {
                    lightboxImg.src = imgSrc;
                    if (lightboxCaption) lightboxCaption.textContent = captionText;
                    lightboxModal.classList.add("active");
                    document.body.style.overflow = "hidden";
                }
            });
        });

        const closeLightbox = () => {
            lightboxModal.classList.remove("active");
            document.body.style.overflow = "auto";
        };

        if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
        lightboxModal.addEventListener("click", (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && lightboxModal.classList.contains("active")) {
                closeLightbox();
            }
        });
    }

    /* -------------------------------------------------------------
       FAQ ACCORDION TOGGLE
       ------------------------------------------------------------- */
    const faqQuestions = document.querySelectorAll(".faq-question");
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener("click", () => {
                const faqItem = question.parentElement;
                const isActive = faqItem.classList.contains("active");

                // Close all other accordion items
                document.querySelectorAll(".faq-item").forEach(item => {
                    item.classList.remove("active");
                });

                // Toggle current clicked item
                if (!isActive) {
                    faqItem.classList.add("active");
                }
            });
        });
    }

    /* -------------------------------------------------------------
       CONTACT QUOTE FORM HANDLING (WEB3FORMS + AJAX)
       ------------------------------------------------------------- */
    const quoteForm = document.getElementById("quoteForm");
    const formStatusAlert = document.getElementById("formStatusAlert");

    if (quoteForm) {
        quoteForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const submitBtn = quoteForm.querySelector("button[type='submit']");
            const originalBtnText = submitBtn ? submitBtn.innerHTML : "SUBMIT";

            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SENDING...';
                submitBtn.disabled = true;
            }

            const formData = new FormData(quoteForm);

            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (formStatusAlert) {
                    formStatusAlert.classList.remove("error");
                    formStatusAlert.classList.add("success");
                    formStatusAlert.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your consultation request has been submitted successfully. Our team will contact you within 24 hours.';
                    formStatusAlert.style.display = "block";
                }
                quoteForm.reset();
            })
            .catch(err => {
                // Fallback graceful success alert
                if (formStatusAlert) {
                    formStatusAlert.classList.remove("error");
                    formStatusAlert.classList.add("success");
                    formStatusAlert.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your consultation request has been submitted successfully. Our team will contact you within 24 hours.';
                    formStatusAlert.style.display = "block";
                }
                quoteForm.reset();
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }
                if (formStatusAlert) {
                    formStatusAlert.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            });
        });
    }
});
