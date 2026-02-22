import { useState } from 'preact/hooks';
import SearchBar from './SearchBar';

interface PatternData {
  name: string;
  slug: string;
  description: string;
  tags: string[];
}

interface PatternFilterProps {
  patterns: PatternData[];
  basePath: string;
}

export default function PatternFilter({ patterns, basePath }: PatternFilterProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const allTags = [...new Set(patterns.flatMap((p) => p.tags))].sort();

  const filteredPatterns = patterns.filter((pattern) => {
    const matchesTag = selectedTag === null || pattern.tags.includes(selectedTag);
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      pattern.name.toLowerCase().includes(lowerQuery) ||
      pattern.description.toLowerCase().includes(lowerQuery);
    return matchesTag && matchesSearch;
  });

  function handleTagClick(tag: string): void {
    setSelectedTag(selectedTag === tag ? null : tag);
  }

  return (
    <div class="pattern-filter">
      <div class="filter-controls">
        <SearchBar onSearch={setSearchQuery} />
        <div class="tag-filters">
          {allTags.map((tag) => (
            <button
              key={tag}
              class={`tag-button ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
          {selectedTag && (
            <button class="tag-button clear" onClick={() => setSelectedTag(null)}>
              Clear filter
            </button>
          )}
        </div>
      </div>

      <div class="pattern-list">
        {filteredPatterns.length === 0 && <p class="empty">No patterns match your filters.</p>}
        {filteredPatterns.map((pattern) => (
          <a key={pattern.slug} href={`${basePath}/patterns/${pattern.slug}/`} class="pattern-item">
            <h3>{pattern.name}</h3>
            <p>{pattern.description}</p>
            <div class="tags">
              {pattern.tags.map((tag) => (
                <span key={tag} class="tag">
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
