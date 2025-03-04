import { useState } from 'react';

interface AIAssistantPanelProps {
    onApplySuggestions: (suggestions: any[]) => void;
    onAutoLabel: () => void;
    isProcessing: boolean;
    confidence: number;
    setConfidence: (value: number) => void;
    modelType: string;
    setModelType: (value: string) => void;
}

export default function AIAssistantPanel({
    onApplySuggestions,
    onAutoLabel,
    isProcessing,
    confidence,
    setConfidence,
    modelType,
    setModelType
}: AIAssistantPanelProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const modelTypes = [
        { id: 'object-detection', name: 'Object Detection' },
        { id: 'segmentation', name: 'Segmentation' },
        { id: 'keypoint', name: 'Keypoint Detection' },
        { id: 'pose', name: 'Pose Estimation' },
    ];

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div
                className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h3 className="font-medium flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    AI Labeling Assistant
                </h3>
                <svg
                    className={`h-5 w-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isExpanded && (
                <div className="p-4 space-y-4">
                    <div>
                        <label htmlFor="model-type" className="block text-sm font-medium text-gray-700 mb-1">
                            AI Model Type
                        </label>
                        <select
                            id="model-type"
                            value={modelType}
                            onChange={(e) => setModelType(e.target.value)}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            {modelTypes.map((model) => (
                                <option key={model.id} value={model.id}>
                                    {model.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="confidence" className="block text-sm font-medium text-gray-700 mb-1">
                            Confidence Threshold: {confidence}%
                        </label>
                        <input
                            id="confidence"
                            type="range"
                            min="50"
                            max="95"
                            step="5"
                            value={confidence}
                            onChange={(e) => setConfidence(parseInt(e.target.value))}
                            className="block w-full"
                        />
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={onAutoLabel}
                            disabled={isProcessing}
                            className={`flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isProcessing ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                            {isProcessing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                'Auto-Label'
                            )}
                        </button>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">AI Assistant Tips</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                            <li>• Use a higher confidence threshold for more precise but fewer labels</li>
                            <li>• The Object Detection model works best for common objects</li>
                            <li>• You can always edit AI-generated labels manually</li>
                            <li>• Pre-trained models may need fine-tuning for robotics-specific objects</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
