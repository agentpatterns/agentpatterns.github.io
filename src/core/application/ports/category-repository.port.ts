import type { Category } from '@domain/entities/category.entity';

export interface CategoryRepositoryPort {
  findAll(): Promise<readonly Category[]>;
  findBySlug(slug: string): Promise<Category | undefined>;
}
