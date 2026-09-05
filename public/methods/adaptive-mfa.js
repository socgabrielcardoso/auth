import {busy, escapeHtml, feedback, identityForm, methodShell, showToast} from "/lib/ui.js";

export default {
    render(method) {
        return methodShell(
            method,
            identityForm("Evaluate sign-in risk", `<div class="auth-visual"><span>RISK ENGINE</span><strong>ADAPTIVE</strong><span>CONTEXT AWARE</span></div>`),
            `<div class="method-detail"><span>RISK SCORE</span><span>STEP UP</span><span>DYNAMIC FACTOR</span></div>`
        );
    },
    mount(environment) {
        const form = environment.stage.querySelector("[data-step=identity]");
        form.addEventListener("submit", async event => {
            event.preventDefault();
            busy(form, true);
            feedback(environment.stage, "Evaluating contextual risk");
            try {
                const challenge = await environment.api.start(environment.method.id, Object.fromEntries(new FormData(form)));
                environment.stage.querySelector(".auth-panel").innerHTML = `
                    <div class="challenge-summary"><span>${escapeHtml(challenge.data.riskBand)} risk / ${challenge.data.riskScore}</span><code>${escapeHtml(challenge.data.preview ?? "")}</code></div>
                    <form class="auth-form" data-step="verify">
                        <label><span>${escapeHtml(challenge.data.factor)}</span><input name="value" inputmode="numeric" autocomplete="one-time-code" placeholder="${"0".repeat(challenge.data.digits)}" required></label>
                        <button class="primary" type="submit"><span>Complete adaptive check</span><b>✓</b></button>
                    </form>
                    <div class="feedback" data-feedback aria-live="polite"></div>
                `;
                const verifyForm = environment.stage.querySelector("[data-step=verify]");
                verifyForm.addEventListener("submit", async verifyEvent => {
                    verifyEvent.preventDefault();
                    busy(verifyForm, true);
                    try {
                        const value = new FormData(verifyForm).get("value") ?? "";
                        const result = await environment.api.verify(environment.method.id, challenge.challengeId, {value});
                        feedback(environment.stage, result.message, "success");
                        showToast("Adaptive MFA verified");
                        await environment.complete();
                    } catch (error) {
                        feedback(environment.stage, error.message, "error");
                        showToast("Adaptive check rejected", "error");
                        busy(verifyForm, false);
                    }
                });
            } catch (error) {
                feedback(environment.stage, error.message, "error");
                busy(form, false);
            }
        });
    }
};
