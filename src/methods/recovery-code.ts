import {credentialMethod} from "../core/patterns.js";

export default credentialMethod({
    descriptor: {
        id: "recovery-code",
        order: 12,
        name: "Recovery Code",
        category: "Recovery factor",
        summary: "A break-glass flow for a pre-issued recovery secret protected by hashing and strict retries.",
        assurance: "standard",
        accent: "#ff9d66"
    },
    environmentKey: "AUTH_RECOVERY_CODE",
    demoSecret: "R7KM-4PDQ-9VTX",
    label: "Recovery code",
    requirements: "One unused twelve-character code",
    attempts: 3
});
