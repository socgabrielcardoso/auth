import {proofMethod} from "../core/patterns.js";

export default proofMethod({
    descriptor: {
        id: "security-key",
        order: 10,
        name: "Security Key",
        category: "Hardware factor",
        summary: "A roaming-key ceremony that requires a server challenge and a deliberate physical confirmation.",
        assurance: "strong",
        accent: "#6ce0c1"
    },
    action: "security-key",
    capability: "Roaming authenticator"
});
