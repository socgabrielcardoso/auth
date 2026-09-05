import {codeScreen} from "/lib/flows.js";

export default codeScreen({
    startAction: "Send email code",
    verifyAction: "Verify email code",
    label: "Code from email",
    visual: `<div class="auth-visual"><span>EMAIL CHANNEL</span><strong>6 DIGITS</strong><span>TTL / 05:00</span></div>`,
    detail: `<div class="method-detail"><span>ONE TIME</span><span>MASKED TARGET</span><span>EXPIRING</span></div>`
});
