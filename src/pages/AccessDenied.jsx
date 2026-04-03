import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaArrowLeft, FaHome } from 'react-icons/fa';

const AccessDenied = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center transform transition-all hover:scale-105 duration-300">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <FaLock size={40} className="text-red-500" />
                </div>
                
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    Access Denied
                </h1>
                
                <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                    Oops! It looks like you don't have the permissions required to view this page.
                </p>

                <div className="space-y-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-200 active:transform active:scale-95"
                    >
                        <FaArrowLeft /> Go Back
                    </button>
                    
                    <Link 
                        to="/"
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200"
                    >
                        <FaHome /> Return Home
                    </Link>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-100">
                    <p className="text-sm text-gray-400">
                        If you believe this is an error, please contact your administrator.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AccessDenied;
