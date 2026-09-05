import {decisionMethod} from "../core/patterns.js";

export default decisionMethod({
    descriptor: {
        id: "push",
        order: 7,
        name: "Push Approval",
        category: "Possession factor",
        summary: "An out-of-band approval ceremony tied to a short transaction identifier and trusted device.",
        assurance: "strong",
        accent: "#f2bd5c"
    },
    action: "approve",
    ttlMs: 2 * 60_000
});
