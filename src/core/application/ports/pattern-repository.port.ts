import type { Pattern } from '@domain/entities/pattern.entity';

export interface PatternRepositoryPort {
  findAll(): Promise<readonly Pattern[]>;
  findBySlug(slug: string): Promise<Pattern | undefined>;
  findByCategorySlug(categorySlug: string): Promise<readonly Pattern[]>;
}
