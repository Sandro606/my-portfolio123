/**
 * Sandro Dzneladze — Portfolio JavaScript
 * Features:
 *  1. Responsive Mobile Burger Menu (click events & smooth animation)
 *  2. Fetch Users API from JSONPlaceholder (GET)
 *  3. Contact Form Submission to JSONPlaceholder (POST)
 */

document.addEventListener('DOMContentLoaded', () => {
    initBurgerMenu();
    initFetchUsers();
    initPostForms();
});

/* ==========================================================================
   1. Responsive Burger Menu
   ========================================================================== */
function initBurgerMenu() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const burgerIcon = document.getElementById('burger-icon');
    const closeIcon = document.getElementById('close-icon');

    if (!mobileBtn || !mobileMenu) return;

    // Toggle menu on burger click
    mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mobileMenu.classList.toggle('menu-open');
        mobileBtn.setAttribute('aria-expanded', isOpen.toString());

        if (burgerIcon && closeIcon) {
            if (isOpen) {
                burgerIcon.classList.add('hidden');
                closeIcon.classList.remove('hidden');
            } else {
                burgerIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }
        }
    });

    // Close menu when clicking any navigation link
    const navLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });

    function closeMobileMenu() {
        if (mobileMenu.classList.contains('menu-open')) {
            mobileMenu.classList.remove('menu-open');
            mobileBtn.setAttribute('aria-expanded', 'false');
            if (burgerIcon && closeIcon) {
                burgerIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }
        }
    }
}

/* ==========================================================================
   2. Fetch Users API (GET)
   Endpoint: https://jsonplaceholder.typicode.com/users
   ========================================================================== */
function initFetchUsers() {
    const usersGrid = document.getElementById('users-grid');
    if (!usersGrid) return; // Not on the users page/section

    const retryBtn = document.getElementById('users-retry-btn');
    if (retryBtn) {
        retryBtn.addEventListener('click', fetchUsers);
    }

    // Initial fetch on page load
    fetchUsers();
}

