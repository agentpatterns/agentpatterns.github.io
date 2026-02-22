import { z } from 'zod';

// Validates that a display order is a positive integer, used to determine
// the rendering sequence of categories in navigation.
const DisplayOrderSchema = z
  .number()
  .int('DisplayOrder must be an integer')
  .positive('DisplayOrder must be greater than zero');

export class DisplayOrder {
  private constructor(private readonly _value: number) {}

  /**
   * Creates a DisplayOrder from a positive integer.
   * Throws if the value is zero, negative, or non-integer.
   */
  static create(order: number): DisplayOrder {
    const result = DisplayOrderSchema.safeParse(order);
    if (!result.success) {
      throw new Error(
        `Invalid display order: ${order}. ${result.error.issues[0]?.message}`,
      );
    }
    return new DisplayOrder(result.data);
  }

  get value(): number {
    return this._value;
  }

  /**
   * Compares this DisplayOrder to another for ascending sort.
   * Returns negative if this comes before other, positive if after, zero if equal.
   */
  compareTo(other: DisplayOrder): number {
    return this._value - other._value;
  }
}
