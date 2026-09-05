import {proofMethod} from "../core/patterns.js";

export default proofMethod({
    descriptor: {
        id: "passkey",
        order: 9,
        name: "Passkey Ceremony",
        category: "Browser proof",
        summary: "A local platform-authenticator experience built around a server challenge and explicit user gesture.",
        assurance: "strong",
        accent: "#66d3ff"
    },
    action: "passkey",
    capability: "Platform authenticator"
});
