import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface Experiment {
    id: string;
    name: string;
    status: 'running' | 'completed' | 'failed';
    startTime: string;
    endTime?: string;
    metrics: {
        accuracy: number[];
        loss: number[];
        val_accuracy: number[];
        val_loss: number[];
    };
    epochs: number;
    currentEpoch: number;
    modelType: string;
    dataset: string;
    hyperparameters: Record<string, any>;
}

interface ExperimentTrackerProps {
    experiments: Experiment[];
    onViewDetails: (experimentId: string) => void;
    onCompare: (experimentIds: string[]) => void;
}

export default function ExperimentTracker({
    experiments,
    onViewDetails,
    onCompare
}: ExperimentTrackerProps) {
    const [selectedExperiments, setSelectedExperiments] = useState<string[]>([]);
    const [metricToShow, setMetricToShow] = useState<'accuracy' | 'loss'>('accuracy');
    const [showValidation, setShowValidation] = useState(true);

    const toggleExperimentSelection = (experimentId: string) => {
        if (selectedExperiments.includes(experimentId)) {
            setSelectedExperiments(selectedExperiments.filter(id => id !== experimentId));
        } else {
            setSelectedExperiments([...selectedExperiments, experimentId]);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'running':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getChartData = (experiment: Experiment) => {
        const labels = Array.from({ length: experiment.currentEpoch }, (_, i) => `Epoch ${i + 1}`);

        const datasets = [];

        if (metricToShow === 'accuracy') {
            datasets.push({
                label: 'Training Accuracy',
                data: experiment.metrics.accuracy.slice(0, experiment.currentEpoch),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            });

            if (showValidation) {
                datasets.push({
                    label: 'Validation Accuracy',
                    data: experiment.metrics.val_accuracy.slice(0, experiment.currentEpoch),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                });
            }
        } else {
            datasets.push({
                label: 'Training Loss',
                data: experiment.metrics.loss.slice(0, experiment.currentEpoch),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            });

            if (showValidation) {
                datasets.push({
                    label: 'Validation Loss',
                    data: experiment.metrics.val_loss.slice(0, experiment.currentEpoch),
                    borderColor: 'rgb(255, 159, 64)',
                    backgroundColor: 'rgba(255, 159, 64, 0.5)',
                });
            }
        }

        return { labels, datasets };
    };

    const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: metricToShow === 'accuracy' ? 'Accuracy Over Time' : 'Loss Over Time',
            },
        },
        scales: {
            y: {
                min: metricToShow === 'accuracy' ? 0 : undefined,
                max: metricToShow === 'accuracy' ? 1 : undefined,
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Experiment Tracking</h3>
                <div className="flex space-x-2">
                    <select
                        value={metricToShow}
                        onChange={(e) => setMetricToShow(e.target.value as 'accuracy' | 'loss')}
                        className="border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="accuracy">Accuracy</option>
                        <option value="loss">Loss</option>
                    </select>

                    <div className="flex items-center">
                        <input
                            id="show-validation"
                            type="checkbox"
                            checked={showValidation}
                            onChange={() => setShowValidation(!showValidation)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="show-validation" className="ml-2 text-sm text-gray-700">
                            Show Validation
                        </label>
                    </div>
                </div>
            </div>

            <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {experiments.map((experiment) => (
                    <div key={experiment.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedExperiments.includes(experiment.id)}
                                    onChange={() => toggleExperimentSelection(experiment.id)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                                />
                                <h4 className="text-md font-medium text-gray-900">{experiment.name}</h4>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(experiment.status)}`}>
                                    {experiment.status}
                                </span>
                                <button
                                    onClick={() => onViewDetails(experiment.id)}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    Details
                                </button>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="h-48 mb-4">
                                <Line options={chartOptions} data={getChartData(experiment)} />
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Model Type</p>
                                    <p className="font-medium">{experiment.modelType}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Dataset</p>
                                    <p className="font-medium">{experiment.dataset}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Progress</p>
                                    <p className="font-medium">{experiment.currentEpoch} / {experiment.epochs} epochs</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Started</p>
                                    <p className="font-medium">{new Date(experiment.startTime).toLocaleString()}</p>
                                </div>
                            </div>

                            {experiment.status === 'running' && (
                                <div className="mt-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{ width: `${(experiment.currentEpoch / experiment.epochs) * 100}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 text-right">
                                        {Math.round((experiment.currentEpoch / experiment.epochs) * 100)}% complete
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {selectedExperiments.length > 1 && (
                <div className="bg-blue-50 p-4 border-t border-blue-100 flex justify-between items-center">
                    <p className="text-sm text-blue-700">
                        {selectedExperiments.length} experiments selected
                    </p>
                    <button
                        onClick={() => onCompare(selectedExperiments)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Compare Experiments
                    </button>
                </div>
            )}
        </div>
    );
}
