import {createApi, escapeHtml, showToast} from "/lib/ui.js";

const list = document.querySelector("#method-list");
const stage = document.querySelector("#stage");
const filter = document.querySelector("#filter");
const count = document.querySelector("#method-count");
const session = document.querySelector("#session");
const api = createApi();
let methods = [];
let selected = "";

async function initialize() {
    try {
        await api.initialize();
        const response = await fetch("/api/methods", {headers: {Accept: "application/json"}});
        if (!response.ok) {
            throw new Error("Method catalog is unavailable");
        }
        methods = await response.json();
        count.textContent = String(methods.length).padStart(2, "0");
        renderList();
        await refreshSession();
        const requested = location.hash.slice(1);
        await selectMethod(methods.some(method => method.id === requested) ? requested : methods[0]?.id);
    } catch (error) {
        stage.innerHTML = `<section class="fatal"><span>Connection failed</span><h1>${escapeHtml(error.message)}</h1><p>Start the local server and reload this page.</p></section>`;
    }
}

function renderList() {
    const query = filter.value.trim().toLowerCase();
    const visible = methods.filter(method => `${method.name} ${method.category} ${method.summary}`.toLowerCase().includes(query));
    list.innerHTML = visible.map(method => `
        <button class="method-card ${method.id === selected ? "active" : ""}" data-method="${escapeHtml(method.id)}" style="--accent:${escapeHtml(method.accent)}">
            <span class="method-order">${String(method.order).padStart(2, "0")}</span>
            <span class="method-copy"><b>${escapeHtml(method.name)}</b><small>${escapeHtml(method.category)}</small></span>
            <span class="method-arrow">↗</span>
        </button>
    `).join("");
    for (const button of list.querySelectorAll("[data-method]")) {
        button.addEventListener("click", () => selectMethod(button.dataset.method));
    }
}

async function selectMethod(id) {
    const method = methods.find(item => item.id === id);
    if (!method) {
        return;
    }
    selected = method.id;
    location.hash = method.id;
    renderList();
    stage.innerHTML = `<section class="loading"><span class="spinner"></span><p>Opening ${escapeHtml(method.name)}</p></section>`;
    try {
        const module = await import(`/methods/${method.id}.js`);
        stage.style.setProperty("--method-accent", method.accent);
        stage.innerHTML = module.default.render(method);
        module.default.mount({stage, method, api, complete: refreshSession});
        stage.focus({preventScroll: true});
    } catch (error) {
        stage.innerHTML = `<section class="fatal"><span>Method unavailable</span><h1>${escapeHtml(method.name)}</h1><p>${escapeHtml(error.message)}</p></section>`;
        showToast("Could not open this method", "error");
    }
}

async function refreshSession() {
    try {
        const response = await fetch("/api/session", {headers: {Accept: "application/json"}});
        const value = await response.json();
        session.textContent = value.authenticated ? `VERIFIED / ${value.method.toUpperCase()}` : "LOCAL SESSION";
        session.classList.toggle("verified", Boolean(value.authenticated));
    } catch {
        session.textContent = "SESSION OFFLINE";
    }
}

filter.addEventListener("input", renderList);
window.addEventListener("hashchange", () => {
    const id = location.hash.slice(1);
    if (id && id !== selected) {
        selectMethod(id);
    }
});

initialize();

