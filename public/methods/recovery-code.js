import {credentialScreen} from "/lib/flows.js";

export default credentialScreen({
    startAction: "Open account recovery",
    verifyAction: "Consume recovery code",
    label: "Recovery code",
    type: "text",
    autocomplete: "one-time-code",
    placeholder: "XXXX-XXXX-XXXX",
    visual: `<div class="auth-visual"><span>BREAK GLASS</span><strong>RECOVERY</strong><span>SINGLE USE</span></div>`,
    detail: `<div class="method-detail"><span>OFFLINE COPY</span><span>SINGLE USE</span><span>ACCOUNT RECOVERY</span></div>`
});
