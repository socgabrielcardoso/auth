import {proofScreen} from "/lib/flows.js";

export default proofScreen({
    startAction: "Prepare security key",
    verifyAction: "Touch security key",
    prompt: "Insert the roaming authenticator and confirm the challenge with a deliberate physical gesture.",
    visual: `<div class="auth-visual"><span>ROAMING KEY</span><strong>USB / NFC</strong><span>PHYSICAL TOUCH</span></div>`,
    detail: `<div class="method-detail"><span>HARDWARE</span><span>ORIGIN BOUND</span><span>STRONG FACTOR</span></div>`
});
