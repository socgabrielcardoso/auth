import {decisionMethod} from "../core/patterns.js";

export default decisionMethod({
    descriptor: {
        id: "qr-login",
        order: 11,
        name: "QR Device Login",
        category: "Cross-device",
        summary: "An ephemeral pairing transaction that transfers approval from a trusted mobile session.",
        assurance: "strong",
        accent: "#efe871"
    },
    action: "pair",
    ttlMs: 90_000
});
