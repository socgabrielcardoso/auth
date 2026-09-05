import {signedLinkMethod} from "../core/patterns.js";

export default signedLinkMethod({
    id: "magic-link",
    order: 8,
    name: "Magic Link",
    category: "Passwordless",
    summary: "A signed and expiring one-time link that completes authentication without a memorized secret.",
    assurance: "standard",
    accent: "#ff8a6b"
});
