import {codeScreen} from "/lib/flows.js";

export default codeScreen({
    startAction: "Send text message",
    verifyAction: "Confirm SMS code",
    label: "Code from SMS",
    visual: `<div class="auth-visual"><span>MOBILE CHANNEL</span><strong>SMS / 6</strong><span>TTL / 03:00</span></div>`,
    detail: `<div class="method-detail"><span>PHONE FACTOR</span><span>ONE TIME</span><span>3 MINUTES</span></div>`
});
