import {totpMethod} from "../core/patterns.js";

export default totpMethod({
    id: "totp",
    order: 6,
    name: "Authenticator App",
    category: "Possession factor",
    summary: "A standards-based rotating code with a narrow clock-drift window and derived local secret.",
    assurance: "strong",
    accent: "#d2e563"
});
