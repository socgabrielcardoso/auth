import {credentialScreen} from "/lib/flows.js";

export default credentialScreen({
    startAction: "Request PIN entry",
    verifyAction: "Confirm PIN",
    label: "Six-digit PIN",
    type: "password",
    autocomplete: "one-time-code",
    placeholder: "••••••",
    visual: `<div class="auth-visual"><span>DEVICE PIN</span><strong>4 2 8 6 1 5</strong><span>ATTEMPTS / 03</span></div>`,
    detail: `<div class="method-detail"><span>DEVICE BOUND</span><span>SHORT INPUT</span><span>3 ATTEMPTS</span></div>`
});
