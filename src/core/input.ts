import type {AuthInput} from "./types.js";

export function stringValue(input: AuthInput, name: string, maximum = 256): string {
    const value = input[name];
    if (typeof value !== "string") {
        return "";
    }
    return value.trim().slice(0, maximum);
}

export function requireIdentity(input: AuthInput): string {
    const identity = stringValue(input, "identity", 160).toLowerCase();
    if (identity.length < 3) {
        throw new Error("Enter a valid identity");
    }
    return identity;
}

export function maskIdentity(identity: string): string {
    const at = identity.indexOf("@");
    if (at > 1) {
        return `${identity.slice(0, 2)}${"•".repeat(Math.min(6, at - 2))}${identity.slice(at)}`;
    }
    if (identity.length > 4) {
        return `${identity.slice(0, 2)}${"•".repeat(identity.length - 4)}${identity.slice(-2)}`;
    }
    return identity;
}
