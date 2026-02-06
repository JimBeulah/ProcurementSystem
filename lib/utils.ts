import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function generateEAN13(): string {
    // 1. Generate first 12 digits
    let code = "";
    for (let i = 0; i < 12; i++) {
        code += Math.floor(Math.random() * 10).toString();
    }

    // 2. Calculate checksum
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        const digit = parseInt(code[i]);
        // Odd positions (1-based) have weight 1, Even positions have weight 3
        // But index is 0-based. 
        // Index 0 (Pos 1) -> weight 1
        // Index 1 (Pos 2) -> weight 3
        const weight = (i % 2 === 0) ? 1 : 3;
        sum += digit * weight;
    }

    const remainder = sum % 10;
    const checksum = (remainder === 0) ? 0 : 10 - remainder;

    return code + checksum;
}
