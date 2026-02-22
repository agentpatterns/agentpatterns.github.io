import { useState } from 'preact/hooks';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Search patterns...' }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  function handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    setSearchQuery(target.value);
    onSearch(target.value);
  }

  return (
    <input
      type="text"
      value={searchQuery}
      onInput={handleInput}
      placeholder={placeholder}
      class="search-input"
    />
  );
}
