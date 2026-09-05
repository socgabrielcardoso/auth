import {credentialMethod} from "../core/patterns.js";

export default credentialMethod({
    descriptor: {
        id: "passphrase",
        order: 2,
        name: "Passphrase",
        category: "Knowledge factor",
        summary: "A longer human-readable secret designed for stronger entropy without impossible recall.",
        assurance: "standard",
        accent: "#a98cff"
    },
    environmentKey: "AUTH_PASSPHRASE",
    demoSecret: "cobalt river keeps moving",
    label: "Passphrase",
    requirements: "Four or more unrelated words",
    attempts: 5
});
