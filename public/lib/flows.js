import {browserProof, busy, escapeHtml, feedback, identityForm, inputForm, methodShell, showToast} from "/lib/ui.js";

export function credentialScreen(config) {
    return {
        render(method) {
            return methodShell(method, identityForm(config.startAction, config.visual), config.detail);
        },
        mount(environment) {
            bindStart(environment, config, challenge => {
                environment.stage.querySelector(".auth-panel").innerHTML = inputForm({
                    label: config.label,
                    type: config.type,
                    autocomplete: config.autocomplete,
                    placeholder: config.placeholder,
                    action: config.verifyAction,
                    preview: challenge.data.preview
                });
                bindVerify(environment, challenge, value => ({value}));
            });
        }
    };
}

export function codeScreen(config) {
    return {
        render(method) {
            return methodShell(method, identityForm(config.startAction, config.visual), config.detail);
        },
        mount(environment) {
            bindStart(environment, config, challenge => {
                environment.stage.querySelector(".auth-panel").innerHTML = inputForm({
                    label: config.label,
                    type: "text",
                    autocomplete: "one-time-code",
                    placeholder: "000000",
                    action: config.verifyAction,
                    preview: challenge.data.preview
                });
                bindVerify(environment, challenge, value => ({value: value.replace(/\D/g, "")}));
            });
        }
    };
}

export function decisionScreen(config) {
    return {
        render(method) {
            return methodShell(method, identityForm(config.startAction, config.visual), config.detail);
        },
        mount(environment) {
            bindStart(environment, config, challenge => {
                environment.stage.querySelector(".auth-panel").innerHTML = `
                    <div class="decision-card">
                        <span>${escapeHtml(config.device)}</span>
                        <strong>${escapeHtml(challenge.data.nonce.slice(0, 4).toUpperCase())}</strong>
                        <p>${escapeHtml(config.prompt)}</p>
                        <button class="primary" data-decision="${escapeHtml(challenge.data.action)}"><span>${escapeHtml(config.verifyAction)}</span><b>✓</b></button>
                        <button class="secondary" data-decision="deny">Deny request</button>
                    </div>
                    <div class="feedback" data-feedback aria-live="polite"></div>
                `;
                for (const button of environment.stage.querySelectorAll("[data-decision]")) {
                    button.addEventListener("click", async () => {
                        await verify(environment, challenge, {value: button.dataset.decision});
                    });
                }
            });
        }
    };
}

export function linkScreen(config) {
    return {
        render(method) {
            return methodShell(method, identityForm(config.startAction, config.visual), config.detail);
        },
        mount(environment) {
            bindStart(environment, config, challenge => {
                environment.stage.querySelector(".auth-panel").innerHTML = `
                    <div class="link-card">
                        <span>Secure link prepared</span>
                        <p>${escapeHtml(config.prompt)}</p>
                        <button class="primary" data-open-link><span>${escapeHtml(config.verifyAction)}</span><b>↗</b></button>
                    </div>
                    <div class="feedback" data-feedback aria-live="polite"></div>
                `;
                environment.stage.querySelector("[data-open-link]").addEventListener("click", () => verify(environment, challenge, {value: challenge.data.preview ?? ""}));
            });
        }
    };
}

export function proofScreen(config) {
    return {
        render(method) {
            return methodShell(method, identityForm(config.startAction, config.visual), config.detail);
        },
        mount(environment) {
            bindStart(environment, config, challenge => {
                environment.stage.querySelector(".auth-panel").innerHTML = `
                    <div class="proof-card">
                        <div class="proof-rings"><span></span><span></span><span></span></div>
                        <span>${escapeHtml(challenge.data.capability)}</span>
                        <p>${escapeHtml(config.prompt)}</p>
                        <button class="primary" data-proof><span>${escapeHtml(config.verifyAction)}</span><b>◎</b></button>
                    </div>
                    <div class="feedback" data-feedback aria-live="polite"></div>
                `;
                environment.stage.querySelector("[data-proof]").addEventListener("click", async () => {
                    const value = await browserProof(challenge.data.challenge, challenge.data.action);
                    await verify(environment, challenge, {value});
                });
            });
        }
    };
}

export function federatedScreen(config) {
    return {
        render(method) {
            const choices = config.providers.map(provider => `<button type="button" class="provider" data-provider="${escapeHtml(provider.id)}"><b>${escapeHtml(provider.mark)}</b><span>${escapeHtml(provider.name)}</span></button>`).join("");
            return methodShell(method, `
                ${config.visual}
                <form class="auth-form" data-step="identity">
                    <label><span>Identity</span><input name="identity" type="email" autocomplete="username" placeholder="gabriel@example.com" required></label>
                    <div class="providers">${choices}</div>
                    <input name="provider" type="hidden" required>
                    <button class="primary" type="submit"><span>${escapeHtml(config.startAction)}</span><b>→</b></button>
                </form>
                <div class="feedback" data-feedback aria-live="polite"></div>
            `, config.detail);
        },
        mount(environment) {
            for (const button of environment.stage.querySelectorAll("[data-provider]")) {
                button.addEventListener("click", () => {
                    environment.stage.querySelector("[name=provider]").value = button.dataset.provider;
                    for (const item of environment.stage.querySelectorAll("[data-provider]")) {
                        item.classList.toggle("selected", item === button);
                    }
                });
            }
            bindStart(environment, config, challenge => {
                environment.stage.querySelector(".auth-panel").innerHTML = `
                    <div class="provider-handoff">
                        <span>Identity provider</span>
                        <strong>${escapeHtml(challenge.data.provider)}</strong>
                        <p>${escapeHtml(config.prompt)}</p>
                        <button class="primary" data-provider-return><span>${escapeHtml(config.verifyAction)}</span><b>↗</b></button>
                    </div>
                    <div class="feedback" data-feedback aria-live="polite"></div>
                `;
                environment.stage.querySelector("[data-provider-return]").addEventListener("click", () => verify(environment, challenge, {value: challenge.data.state ?? ""}));
            });
        }
    };
}

function bindStart(environment, config, next) {
    const form = environment.stage.querySelector("[data-step=identity]");
    form.addEventListener("submit", async event => {
        event.preventDefault();
        busy(form, true);
        feedback(environment.stage, "Creating protected challenge");
        try {
            const input = Object.fromEntries(new FormData(form));
            const challenge = await environment.api.start(environment.method.id, input);
            next(challenge);
        } catch (error) {
            feedback(environment.stage, error.message, "error");
            busy(form, false);
        }
    });
}

function bindVerify(environment, challenge, input) {
    const form = environment.stage.querySelector("[data-step=verify]");
    form.addEventListener("submit", async event => {
        event.preventDefault();
        busy(form, true);
        await verify(environment, challenge, input(new FormData(form).get("value") ?? ""));
        busy(form, false);
    });
}

async function verify(environment, challenge, input) {
    feedback(environment.stage, "Verifying challenge");
    try {
        const result = await environment.api.verify(environment.method.id, challenge.challengeId, input);
        feedback(environment.stage, result.message, "success");
        showToast(`${environment.method.name} verified`);
        await environment.complete();
    } catch (error) {
        feedback(environment.stage, error.message, "error");
        showToast("Verification rejected", "error");
    }
}
