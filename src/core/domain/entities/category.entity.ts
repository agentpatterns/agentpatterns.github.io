import { z } from 'zod';
import { Slug } from '../value-objects/slug.value-object';
import { DisplayOrder } from '../value-objects/display-order.value-object';

// Input schema validates the raw props before constructing value objects,
// catching structural issues (empty strings, non-positive order) early.
const CategoryPropsSchema = z.object({
  name: z.string().min(1, 'Category name must not be empty'),
  description: z.string().min(1, 'Category description must not be empty'),
  displayOrder: z.number().positive('Category displayOrder must be greater than zero'),
});

type CategoryProps = z.infer<typeof CategoryPropsSchema>;

export class Category {
  readonly name: string;
  readonly slug: Slug;
  readonly description: string;
  readonly displayOrder: DisplayOrder;

  private constructor(
    name: string,
    slug: Slug,
    description: string,
    displayOrder: DisplayOrder,
  ) {
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.displayOrder = displayOrder;
  }

  /**
   * Factory method that validates raw input and constructs a Category with
   * derived value objects. The slug is derived from the human-readable name
   * so category URLs remain stable and predictable.
   */
  static create(props: CategoryProps): Category {
    const result = CategoryPropsSchema.safeParse(props);
    if (!result.success) {
      throw new Error(
        `Invalid category props: ${result.error.issues[0]?.message}`,
      );
    }

    const { name, description, displayOrder } = result.data;
    const slug = Slug.fromName(name);
    const order = DisplayOrder.create(displayOrder);

    return new Category(name, slug, description, order);
  }
}
