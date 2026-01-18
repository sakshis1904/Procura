import { Link } from 'react-router-dom';
import { Bot, Plus, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="bg-gray-900 border-b border-red-900">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <Bot className="h-8 w-8 text-red-500" />
                        <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                            Procura AI
                        </span>
                    </Link>

                    <div className="flex space-x-4">
                        <Link to="/" className="flex items-center space-x-1 text-gray-300 hover:text-red-400 px-3 py-2 rounded-md hover:bg-gray-800">
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </Link>
                        <Link to="/create" className="flex items-center space-x-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                            <Plus size={18} />
                            <span>New RFP</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
