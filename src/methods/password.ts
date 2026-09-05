import {credentialMethod} from "../core/patterns.js";

export default credentialMethod({
    descriptor: {
        id: "password",
        order: 1,
        name: "Password",
        category: "Knowledge factor",
        summary: "A familiar credential flow backed by memory-hard hashing and bounded verification attempts.",
        assurance: "foundational",
        accent: "#8da2ff"
    },
    environmentKey: "AUTH_PASSWORD",
    demoSecret: "Northstar#2026",
    label: "Password",
    requirements: "Minimum 12 characters",
    attempts: 5
});
