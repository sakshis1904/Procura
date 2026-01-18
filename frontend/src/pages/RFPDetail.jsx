import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Send, RefreshCw, CheckCircle, AlertCircle, Plus } from 'lucide-react';

export default function RFPDetail() {
    const { id } = useParams();
    const [rfp, setRfp] = useState(null);
    const [proposals, setProposals] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [selectedVendors, setSelectedVendors] = useState([]);
    const [comparison, setComparison] = useState(null);

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [comparing, setComparing] = useState(false);

    const [newVendor, setNewVendor] = useState({ name: '', email: '' });

    useEffect(() => {
        fetchData();
        fetchVendors();
    }, [id]);

    const fetchData = async () => {
        try {
            const res = await axios.get(`/api/rfps/${id}`);
            setRfp(res.data.rfp);
            setProposals(res.data.proposals);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchVendors = async () => {
        const res = await axios.get('/api/vendors');
        setVendors(res.data);
    };

    const handleAddVendor = async () => {
        if (!newVendor.name || !newVendor.email) return;
        try {
            await axios.post('/api/vendors', newVendor);
            setNewVendor({ name: '', email: '' });
            fetchVendors();
        } catch (err) {
            alert('Error adding vendor');
        }
    };

    const handleSend = async () => {
        if (selectedVendors.length === 0) return alert('Select at least one vendor');
        setSending(true);
        try {
            await axios.post(`/api/rfps/${id}/send`, { vendorIds: selectedVendors });
            alert('RFP sent to selected vendors!');
            fetchData();
        } catch (err) {
            alert('Error sending emails');
        } finally {
            setSending(false);
        }
    };

    const handleScan = async () => {
        setScanning(true);
        try {
            const res = await axios.post('/api/rfps/check-emails');
            alert(res.data.message);
            fetchData();
        } catch (err) {
            alert('Error scanning inbox');
        } finally {
            setScanning(false);
        }
    };

    const handleCompare = async () => {
        if (proposals.length === 0) return;
        setComparing(true);
        try {
            const res = await axios.get(`/api/rfps/${id}/compare`);
            setComparison(res.data);
        } catch (err) {
            alert('Error comparing proposals');
        } finally {
            setComparing(false);
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;
    if (!rfp) return <div className="text-white">RFP not found</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: RFP Details & Actions */}
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-2xl font-bold text-white">{rfp.title}</h1>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${rfp.status === 'Sent' ? 'bg-red-900 text-red-300' : 'bg-gray-800 text-gray-300'}`}>
                            {rfp.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-3 bg-gray-800 rounded-lg">
                            <span className="block text-xs uppercase text-red-400 font-semibold">Budget</span>
                            <span className="font-medium text-white">{rfp.structuredData.budget}</span>
                        </div>
                        <div className="p-3 bg-gray-800 rounded-lg">
                            <span className="block text-xs uppercase text-red-400 font-semibold">Timeline</span>
                            <span className="font-medium text-white">{rfp.structuredData.timeline}</span>
                        </div>
                    </div>

                    <h3 className="font-semibold mb-2 text-white">Items</h3>
                    <ul className="space-y-2 mb-6">
                        {rfp.structuredData.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between border-b border-gray-700 pb-2">
                                <span className="text-white">{item.name}</span>
                                <span className="text-gray-400">x{item.quantity}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Comparison Section */}
                {proposals.length > 0 && (
                    <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">Proposal Comparison</h2>
                            <button
                                onClick={handleCompare}
                                disabled={comparing}
                                className="text-red-400 hover:text-red-300 font-medium"
                            >
                                {comparing ? 'Analyzing...' : 'Analyze & Recommend'}
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-red-400 uppercase bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-3">Vendor</th>
                                        <th className="px-4 py-3">Pricing</th>
                                        <th className="px-4 py-3">Delivery</th>
                                        <th className="px-4 py-3">Warranty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proposals.map(p => (
                                        <tr key={p._id} className="border-b border-gray-700">
                                            <td className="px-4 py-3 font-medium text-white">{p.vendorId?.name || 'Unknown'}</td>
                                            <td className="px-4 py-3 text-gray-300">{p.parsedData.pricing}</td>
                                            <td className="px-4 py-3 text-gray-300">{p.parsedData.deliveryTime}</td>
                                            <td className="px-4 py-3 text-gray-300">{p.parsedData.warranty}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {comparison && (
                            <div className="mt-6 p-4 bg-red-900 bg-opacity-30 rounded-xl border border-red-800">
                                <h3 className="font-bold text-red-300 flex items-center mb-2">
                                    <SparklesIcon className="w-5 h-5 mr-2" /> AI Recommendation
                                </h3>
                                <p className="text-red-200 mb-4">{comparison.recommendation}</p>
                                <div className="text-sm text-red-300 font-mono bg-red-900 bg-opacity-50 p-2 rounded">
                                    {comparison.summary}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right Column: Vendors & Proposals Status */}
            <div className="space-y-6">
                {/* Actions */}
                <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800">
                    <button
                        onClick={handleScan}
                        disabled={scanning}
                        className="w-full mb-4 flex justify-center items-center py-2 px-4 border border-gray-700 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
                    >
                        <RefreshCw size={18} className={`mr-2 ${scanning ? 'animate-spin' : ''}`} />
                        {scanning ? 'Scanning Inbox...' : 'Check for Replies'}
                    </button>

                    <div className="text-xs text-center text-gray-500">
                        Last received: {proposals.length > 0 ? new Date(proposals[proposals.length - 1].receivedAt).toLocaleTimeString() : 'Never'}
                    </div>
                </div>

                {/* Vendors List */}
                <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800">
                    <h3 className="font-bold mb-4 text-white">Select Vendors</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                        {vendors.map(v => (
                            <label key={v._id} className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="rounded text-red-600 focus:ring-red-500 bg-gray-800 border-gray-600"
                                    checked={selectedVendors.includes(v._id)}
                                    onChange={(e) => {
                                        if (e.target.checked) setSelectedVendors([...selectedVendors, v._id]);
                                        else setSelectedVendors(selectedVendors.filter(id => id !== v._id));
                                    }}
                                />
                                <span className="text-sm text-white">{v.name}</span>
                                <span className="text-xs text-gray-400 ml-auto">{v.email}</span>
                            </label>
                        ))}
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={sending || selectedVendors.length === 0}
                        className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition flex justify-center items-center"
                    >
                        {sending ? 'Sending...' : <><Send size={16} className="mr-2" /> Send Request</>}
                    </button>

                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <h4 className="text-sm font-semibold mb-2 text-white">Add New Vendor</h4>
                        <div className="space-y-2">
                            <input
                                type="text" placeholder="Name"
                                className="w-full text-sm p-2 border border-gray-700 bg-gray-800 text-white rounded placeholder-gray-500"
                                value={newVendor.name}
                                onChange={e => setNewVendor({ ...newVendor, name: e.target.value })}
                            />
                            <input
                                type="email" placeholder="Email"
                                className="w-full text-sm p-2 border border-gray-700 bg-gray-800 text-white rounded placeholder-gray-500"
                                value={newVendor.email}
                                onChange={e => setNewVendor({ ...newVendor, email: e.target.value })}
                            />
                            <button
                                onClick={handleAddVendor}
                                className="w-full py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600"
                            >
                                Add Vendor
                            </button>
                        </div>
                    </div>
                </div>

                {/* Proposals List Mini */}
                <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800">
                    <h3 className="font-bold mb-4 text-white">Received Proposals ({proposals.length})</h3>
                    <div className="space-y-3">
                        {proposals.map(p => (
                            <div key={p._id} className="p-3 bg-green-900 bg-opacity-30 rounded border border-green-800">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-sm text-white">{p.vendorId?.name}</span>
                                    <CheckCircle size={14} className="text-green-400" />
                                </div>
                                <div className="text-xs text-gray-300">
                                    {p.parsedData.pricing} • {p.parsedData.deliveryTime}
                                </div>
                            </div>
                        ))}
                        {proposals.length === 0 && <p className="text-sm text-gray-500 italic">No proposals yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SparklesIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM9 15a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 15z" clipRule="evenodd" />
        </svg>
    );
}
