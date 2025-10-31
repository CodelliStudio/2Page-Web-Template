    // --- Session ID ---
    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
        sessionId = crypto.randomUUID(); 
        localStorage.setItem("sessionId", sessionId);
    }

    // --- Chatbot Toggle ---
    const chatbotButton = document.getElementById("chatbot-button");
    const chatbotWindow = document.getElementById("chatbot-window");
    const closeChat = document.getElementById("close-chat");

    chatbotButton.addEventListener("click", () => {
        chatbotWindow.classList.toggle("hidden");
    });

    closeChat.addEventListener("click", () => {
        chatbotWindow.classList.add("hidden");
    });

    // --- Messaging ---
    const sendBtn = document.getElementById("send-message");
    const inputField = document.getElementById("chatbot-input");
    const messages = document.getElementById("chatbot-messages");

    function addMessage(sender, text) {
        const msg = document.createElement("div");
        msg.textContent = text;
        msg.classList.add(sender === "user" ? "user" : "bot");
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }

    // Mensaje inicial del bot
    addMessage("bot", "¡Hola! Soy TitanBot, tu asesor de TitanFuel. ¿En qué puedo ayudarte?");

    async function sendMessage() {
        const userText = inputField.value.trim();
        if (!userText) return;

        addMessage("user", userText);
        inputField.value = "";

        try {
        const res = await fetch("/chat", {
            method: "POST",
            headers: { 
            "Content-Type": "application/json",
            "x-session-id": sessionId
        },
        body: JSON.stringify({ message: userText })
        });

        if (!res.ok) throw new Error("Error en la respuesta del servidor");

        const data = await res.json();
        addMessage("bot", data.reply);
        } catch (err) {
        console.error(err);
        addMessage("bot", "Error conectando con la IA. Intenta de nuevo.");
        }
    }

    // Eventos
    sendBtn.addEventListener("click", sendMessage);
    inputField.addEventListener("keypress", e => {
        if (e.key === "Enter") sendMessage();
    });

    // --- Resetear sesión (opcional) ---
    const resetBtn = document.getElementById("reset-session");
    if (resetBtn) {
        resetBtn.addEventListener("click", async () => {
        try {
            await fetch("/reset-session", {
            method: "POST",
            headers: { "x-session-id": sessionId }
        });
            localStorage.removeItem("sessionId");
            sessionId = crypto.randomUUID();
            localStorage.setItem("sessionId", sessionId);
            messages.innerHTML = "";
            addMessage("bot", "¡Hola! Soy TItanBot, tu asesor de TitanFuel. ¿En qué puedo ayudarte?");
        } catch (err) {
            console.error(err);
            addMessage("bot", "No se pudo reiniciar la sesión, intenta más tarde.");
        }
        });
    }


/* ===== INTERACTIVE HEADER ===== */
const menuToggle = document.getElementById('menu-toggle');
const navList = document.getElementById('nav-list');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navList.classList.toggle('show');
});

// Cerrar menú al hacer clic en cualquier enlace
document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navList.classList.remove('show');
    });
});

    // ===== COUNTER ANIMADO =====
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / 200; 

        if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(updateCount, 10);
        } else {
        counter.innerText = target;
        }
    };

    // activarlo solo cuando el usuario hace scroll a la sección
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
            updateCount();
            observer.unobserve(counter);
            }
        });
        }, { threshold: 0.6 });

        observer.observe(counter);
    });

    // ===== SCROLL PROGRESS BAR =====
    const progressBar = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    /* ===== PRODUCTOS DINÁMICOS ===== */
    const products = [
    {
        name: "Whey Protein Max",
        img: "media/Products-Media/proteinpowder.jpg",
        desc: "Build muscle with 25g of pure protein per scoop.",
        price: 39.99,
        category: "Protein"
    },
    {
        name: "Pre-Workout Fury",
        img: "media/Products-Media/preworkout.jpg",
        desc: "Boost your energy and focus before every workout.",
        price: 29.99,
        category: "Pre-Workout"
    },
    {
        name: "Daily Multivitamin",
        img: "media/Products-Media/multivitamin.jpg",
        desc: "Essential nutrients for daily performance and recovery.",
        price: 19.99,
        category: "Vitamins"
    },
    {
        name: "Energy Drink",
        img: "media/Products-Media/energydrink.jpg",
        desc: "Stay active and hydrated with clean energy on demand.",
        price: 24.99,
        category: "Energy"
    },
    {
        name: "Mass Gainer Pro",
        img: "media/Products-Media/massgainer.jpg",
        desc: "Gain quality weight with 50g of protein and complex carbs.",
        price: 44.99,
        category: "Protein"
    },
    {
        name: "Creatine Monohydrate",
        img: "media/Products-Media/creatine.jpg",
        desc: "Improve strength, power, and muscle recovery naturally.",
        price: 22.99,
        category: "Energy"
    },
    {
        name: "Omega 3 Capsules",
        img: "media/Products-Media/omega3.jpg",
        desc: "Support joint health and heart performance.",
        price: 18.99,
        category: "Vitamins"
    },
    {
        name: "BCAA Recovery Blend",
        img: "media/Products-Media/bcca.jpg",
        desc: "Reduce muscle soreness and promote faster recovery.",
        price: 27.99,
        category: "Protein"
    },
    {
        name: "ThermoBurn Extreme",
        img: "media/Products-Media/fatburner.jpg",
        desc: "Accelerate fat loss with powerful thermogenic ingredients.",
        price: 34.99,
        category: "Energy"
    },
    {
        name: "Protein Bar Deluxe",
        img: "media/Products-Media/proteinbar.jpg",
        desc: "High-protein snack for energy on the go.",
        price: 3.99,
        category: "Protein"
    },
    {
        name: "Focus Shot",
        img: "media/Products-Media/focusshot.jpg",
        desc: "Small but mighty — quick energy before your session.",
        price: 4.99,
        category: "Energy"
    },
    {
        name: "Casein Night Formula",
        img: "media/Products-Media/casein.jpg",
        desc: "Slow-digesting protein for overnight muscle repair.",
        price: 42.99,
        category: "Protein"
    }
    ];

    // Render dinámico
    const grid = document.getElementById("product-grid");

    function renderProducts(list) {
    grid.innerHTML = "";
    list.forEach(prod => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        card.innerHTML = `
        <img src="${prod.img}" alt="${prod.name}">
        <h3>${prod.name}</h3>
        <p>${prod.desc}</p>
        <span class="price">$${prod.price.toFixed(2)}</span>
        <button class="btn-primary">Add to Cart</button>
        `;
        grid.appendChild(card);
    });
    }

    // Mostrar todos al cargar
    renderProducts(products);

    // --- Filtro por categoría ---
    const categorySelect = document.getElementById("category");
    categorySelect.addEventListener("change", e => {
    const selected = e.target.value;
    if (selected === "All") renderProducts(products);
    else renderProducts(products.filter(p => p.category === selected));
    });