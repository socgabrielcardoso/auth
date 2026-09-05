import {decisionScreen} from "/lib/flows.js";

export default decisionScreen({
    startAction: "Generate QR session",
    verifyAction: "Pair this browser",
    device: "Mobile session scanner",
    prompt: "Scan the visual session marker on a trusted mobile device, then pair this browser.",
    visual: `<div class="auth-visual"><span>CROSS DEVICE</span><strong>▦ QR PAIR</strong><span>EPHEMERAL SESSION</span></div>`,
    detail: `<div class="method-detail"><span>CROSS DEVICE</span><span>NONCE BOUND</span><span>SHORT LIVED</span></div>`
});
