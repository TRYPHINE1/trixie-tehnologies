/* =========================================================
   TRIXIE TECHNOLOGIES — JAVASCRIPT SECTION GUIDE
========================================================= */

/* ---------- DOM / GLOBAL VARIABLES ---------- */
/* ---------- MOBILE NAVIGATION ---------- */
/* ---------- HEADER / SCROLL BEHAVIOUR ---------- */
/* ---------- HERO / PAGE INTERACTIONS ---------- */
/* ---------- SCROLL REVEAL ANIMATIONS ---------- */
/* ---------- FORMS / CONTACT ---------- */
/* ---------- GENERAL UI INTERACTIONS ---------- */

/* TRIXIE TECHNOLOGIES — CLEAN SITE SCRIPT */

document.addEventListener("DOMContentLoaded", () => {
    const $ = (s, p = document) => p.querySelector(s);
    const $$ = (s, p = document) => [...p.querySelectorAll(s)];

    /* Loader */
    const loader = $("#pageLoader");
    const hideLoader = () => loader?.classList.add("hide");
    window.addEventListener("load", () => setTimeout(hideLoader, 450));
    setTimeout(hideLoader, 2500);

    /* Navbar */
    const navbar = $("#navbar");
    const nav = $("#navLinks");
    const menu = $("#menuToggle");

    const navScroll = () => navbar?.classList.toggle("scrolled", scrollY > 40);
    navScroll();
    addEventListener("scroll", navScroll, {passive:true});

    menu?.addEventListener("click", () => {
        const open = nav?.classList.toggle("open");
        menu.setAttribute("aria-expanded", String(!!open));
        menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
        const icon = $("i", menu);
        if (icon) icon.className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
    });

    $$("a", nav).forEach(link => link.addEventListener("click", () => {
        nav?.classList.remove("open");
        menu?.setAttribute("aria-expanded", "false");
        const icon = $("i", menu);
        if (icon) icon.className = "fa-solid fa-bars";
    }));

    /* Workflow */
    const workflow = $(".workflow-experience");
    const number = $("#workflowNumber");
    const label = $("#workflowLabel");
    const title = $("#workflowTitle");
    const description = $("#workflowDescription");
    const progressBar = $("#workflowProgress");
    const stepName = $("#workflowStepName");
    const status = $("#visualStatus");
    const core = $("#workflowCore");
    const scene = $("#workflowScene");
    const text = $(".workflow-text");
    const nodes = $$(".workflow-node");

    const phases = [
        ["01","PHASE 01 / DISCOVERY","Every great solution starts with an idea.","We understand your business, goals, users and the problem technology needs to solve.","DISCOVER","DISCOVERY ACTIVE"],
        ["02","PHASE 02 / DESIGN","We turn ideas into a clear digital experience.","We shape the interface, user experience and technical structure before development begins.","DESIGN","DESIGN ACTIVE"],
        ["03","PHASE 03 / DEVELOPMENT","The approved concept becomes a working product.","Our development process brings the approved design to life with reliable, maintainable technology.","DEVELOP","BUILD ACTIVE"],
        ["04","PHASE 04 / DEPLOYMENT","Tested, launched and ready for real users.","We test, deploy and support the solution so your team can start using it with confidence.","DEPLOY","SYSTEM ONLINE"]
    ];

    let currentPhase = -1;

    function setPhase(i) {
        if (!phases[i] || currentPhase === i) return;
        currentPhase = i;
        const [n,l,t,d,s,st] = phases[i];

        text?.classList.add("is-changing");
        setTimeout(() => {
            if (number) number.textContent = n;
            if (label) label.textContent = l;
            if (title) title.textContent = t;
            if (description) description.textContent = d;
            if (stepName) stepName.textContent = s;
            if (status) status.innerHTML = `<i class="fa-solid fa-circle"></i> ${st}`;
            text?.classList.remove("is-changing");
        }, 100);

        nodes.forEach((node, index) => node.classList.toggle("active", index === i));
    }

    function updateWorkflow() {
        if (!workflow) return;

        if (innerWidth <= 800) {
            setPhase(0);
            if (progressBar) progressBar.style.width = "25%";
            return;
        }

        const rect = workflow.getBoundingClientRect();
        const distance = workflow.offsetHeight - innerHeight;
        if (distance <= 0) return;

        const p = Math.max(0, Math.min(1, -rect.top / distance));
        const i = Math.min(phases.length - 1, Math.floor(p * phases.length));

        setPhase(i);
        if (progressBar) progressBar.style.width = `${((i + 1) / phases.length) * 100}%`;

        if (core) {
            core.style.transform =
                `translate(-50%, -50%) translateZ(80px) rotateX(${10 + p*180}deg) rotateY(${-15 + p*240}deg) rotateZ(${p*45}deg)`;
        }

        if (scene) scene.style.transform = `translate3d(0, ${-p*8}px, 0)`;

        nodes.forEach((node, index) => {
            const active = index === i;
            node.style.transform =
                `translateZ(35px) translateY(${active ? -8 : 0}px) scale(${active ? 1.04 : 1})`;
            node.style.opacity = active ? "1" : ".7";
        });
    }

    let frame = null;
    const requestWorkflow = () => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
            frame = null;
            updateWorkflow();
        });
    };

    setPhase(0);
    updateWorkflow();
    addEventListener("scroll", requestWorkflow, {passive:true});
    addEventListener("resize", requestWorkflow);

    /* Reveal */
    const reveal = $$(".reveal, .image-reveal");
    if ("IntersectionObserver" in window) {
        const ro = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    ro.unobserve(entry.target);
                }
            });
        }, {threshold:.12});
        reveal.forEach(el => ro.observe(el));
    } else {
        reveal.forEach(el => el.classList.add("visible"));
    }


    /* STATS COUNTERS */
    const counters = $$(".counter");

    function animateCounter(counter) {
        if (counter.dataset.counted === "true") return;

        const target = Number(counter.dataset.target || 0);
        const duration = 1600;
        const startTime = performance.now();

        counter.dataset.counted = "true";

        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Smooth ease-out animation.
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(target * eased);

            counter.textContent = value.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                counter.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(tick);
    }

    if (counters.length) {
        if ("IntersectionObserver" in window) {
            const statsObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.35
            });

            counters.forEach(counter => statsObserver.observe(counter));
        } else {
            counters.forEach(animateCounter);
        }
    }

    /* Active nav */
    if ("IntersectionObserver" in window) {
        const links = $$(".nav-links a");
        const sections = $$("main section[id], .workflow-hero[id]");
        const so = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                links.forEach(link => link.classList.toggle(
                    "active",
                    link.getAttribute("href") === `#${entry.target.id}`
                ));
            });
        }, {rootMargin:"-35% 0px -55% 0px"});
        sections.forEach(section => so.observe(section));
    }

    /* Back to top */
    const back = $("#backTop");
    if (back) {
        const updateBack = () => back.classList.toggle("show", scrollY > 500);
        updateBack();
        addEventListener("scroll", updateBack, {passive:true});
        back.addEventListener("click", () => scrollTo({top:0, behavior:"smooth"}));
    }

    /* Contact form */
    const form = $("#contactForm");
    const formStatus = $("#formStatus");
    form?.addEventListener("submit", event => {
        event.preventDefault();

        const name = $("#name")?.value.trim();
        const email = $("#email")?.value.trim();
        const service = $("#service")?.value.trim();
        const message = $("#message")?.value.trim();

        if (!name || !email || !service || !message) {
            if (formStatus) formStatus.textContent = "Please complete all required fields.";
            return;
        }

        const subject = encodeURIComponent(`Project Request — ${service}`);
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\nService: ${service}\n\nProject details:\n${message}`
        );

        if (formStatus) formStatus.textContent = "Opening your email app...";
        location.href = `mailto:info@trixietechnologies.com?subject=${subject}&body=${body}`;
    });

    /* Chatbot */
    const chatButton = $("#chatbotButton");
    const chatWindow = $("#chatWindow");
    const closeChat = $("#closeChat");
    const messages = $("#chatMessages");
    const chatForm = $("#chatForm");
    const input = $("#chatInput");

    const answers = {
        website: "We build responsive business websites, portfolios, landing pages and e-commerce websites.",
        system: "We develop custom business systems for workflows, records, operations, reporting and internal management.",
        analytics: "We help businesses organize data and turn it into useful dashboards, reports and insights.",
        contact: "You can reach Trixie Technologies at info@trixietechnologies.com or +256 792 366 050."
    };

    const addMessage = (value, type) => {
        if (!messages) return;
        const el = document.createElement("div");
        el.className = type;
        el.textContent = value;
        messages.appendChild(el);
        messages.scrollTop = messages.scrollHeight;
    };

    chatButton?.addEventListener("click", () => {
        chatWindow?.classList.toggle("open");
        if (chatWindow?.classList.contains("open")) setTimeout(() => input?.focus(), 150);
    });

    closeChat?.addEventListener("click", () => chatWindow?.classList.remove("open"));

    $$(".quick-options button").forEach(button => {
        button.addEventListener("click", () => {
            const key = button.dataset.question;
            addMessage(button.textContent.trim(), "user-message");
            addMessage(answers[key] || "Please contact us for more information.", "bot-message");
        });
    });

    chatForm?.addEventListener("submit", event => {
        event.preventDefault();
        const value = input?.value.trim();
        if (!value) return;

        addMessage(value, "user-message");
        const q = value.toLowerCase();

        let response = "Thanks for your message. For a detailed response, please contact us at info@trixietechnologies.com or +256 792 366 050.";
        if (q.includes("website") || q.includes("web")) response = answers.website;
        else if (q.includes("system")) response = answers.system;
        else if (q.includes("data") || q.includes("analytics")) response = answers.analytics;
        else if (q.includes("contact") || q.includes("phone") || q.includes("email")) response = answers.contact;

        if (input) input.value = "";
        setTimeout(() => addMessage(response, "bot-message"), 250);
    });

    /* Year + escape */
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();

    document.addEventListener("keydown", event => {
        if (event.key !== "Escape") return;
        nav?.classList.remove("open");
        chatWindow?.classList.remove("open");
        menu?.setAttribute("aria-expanded", "false");
    });
});



/* =========================================================
   TRIXIE TECHNOLOGIES
   SCROLL CONTROLLED 3D HERO ROTATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const platform = document.querySelector(".workflow-platform");
    const cube = document.querySelector(".core-cube");
    const scene = document.querySelector(".workflow-scene");

    if (!platform) return;

    let currentRotation = 0;
    let targetRotation = 0;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    /*
     * How strong the rotation is.
     * Increase this number for MORE visible rotation.
     */
    const rotationStrength = 0.45;

    /*
     * Maximum rotation speed per frame.
     * Prevents the object from spinning wildly.
     */
    const maxVelocity = 12;

    /*
     * Smoothness.
     * Higher = follows scrolling faster.
     */
    const smoothing = 0.14;

    function updateScrollRotation() {

        const currentScrollY = window.scrollY;

        /*
         * Calculate how much the user has scrolled.
         */
        const scrollDelta = currentScrollY - lastScrollY;

        /*
         * Convert scrolling into rotation.
         */
        scrollVelocity = scrollDelta * rotationStrength;

        /*
         * Limit the rotation speed.
         */
        scrollVelocity = Math.max(
            -maxVelocity,
            Math.min(maxVelocity, scrollVelocity)
        );

        /*
         * Add rotation.
         */
        targetRotation += scrollVelocity;

        lastScrollY = currentScrollY;
    }

    window.addEventListener("scroll", updateScrollRotation, {
        passive: true
    });

    function animate3D() {

        /*
         * Smoothly move current rotation
         * toward the desired rotation.
         */
        currentRotation +=
            (targetRotation - currentRotation) * smoothing;

        /*
         * Main platform rotation.
         *
         * X gives the 3D tilt.
         * Y gives side-to-side movement.
         * Z gives the obvious circular rotation.
         */
        platform.style.transform = `
            rotateX(55deg)
            rotateY(${currentRotation * 0.12}deg)
            rotateZ(${currentRotation - 35}deg)
            scale(1.02)
        `;

        /*
         * Rotate the central cube separately.
         * This makes the center feel more dynamic.
         */
        if (cube) {

            cube.style.transform = `
                rotateX(${currentRotation * 0.8}deg)
                rotateY(${currentRotation * 0.9}deg)
                rotateZ(${currentRotation * 0.35}deg)
            `;
        }

        /*
         * Very subtle scene movement.
         * This does NOT continuously rotate it.
         */
        if (scene) {

            const sceneMovement =
                Math.min(Math.abs(scrollVelocity) * 0.25, 5);

            scene.style.transform = `
                translateY(${-sceneMovement}px)
            `;
        }

        /*
         * Gradually slow the scroll velocity when
         * the user stops scrolling.
         */
        scrollVelocity *= 0.88;

        requestAnimationFrame(animate3D);
    }

    animate3D();

});



/* =========================================================
   TRIXIE — WORKFLOW STAGE HIGHLIGHTING
   DISCOVER → DESIGN → DEVELOP → DEPLOY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const hero = document.querySelector(".workflow-hero");

    const nodes = [
        document.querySelector(".node-discover"),
        document.querySelector(".node-design"),
        document.querySelector(".node-develop"),
        document.querySelector(".node-deploy")
    ].filter(Boolean);

    if (!hero || !nodes.length) return;

    function updateWorkflowStages() {

        const rect = hero.getBoundingClientRect();

        const totalScrollable =
            Math.max(hero.offsetHeight - window.innerHeight, 1);

        const passed =
            Math.max(0, Math.min(
                totalScrollable,
                -rect.top
            ));

        const progress = passed / totalScrollable;

        /*
         * Divide the process into 4 clear stages.
         */
        let activeStage = Math.floor(progress * 4);

        if (activeStage > 3) {
            activeStage = 3;
        }

        nodes.forEach((node, index) => {

            node.classList.remove(
                "active",
                "is-active",
                "current",
                "completed"
            );

            if (index < activeStage) {
                node.classList.add("completed");
            }

            if (index === activeStage) {
                node.classList.add("active");
            }
        });
    }

    window.addEventListener(
        "scroll",
        updateWorkflowStages,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        updateWorkflowStages
    );

    updateWorkflowStages();
});



/* =========================================================
   TRIXIE TECHNOLOGIES — CLIENTS SLIDER
   Smooth responsive infinite slider
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const windowEl = document.querySelector(".clients-window");
    const marquee = document.querySelector(".clients-marquee");

    if (!windowEl || !marquee) return;

    let position = 0;
    let speed = 0.55;
    let paused = false;
    let animationFrame;

    /*
     * The HTML contains:
     * FIRST SET + DUPLICATE SET
     *
     * We calculate the width of the first set,
     * so the slider can loop perfectly.
     */
    function getLoopWidth() {

        const cards = marquee.querySelectorAll(".client-card");

        if (cards.length < 2) return 0;

        const half = Math.floor(cards.length / 2);

        let width = 0;

        for (let i = 0; i < half; i++) {
            width += cards[i].getBoundingClientRect().width;
        }

        /*
         * Add the gaps between cards.
         */
        const styles = window.getComputedStyle(marquee);
        const gap = parseFloat(styles.columnGap || styles.gap || 0);

        width += gap * (half - 1);

        return width;
    }

    let loopWidth = getLoopWidth();

    /*
     * Responsive speed.
     */
    function updateSpeed() {

        if (window.innerWidth <= 360) {
            speed = 0.35;
        } else if (window.innerWidth <= 600) {
            speed = 0.42;
        } else if (window.innerWidth <= 900) {
            speed = 0.5;
        } else {
            speed = 0.6;
        }
    }

    updateSpeed();

    /*
     * Main animation.
     */
    function animateClients() {

        if (!paused && loopWidth > 0) {

            position -= speed;

            /*
             * Once the first set has completely moved away,
             * jump back by exactly one set.
             *
             * Because the second set is identical,
             * the user sees a seamless loop.
             */
            if (Math.abs(position) >= loopWidth) {
                position += loopWidth;
            }

            marquee.style.transform =
                `translate3d(${position}px, 0, 0)`;
        }

        animationFrame = requestAnimationFrame(animateClients);
    }

    /*
     * Pause when the user touches the slider.
     * This makes mobile interaction feel much better.
     */
    windowEl.addEventListener("touchstart", () => {
        paused = true;
    }, { passive: true });

    windowEl.addEventListener("touchend", () => {

        setTimeout(() => {
            paused = false;
        }, 700);

    }, { passive: true });

    /*
     * Pause when mouse is over the slider on desktop.
     */
    windowEl.addEventListener("mouseenter", () => {
        paused = true;
    });

    windowEl.addEventListener("mouseleave", () => {
        paused = false;
    });

    /*
     * Recalculate after resizing.
     */
    let resizeTimer;

    window.addEventListener("resize", () => {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {

            loopWidth = getLoopWidth();
            updateSpeed();

            /*
             * Keep the current position inside
             * the new loop range.
             */
            if (loopWidth > 0) {
                while (Math.abs(position) >= loopWidth) {
                    position += loopWidth;
                }
            }

        }, 150);
    });

    /*
     * Start.
     */
    animationFrame = requestAnimationFrame(animateClients);

});
