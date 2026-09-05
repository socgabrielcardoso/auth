import {federatedScreen} from "/lib/flows.js";

export default federatedScreen({
    startAction: "Continue to provider",
    verifyAction: "Return with identity",
    prompt: "Complete the provider handoff and return with the original state bound to this browser.",
    providers: [
        {id: "github", mark: "GH", name: "GitHub"},
        {id: "google", mark: "G", name: "Google"},
        {id: "microsoft", mark: "MS", name: "Microsoft"}
    ],
    visual: `<div class="auth-visual"><span>FEDERATED</span><strong>OAUTH 2</strong><span>STATE BOUND</span></div>`,
    detail: `<div class="method-detail"><span>FEDERATION</span><span>STATE TOKEN</span><span>PROVIDER CHOICE</span></div>`
});
