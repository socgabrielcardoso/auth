import {credentialScreen} from "/lib/flows.js";

export default credentialScreen({
    startAction: "Open passphrase gate",
    verifyAction: "Unlock session",
    label: "Passphrase",
    type: "password",
    autocomplete: "current-password",
    placeholder: "Enter a memorable phrase",
    visual: `<div class="auth-visual"><span>LONG FORM</span><strong>4 WORDS</strong><span>HIGH ENTROPY</span></div>`,
    detail: `<div class="method-detail"><span>MEMORABLE</span><span>SPACE FRIENDLY</span><span>LOCAL HASH</span></div>`
});
