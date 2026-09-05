import {codeMethod} from "../core/patterns.js";

export default codeMethod({
    descriptor: {
        id: "email-otp",
        order: 4,
        name: "Email OTP",
        category: "Possession factor",
        summary: "A short-lived verification code delivered to a masked email identity and invalidated after use.",
        assurance: "standard",
        accent: "#53c7f0"
    },
    channel: "email",
    digits: 6,
    ttlMs: 5 * 60_000
});
