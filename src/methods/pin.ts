import {credentialMethod} from "../core/patterns.js";

export default credentialMethod({
    descriptor: {
        id: "pin",
        order: 3,
        name: "Device PIN",
        category: "Knowledge factor",
        summary: "A compact device-bound entry pattern with aggressive attempt limits and protected comparison.",
        assurance: "foundational",
        accent: "#f28bba"
    },
    environmentKey: "AUTH_PIN",
    demoSecret: "428615",
    label: "PIN",
    requirements: "Exactly six digits",
    attempts: 3
});
