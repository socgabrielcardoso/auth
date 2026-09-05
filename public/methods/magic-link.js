import {linkScreen} from "/lib/flows.js";

export default linkScreen({
    startAction: "Prepare secure link",
    verifyAction: "Open secure link",
    prompt: "The signed link is single-use, scoped to this identity and expires after ten minutes.",
    visual: `<div class="auth-visual"><span>SIGNED URL</span><strong>MAGIC LINK</strong><span>TTL / 10:00</span></div>`,
    detail: `<div class="method-detail"><span>HMAC SIGNED</span><span>SINGLE USE</span><span>PASSWORDLESS</span></div>`
});
