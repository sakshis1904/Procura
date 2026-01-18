import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FileText, ArrowRight, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function Dashboard() {
    const [rfps, setRfps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRFPs();
    }, []);

    const fetchRFPs = async () => {
        try {
            const res = await axios.get('/api/rfps');
            setRfps(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Sent': return 'bg-red-900 text-red-300';
            case 'Closed': return 'bg-green-900 text-green-300';
            default: return 'bg-gray-800 text-gray-300';
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-white">Recent RFPs</h1>

            {loading ? (
                <div className="text-center py-10 text-gray-300">Loading...</div>
            ) : rfps.length === 0 ? (
                <div className="text-center py-20 bg-gray-900 rounded-xl shadow-sm border border-gray-800">
                    <p className="text-gray-400 mb-4">No RFPs found</p>
                    <Link to="/create" className="text-red-400 font-medium hover:underline">Create your first RFP</Link>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {rfps.map(rfp => (
                        <Link key={rfp._id} to={`/rfp/${rfp._id}`} className="block group">
                            <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800 group-hover:shadow-md group-hover:border-red-800 transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(rfp.status)}`}>
                                        {rfp.status}
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {new Date(rfp.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="font-semibold text-lg mb-2 text-white group-hover:text-red-400 transition">
                                    {rfp.title || `RFP #${rfp._id.slice(-6)}`}
                                </h3>

                                <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                                    {rfp.originalQuery}
                                </p>

                                <div className="flex items-center text-red-400 text-sm font-medium">
                                    View Details <ArrowRight size={16} className="ml-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
