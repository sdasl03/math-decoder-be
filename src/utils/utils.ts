import * as crypto from 'crypto';

/**
 * Generate a deterministic exercise ID based on exercise attributes
 * This ensures the same exercise configuration always gets the same ID
 */
export function exerciseId(config: {
    generator: string;
    operands: number[];
    level: number;
}): string {
    const data = JSON.stringify(config);
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
}
