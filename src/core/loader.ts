import {readdir} from "node:fs/promises";
import type {AuthMethod} from "./types.js";

export async function loadMethods(): Promise<Map<string, AuthMethod>> {
    const directory = new URL("../methods/", import.meta.url);
    const files = (await readdir(directory))
        .filter(file => file.endsWith(".js") || file.endsWith(".ts"))
        .sort();
    const methods = new Map<string, AuthMethod>();

    for (const file of files) {
        const module = await import(new URL(file, directory).href) as {default?: AuthMethod};
        const method = module.default;
        if (!method) {
            continue;
        }
        if (methods.has(method.descriptor.id)) {
            throw new Error(`Duplicate method: ${method.descriptor.id}`);
        }
        methods.set(method.descriptor.id, method);
    }
    return methods;
}

