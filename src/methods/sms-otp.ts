import {codeMethod} from "../core/patterns.js";

export default codeMethod({
    descriptor: {
        id: "sms-otp",
        order: 5,
        name: "SMS OTP",
        category: "Possession factor",
        summary: "A time-boxed mobile verification flow with masked identity and strict retry controls.",
        assurance: "standard",
        accent: "#54dfb2"
    },
    channel: "sms",
    digits: 6,
    ttlMs: 3 * 60_000
});
