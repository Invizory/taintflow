import {comment} from "./visitor/Program";

export function isTransformed(code: string) {
    return code.trim().startsWith(`/*${comment}*/`);
}
