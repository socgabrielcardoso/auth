import {credentialScreen} from "/lib/flows.js";

export default credentialScreen({
    startAction: "Continue with password",
    verifyAction: "Sign in",
    label: "Password",
    type: "password",
    autocomplete: "current-password",
    placeholder: "Enter your password",
    visual: `<div class="auth-visual"><span>CREDENTIAL</span><strong>••••••••</strong><span>SCRYPT / 256</span></div>`,
    detail: `<div class="method-detail"><span>RATE LIMITED</span><span>CONSTANT TIME</span><span>HTTPONLY SESSION</span></div>`
});
