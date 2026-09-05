import {proofScreen} from "/lib/flows.js";

export default proofScreen({
    startAction: "Create passkey challenge",
    verifyAction: "Use this device",
    prompt: "Confirm the local browser ceremony using the platform authenticator bound to this device.",
    visual: `<div class="auth-visual"><span>PLATFORM KEY</span><strong>PASSKEY</strong><span>PHISHING RESISTANT</span></div>`,
    detail: `<div class="method-detail"><span>DEVICE BOUND</span><span>USER GESTURE</span><span>PASSWORDLESS</span></div>`
});
