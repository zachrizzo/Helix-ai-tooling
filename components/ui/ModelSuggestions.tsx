import { useState } from 'react';

interface Suggestion {
    id: number;
    label: string;
    confidence: number;
    coordinates: number[];
}

interface ModelSuggestionsProps {
    suggestions: Suggestion[];
    onApplySuggestion: (suggestion: Suggestion) => void;
    onApplyAll: () => void;
    onDismiss: (id: number) => void;
}

export default function ModelSuggestions({
    suggestions,
    onApplySuggestion,
    onApplyAll,
    onDismiss
}: ModelSuggestionsProps) {
    const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);

    if (suggestions.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-600 text-white px-4 py-3 flex justify-between items-center">
                <h3 className="font-medium flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    AI Suggestions ({suggestions.length})
                </h3>
                <button
                    onClick={onApplyAll}
                    className="text-xs bg-white text-green-700 px-2 py-1 rounded hover:bg-green-50"
                >
                    Apply All
                </button>
            </div>

            <div className="max-h-60 overflow-y-auto">
                {suggestions.map((suggestion) => (
                    <div
                        key={suggestion.id}
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${selectedSuggestion === suggestion.id ? 'bg-blue-50' : ''
                            }`}
                        onClick={() => setSelectedSuggestion(suggestion.id)}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="font-medium text-gray-900">{suggestion.label}</span>
                                <div className="text-xs text-gray-500 mt-1">
                                    Confidence: {(suggestion.confidence * 100).toFixed(1)}%
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onApplySuggestion(suggestion);
                                    }}
                                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                                >
                                    Apply
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDismiss(suggestion.id);
                                    }}
                                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>

                        {selectedSuggestion === suggestion.id && (
                            <div className="mt-2 text-xs text-gray-600">
                                <div>Position: {suggestion.coordinates.map(c => c.toFixed(1)).join(', ')}</div>
                                <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className="bg-green-600 h-1.5 rounded-full"
                                        style={{ width: `${suggestion.confidence * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
