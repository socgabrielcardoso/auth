import {decisionScreen} from "/lib/flows.js";

export default decisionScreen({
    startAction: "Send approval request",
    verifyAction: "Approve sign-in",
    device: "Registered mobile device",
    prompt: "Match the request identifier, then approve this sign-in from the trusted device.",
    visual: `<div class="auth-visual"><span>PUSH REQUEST</span><strong>APPROVE</strong><span>DEVICE / TRUSTED</span></div>`,
    detail: `<div class="method-detail"><span>OUT OF BAND</span><span>NUMBER MATCH</span><span>2 MINUTES</span></div>`
});
