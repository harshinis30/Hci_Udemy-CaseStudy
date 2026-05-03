interface SearchAutocompleteProps {
  searchValue: string;
  onSelect: (value: string) => void;
}

export function SearchAutocomplete({ searchValue, onSelect }: SearchAutocompleteProps) {
  const suggestions = [
    'Python for Beginners',
    'Python Data Science',
    'Python Machine Learning',
    'AI and Machine Learning',
    'AI for Everyone',
    'Web Development Bootcamp',
    'Web Design Fundamentals',
    'React - The Complete Guide',
    'JavaScript Masterclass',
    'UI/UX Design Course',
  ];

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(searchValue.toLowerCase())
  );

  if (!searchValue || filteredSuggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-80 overflow-y-auto z-50">
      {filteredSuggestions.slice(0, 6).map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0"
        >
          <div className="text-gray-900">{suggestion}</div>
        </button>
      ))}
    </div>
  );
}
