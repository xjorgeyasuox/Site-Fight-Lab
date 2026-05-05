import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- 1. ANIMATION ENGINE (Run this first!) ---
const initAnimations = () => {
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    });

    const elements = document.querySelectorAll('[data-reveal]');
    if (elements.length > 0) {
        elements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback if no elements found or observer fails
        document.body.classList.add('reveal-init');
    }
};

// Start animations immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
} else {
    initAnimations();
}

// --- 2. FIREBASE & MODAL LOGIC ---
try {
    const firebaseConfig = {
        apiKey: "AIzaSyA0ndrHmH3CJ9ky3dgraW89_W-r8kpAWW4",
        authDomain: "fightapp-148bc.firebaseapp.com",
        projectId: "fightapp-148bc",
        storageBucket: "fightapp-148bc.firebasestorage.app",
        messagingSenderId: "7093476392",
        appId: "1:7093476392:web:8a8c0a5293e77dedd7a91d",
        measurementId: "G-PYJ1DCYXS0"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // DOM Elements
    const modal = document.getElementById('modal-lead');
    const closeModal = document.getElementById('close-modal');
    const btnCloseSuccess = document.getElementById('btn-close-success');
    const formLead = document.getElementById('form-lead');
    const successMessage = document.getElementById('lead-success');

    const openLeadModal = () => {
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    };

    const closeLeadModal = () => {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            if (formLead) formLead.style.display = 'block';
            if (successMessage) successMessage.style.display = 'none';
            if (formLead) formLead.reset();
        }
    };

    // Attach listeners safely
    if (closeModal) closeModal.addEventListener('click', closeLeadModal);
    if (btnCloseSuccess) btnCloseSuccess.addEventListener('click', closeLeadModal);

    window.addEventListener('click', (event) => {
        if (event.target === modal) closeLeadModal();
    });

    // Trigger Buttons
    const triggers = ['btn-notify-me'];
    triggers.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', (e) => {
            e.preventDefault();
            openLeadModal();
        });
    });

    // Form Submission
    if (formLead) {
        formLead.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('btn-submit-lead');
            if (!submitBtn) return;

            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'ENVIANDO...';
            submitBtn.disabled = true;

            try {
                const leadData = {
                    name: document.getElementById('lead-name').value,
                    email: document.getElementById('lead-email').value,
                    ct: document.getElementById('lead-ct').value,
                    createdAt: serverTimestamp(),
                    source: 'landing_page_waitlist'
                };

                await addDoc(collection(db, "leads"), leadData);
                formLead.style.display = 'none';
                if (successMessage) successMessage.style.display = 'block';
            } catch (error) {
                console.error("Firebase Error:", error);
                alert("Erro ao enviar. Tente novamente.");
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }

} catch (e) {
    console.error("Initialization Error:", e);
}

// --- 3. UI ENHANCEMENTS ---
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// --- 4. INTERACTIVE CARDS (Spotlight Effect) ---
const initSpotlight = () => {
    const cards = document.querySelectorAll('.feature-card-v2');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initSpotlight();
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

if (document.readyState !== 'loading') {
    initSpotlight();
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}
