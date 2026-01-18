import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, Save, ArrowLeft } from 'lucide-react';

export default function CreateRFP() {
    const [query, setQuery] = useState('');
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const handleGenerate = async () => {
        if (!query) return;
        setLoading(true);
        try {
            const res = await axios.post('/api/rfps/generate', { query });
            setPreview(res.data);
        } catch (error) {
            alert('Failed to generate RFP structure. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!preview) return;
        setSaving(true);
        try {
            const rfpData = {
                title: preview.summary ? preview.summary.slice(0, 50) + "..." : "New RFP",
                originalQuery: query,
                structuredData: preview
            };
            const res = await axios.post('/api/rfps', rfpData);
            navigate(`/rfp/${res.data._id}`);
        } catch (error) {
            alert('Failed to save RFP.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-white mb-6">
                <ArrowLeft size={16} className="mr-1" /> Back
            </button>

            <h1 className="text-3xl font-bold mb-2 text-white">Create New RFP</h1>
            <p className="text-gray-400 mb-8">Describe your procurement requirements, and our AI will structure it for you.</p>

            <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800 mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-2">Requirement Description</label>
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., I need 50 high-end laptops for our engineering team. Budget is around $2500 each. Need delivery by next month..."
                    className="w-full h-32 p-4 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none placeholder-gray-500"
                ></textarea>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !query}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {loading ? 'Generating...' : <><Sparkles size={18} className="mr-2" /> Generate Structure</>}
                    </button>
                </div>
            </div>

            {preview && (
                <div className="animate-fade-in">
                    <h2 className="text-xl font-bold mb-4 text-white">AI Preview</h2>
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Summary</h3>
                            <p className="mt-1 font-medium text-white">{preview.summary}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Items</h3>
                            <ul className="mt-1 space-y-2">
                                {preview.items.map((item, idx) => (
                                    <li key={idx} className="bg-gray-900 p-3 rounded border border-gray-700">
                                        <span className="font-bold text-white">{item.name}</span> <span className="text-gray-400">x {item.quantity}</span>
                                        <p className="text-sm text-gray-300 mt-1">{item.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Budget</h3>
                                <p className="mt-1 text-white">{preview.budget}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Timeline</h3>
                                <p className="mt-1 text-white">{preview.timeline}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full mt-6 flex justify-center items-center py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
                    >
                        {saving ? 'Saving...' : <><Save size={18} className="mr-2" /> Save & Continue</>}
                    </button>
                </div>
            )}
        </div>
    );
}
