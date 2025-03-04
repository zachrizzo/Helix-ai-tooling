import { useState } from 'react';

interface DatasetItem {
    id: string;
    type: 'image' | 'point-cloud' | 'time-series';
    thumbnail: string;
    metadata: {
        timestamp: string;
        source: string;
        size: string;
        resolution?: string;
        duration?: string;
        points?: number;
        labels?: number;
        classes?: string[];
    };
}

interface DatasetStats {
    totalItems: number;
    itemsByType: Record<string, number>;
    labeledItems: number;
    unlabeledItems: number;
    classDistribution: Record<string, number>;
}

interface DatasetExplorerProps {
    dataset: {
        id: string;
        name: string;
        description: string;
        createdAt: string;
        updatedAt: string;
        items: DatasetItem[];
        stats: DatasetStats;
    };
    onSelectItem: (itemId: string) => void;
}

export default function DatasetExplorer({ dataset, onSelectItem }: DatasetExplorerProps) {
    const [filterType, setFilterType] = useState<string>('all');
    const [filterLabeled, setFilterLabeled] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<string>('timestamp');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Filter and sort items
    const filteredItems = dataset.items.filter(item => {
        // Filter by type
        if (filterType !== 'all' && item.type !== filterType) {
            return false;
        }

        // Filter by labeled status
        if (filterLabeled === 'labeled' && (!item.metadata.labels || item.metadata.labels === 0)) {
            return false;
        }
        if (filterLabeled === 'unlabeled' && item.metadata.labels && item.metadata.labels > 0) {
            return false;
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                item.id.toLowerCase().includes(query) ||
                item.metadata.source.toLowerCase().includes(query) ||
                (item.metadata.classes && item.metadata.classes.some(c => c.toLowerCase().includes(query)))
            );
        }

        return true;
    });

    // Sort items
    const sortedItems = [...filteredItems].sort((a, b) => {
        let valueA, valueB;

        switch (sortBy) {
            case 'timestamp':
                valueA = new Date(a.metadata.timestamp).getTime();
                valueB = new Date(b.metadata.timestamp).getTime();
                break;
            case 'size':
                valueA = parseInt(a.metadata.size.replace(/[^\d]/g, ''));
                valueB = parseInt(b.metadata.size.replace(/[^\d]/g, ''));
                break;
            case 'labels':
                valueA = a.metadata.labels || 0;
                valueB = b.metadata.labels || 0;
                break;
            default:
                valueA = a.id;
                valueB = b.id;
        }

        if (sortOrder === 'asc') {
            return valueA > valueB ? 1 : -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });

    const handleItemClick = (itemId: string) => {
        setSelectedItem(itemId);
        onSelectItem(itemId);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'image':
                return (
                    <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            case 'point-cloud':
                return (
                    <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                );
            case 'time-series':
                return (
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                );
            default:
                return (
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                );
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Dataset Explorer: {dataset.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{dataset.description}</p>
            </div>

            {/* Dataset Stats */}
            <div className="p-4 border-b border-gray-200 grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700">Total Items</p>
                    <p className="text-2xl font-bold text-blue-900">{dataset.stats.totalItems}</p>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-700">Labeled</p>
                    <p className="text-2xl font-bold text-green-900">{dataset.stats.labeledItems}</p>
                    <p className="text-xs text-green-700">
                        {Math.round((dataset.stats.labeledItems / dataset.stats.totalItems) * 100)}%
                    </p>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-yellow-700">Images</p>
                    <p className="text-2xl font-bold text-yellow-900">{dataset.stats.itemsByType.image || 0}</p>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm text-purple-700">Point Clouds</p>
                    <p className="text-2xl font-bold text-purple-900">{dataset.stats.itemsByType['point-cloud'] || 0}</p>
                </div>

                <div className="bg-indigo-50 p-3 rounded-lg">
                    <p className="text-sm text-indigo-700">Time Series</p>
                    <p className="text-2xl font-bold text-indigo-900">{dataset.stats.itemsByType['time-series'] || 0}</p>
                </div>
            </div>

            {/* Filters and Controls */}
            <div className="p-4 border-b border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label htmlFor="filter-type" className="block text-sm font-medium text-gray-700">
                        Data Type
                    </label>
                    <select
                        id="filter-type"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="all">All Types</option>
                        <option value="image">Images</option>
                        <option value="point-cloud">Point Clouds</option>
                        <option value="time-series">Time Series</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="filter-labeled" className="block text-sm font-medium text-gray-700">
                        Label Status
                    </label>
                    <select
                        id="filter-labeled"
                        value={filterLabeled}
                        onChange={(e) => setFilterLabeled(e.target.value)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="all">All Items</option>
                        <option value="labeled">Labeled Only</option>
                        <option value="unlabeled">Unlabeled Only</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="search-query" className="block text-sm font-medium text-gray-700">
                        Search
                    </label>
                    <input
                        id="search-query"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by ID, source, class..."
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            </div>

            {/* Sort and View Controls */}
            <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div className="flex items-center space-x-2">
                    <label htmlFor="sort-by" className="text-sm font-medium text-gray-700">
                        Sort by:
                    </label>
                    <select
                        id="sort-by"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="timestamp">Timestamp</option>
                        <option value="size">Size</option>
                        <option value="labels">Labels</option>
                    </select>

                    <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="p-1 rounded-md hover:bg-gray-200"
                    >
                        {sortOrder === 'asc' ? (
                            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                            </svg>
                        )}
                    </button>
                </div>

                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{sortedItems.length} items</span>

                    <div className="flex border border-gray-300 rounded-md overflow-hidden">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1 ${viewMode === 'grid' ? 'bg-blue-100' : 'bg-white'}`}
                        >
                            <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1 ${viewMode === 'list' ? 'bg-blue-100' : 'bg-white'}`}
                        >
                            <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Dataset Items */}
            <div className="p-4 bg-gray-50 min-h-[400px]">
                {sortedItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Try adjusting your filters or search query.
                        </p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {sortedItems.map((item) => (
                            <div
                                key={item.id}
                                className={`cursor-pointer rounded-lg overflow-hidden border-2 ${selectedItem === item.id ? 'border-blue-500' : 'border-transparent'
                                    } hover:border-blue-300 transition-colors`}
                                onClick={() => handleItemClick(item.id)}
                            >
                                <div className="relative h-32">
                                    <img
                                        src={item.thumbnail}
                                        alt={`Item ${item.id}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-0 left-0 p-1 bg-black bg-opacity-50 rounded-br">
                                        {getTypeIcon(item.type)}
                                    </div>
                                    {item.metadata.labels && item.metadata.labels > 0 && (
                                        <div className="absolute top-0 right-0 p-1 bg-green-500 text-white text-xs rounded-bl">
                                            {item.metadata.labels} labels
                                        </div>
                                    )}
                                </div>
                                <div className="p-2 bg-white">
                                    <p className="text-xs font-medium text-gray-900 truncate">{item.id}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(item.metadata.timestamp).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Timestamp
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Source
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Size
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Labels
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedItems.map((item) => (
                                    <tr
                                        key={item.id}
                                        className={`cursor-pointer hover:bg-blue-50 ${selectedItem === item.id ? 'bg-blue-50' : ''
                                            }`}
                                        onClick={() => handleItemClick(item.id)}
                                    >
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {getTypeIcon(item.type)}
                                                <span className="ml-2 text-xs text-gray-900 capitalize">{item.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">
                                            {item.id}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                                            {new Date(item.metadata.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                                            {item.metadata.source}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                                            {item.metadata.size}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            {item.metadata.labels && item.metadata.labels > 0 ? (
                                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                                    {item.metadata.labels}
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                                    0
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
