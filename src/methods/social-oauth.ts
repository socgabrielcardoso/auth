import {federatedMethod} from "../core/patterns.js";

export default federatedMethod({
    descriptor: {
        id: "social-oauth",
        order: 13,
        name: "Social OAuth",
        category: "Federated identity",
        summary: "A provider handoff protected by a high-entropy state value bound to the initiating browser.",
        assurance: "standard",
        accent: "#fb7a90"
    },
    providers: ["github", "google", "microsoft"]
});
