let csrfToken = "";

export function createApi() {
    return {
        async initialize() {
            const response = await fetch("/api/csrf", {headers: {Accept: "application/json"}});
            const value = await response.json();
            csrfToken = value.token;
        },
        async start(method, input) {
            return request(`/api/methods/${method}/start`, input);
        },
        async verify(method, challengeId, input) {
            return request(`/api/methods/${method}/verify`, {challengeId, ...input});
        }
    };
}

export async function request(path, input) {
    const response = await fetch(path, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify(input)
    });
    const value = await response.json();
    if (!response.ok) {
        throw new Error(value.error ?? value.message ?? "Authentication request failed");
    }
    return value;
}

export function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

export function methodShell(method, content, detail = "") {
    return `
        <section class="method-shell">
            <div class="method-intro">
                <div class="method-index">METHOD ${String(method.order).padStart(2, "0")}</div>
                <div class="assurance">${escapeHtml(method.assurance)}</div>
                <h1>${escapeHtml(method.name)}</h1>
                <p>${escapeHtml(method.summary)}</p>
                ${detail}
            </div>
            <div class="auth-panel">
                ${content}
            </div>
        </section>
    `;
}

export function identityForm(action, visual = "") {
    return `
        ${visual}
        <form class="auth-form" data-step="identity">
            <label>
                <span>Identity</span>
                <input name="identity" type="text" autocomplete="username" placeholder="gabriel@example.com" minlength="3" maxlength="160" required>
            </label>
            <button class="primary" type="submit"><span>${escapeHtml(action)}</span><b>→</b></button>
        </form>
        <div class="feedback" data-feedback aria-live="polite"></div>
    `;
}

export function inputForm({label, type = "text", autocomplete = "one-time-code", placeholder = "", action = "Verify", preview = ""}) {
    return `
        <div class="challenge-summary">
            <span>Challenge active</span>
            ${preview ? `<code>${escapeHtml(preview)}</code>` : ""}
        </div>
        <form class="auth-form" data-step="verify">
            <label>
                <span>${escapeHtml(label)}</span>
                <input name="value" type="${escapeHtml(type)}" autocomplete="${escapeHtml(autocomplete)}" placeholder="${escapeHtml(placeholder)}" required>
            </label>
            <button class="primary" type="submit"><span>${escapeHtml(action)}</span><b>✓</b></button>
        </form>
        <div class="feedback" data-feedback aria-live="polite"></div>
    `;
}

export function feedback(stage, message, tone = "neutral") {
    const element = stage.querySelector("[data-feedback]");
    if (element) {
        element.textContent = message;
        element.dataset.tone = tone;
    }
}

export function busy(form, active) {
    for (const control of form.elements) {
        control.disabled = active;
    }
    form.classList.toggle("busy", active);
}

export function showToast(message, tone = "ok") {
    const toast = document.querySelector("#toast");
    toast.textContent = message;
    toast.dataset.tone = tone;
    toast.classList.add("visible");
    window.setTimeout(() => toast.classList.remove("visible"), 2800);
}

export async function browserProof(challenge, action) {
    const bytes = new TextEncoder().encode(`${challenge}|${action}`);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, "0")).join("");
}