function fetchUsers() {
    const loading = document.getElementById('users-loading');
    const errorDiv = document.getElementById('users-error');
    const errorMsg = document.getElementById('users-error-msg');
    const grid = document.getElementById('users-grid');

    if (!grid) return;

    // Show loading state, hide errors
    if (loading) loading.classList.remove('hidden');
    if (errorDiv) errorDiv.classList.add('hidden');
    grid.innerHTML = '';

    fetch('https://jsonplaceholder.typicode.com/users')
        .then((response) => {
            if (!response.ok) {
                throw new Error('სერვერმა დააბრუნა შეცდომა (სტატუსი: ' + response.status + ')');
            }
            return response.json();
        })
        .then((users) => {
            if (loading) loading.classList.add('hidden');

            if (!Array.isArray(users) || users.length === 0) {
                grid.innerHTML = '<p class="col-span-full text-center text-slate-500 py-8">მომხმარებლები ვერ მოიძებნა.</p>';
                return;
            }

            users.forEach((user) => {
                const card = document.createElement('article');
                card.className = 'bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-200 transition duration-300 space-y-4 flex flex-col justify-between';

                const initial = user.name ? user.name.charAt(0) : '?';
                const name = escapeHtml(user.name || 'უცნობი');
                const username = escapeHtml(user.username || '');
                const email = escapeHtml(user.email || '');
                const phone = escapeHtml(user.phone || '');
                const website = escapeHtml(user.website || '');

                card.innerHTML = `
                    <div class="space-y-4">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-base shadow-md">
                                ${initial}
                            </div>
                            <div>
                                <h4 class="font-bold text-slate-900 text-base leading-snug">${name}</h4>
                                <p class="text-xs text-indigo-600 font-medium">@${username}</p>
                            </div>
                        </div>

                        <div class="space-y-2.5 text-sm text-slate-600 pt-1">
                            <div class="flex items-start gap-2.5">
                                <span class="text-indigo-500 text-base" aria-hidden="true">✉️</span>
                                <div class="min-w-0">
                                    <span class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">ელფოსტა</span>
                                    <a href="mailto:${email}" class="text-indigo-600 font-medium hover:underline text-sm break-all">${email}</a>
                                </div>
                            </div>

                            <div class="flex items-start gap-2.5">
                                <span class="text-indigo-500 text-base" aria-hidden="true">📞</span>
                                <div class="min-w-0">
                                    <span class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">ტელეფონი</span>
                                    <a href="tel:${phone}" class="text-slate-800 font-medium text-sm hover:text-indigo-600 transition">${phone}</a>
                                </div>
                            </div>

                            <div class="flex items-start gap-2.5">
                                <span class="text-indigo-500 text-base" aria-hidden="true">🌐</span>
                                <div class="min-w-0">
                                    <span class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">ვებსაიტი</span>
                                    <a href="https://${website}" target="_blank" rel="noopener noreferrer" class="text-indigo-600 font-medium hover:underline text-sm break-all">${website}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                grid.appendChild(card);
            });
        })
        .catch((error) => {
            if (loading) loading.classList.add('hidden');
            if (errorDiv) errorDiv.classList.remove('hidden');
            if (errorMsg) {
                errorMsg.textContent = error.message || 'მონაცემების ჩატვირთვა ვერ მოხერხდა. გთხოვთ, სცადოთ ხელახლა.';
            }
        });
}

/* ==========================================================================
   3. Contact Form Submission (POST)
   Endpoint: https://jsonplaceholder.typicode.com/posts
   ========================================================================== */
function initPostForms() {
    // 1. Post form on users.html
    const postForm = document.getElementById('post-form');
    if (postForm) {
        postForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('post-name');
            const messageInput = document.getElementById('post-message');
            const submitBtn = document.getElementById('post-submit-btn');
            const loading = document.getElementById('post-loading');
            const success = document.getElementById('post-success');
            const responseDiv = document.getElementById('post-response');
            const errorDiv = document.getElementById('post-error');
            const errorMsg = document.getElementById('post-error-msg');

            const name = nameInput ? nameInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            if (!name || !message) return;

            // UI feedback: reset states & show loading
            if (success) success.classList.add('hidden');
            if (errorDiv) errorDiv.classList.add('hidden');
            if (loading) loading.classList.remove('hidden');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            }

            fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    title: 'შეტყობინება: ' + name,
                    body: message,
                    name: name,
                    userId: 1,
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('სერვერმა დააბრუნა შეცდომა (სტატუსი: ' + response.status + ')');
                    }
                    return response.json();
                })
                .then((data) => {
                    if (loading) loading.classList.add('hidden');
                    if (success) success.classList.remove('hidden');

                    if (responseDiv) {
                        responseDiv.innerHTML = `
                            <dl class="space-y-2 text-sm">
                                <div class="flex gap-2">
                                    <dt class="font-bold text-slate-700 min-w-[110px]">სტატუსი:</dt>
                                    <dd class="text-emerald-600 font-semibold">201 Created (სიმულირებული)</dd>
                                </div>
                                <div class="flex gap-2">
                                    <dt class="font-bold text-slate-700 min-w-[110px]">გენერირებული ID:</dt>
                                    <dd class="text-indigo-600 font-semibold">${escapeHtml(String(data.id))}</dd>
                                </div>
                                <div class="flex gap-2">
                                    <dt class="font-bold text-slate-700 min-w-[110px]">გამომგზავნი:</dt>
                                    <dd class="text-slate-800 font-medium">${escapeHtml(name)}</dd>
                                </div>
                                <div>
                                    <dt class="font-bold text-slate-700 mb-1">გაგზავნილი ტექსტი:</dt>
                                    <dd class="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap">${escapeHtml(message)}</dd>
                                </div>
                            </dl>
                        `;
                    }

                    postForm.reset();
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                    }
                })
                .catch((error) => {
                    if (loading) loading.classList.add('hidden');
                    if (errorDiv) errorDiv.classList.remove('hidden');
                    if (errorMsg) {
                        errorMsg.textContent = error.message || 'სერვერთან კავშირი ვერ დამყარდა. გთხოვთ, სცადოთ ხელახლა.';
                    }
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                    }
                });
        });
    }

    // 2. Main contact form on contact.html
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('sender-name');
            const emailInput = document.getElementById('sender-email');
            const messageInput = document.getElementById('message-content');
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const statusDiv = document.getElementById('contact-form-status');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            if (!name || !message) return;

            if (statusDiv) {
                statusDiv.classList.remove('hidden');
                statusDiv.innerHTML = `
                    <div class="flex items-center gap-2 text-indigo-600 py-2">
                        <svg class="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span class="text-sm font-semibold">შეტყობინება იგზავნება API-ზე...</span>
                    </div>
                `;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            }

            fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    title: 'საკონტაქტო წერილი: ' + name,
                    body: message,
                    email: email,
                    name: name,
                    userId: 1,
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('სერვერმა დააბრუნა შეცდომა (სტატუსი: ' + response.status + ')');
                    }
                    return response.json();
                })
                .then((data) => {
                    if (statusDiv) {
                        statusDiv.innerHTML = `
                            <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-2 text-sm text-emerald-800">
                                <div class="flex items-center gap-2">
                                    <span class="text-xl">✅</span>
                                    <strong class="text-base font-bold text-emerald-900">შეტყობინება წარმატებით გაიგზავნა!</strong>
                                </div>
                                <p>მადლობა დაკავშირებისთვის, თქვენი წერილი მიღებულია სერვერის მიერ (ID: <code class="font-bold text-emerald-950">${escapeHtml(String(data.id))}</code>).</p>
                                <p class="text-xs text-emerald-700 italic">შენიშვნა: JSONPlaceholder სიმულაციური სერვისია — შეტყობინება რეალურად არ ინახება.</p>
                            </div>
                        `;
                    }
                    contactForm.reset();
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                    }
                })
                .catch((error) => {
                    if (statusDiv) {
                        statusDiv.innerHTML = `
                            <div class="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-2 text-sm text-red-800">
                                <div class="flex items-center gap-2">
                                    <span class="text-xl">❌</span>
                                    <strong class="text-base font-bold text-red-900">გაგზავნა ვერ მოხერხდა!</strong>
                                </div>
                                <p>${escapeHtml(error.message || 'სერვერთან კავშირი ვერ დამყარდა. გთხოვთ, სცადოთ მოგვიანებით.')}</p>
                            </div>
                        `;
                    }
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                    }
                });
        });
    }
}

/* ==========================================================================
   Helper Utilities
   ========================================================================== */
function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

