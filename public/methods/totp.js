import {codeScreen} from "/lib/flows.js";

export default codeScreen({
    startAction: "Open authenticator step",
    verifyAction: "Validate authenticator",
    label: "Authenticator code",
    visual: `<div class="auth-visual"><span>RFC 6238</span><strong>30 SEC</strong><span>HMAC / SHA1</span></div>`,
    detail: `<div class="method-detail"><span>TIME BASED</span><span>DRIFT WINDOW</span><span>6 DIGITS</span></div>`
});
