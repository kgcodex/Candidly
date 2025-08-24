import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
// Assuming 'puter-sdk' is the correct package name. 
// If this is a local file, you might need to adjust the path, e.g., './lib/puter.js'
import { usePuterStore } from "../lib/puter"; 

const WipeApp = () => {
    const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);

    const loadFiles = async () => {
        try {
            const files = await fs.readDir("./");
            setFiles(files);
        } catch (e) {
            console.error("Failed to load files:", e);
            // Handle the error appropriately in the UI
        }
    };

    useEffect(() => {
        if (auth.isAuthenticated) {
            loadFiles();
        }
    }, [auth.isAuthenticated]); // Depend on authentication status

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading, auth.isAuthenticated, navigate]);

    const handleDelete = async () => {
        try {
            // Use Promise.all to ensure all delete operations complete before flushing
            await Promise.all(files.map(file => fs.delete(file.path)));
            await kv.flush();
            loadFiles(); // Reload the file list after deletion
        } catch(e) {
            console.error("Failed to delete files:", e);
            // Handle the error appropriately in the UI
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        // It's good practice to offer a way to clear the error
        return (
            <div>
                <p>Error: {error.message || 'An unknown error occurred'}</p>
                <button onClick={clearError}>Try again</button>
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-100 min-h-screen font-sans">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
                <h1 className="text-2xl font-bold mb-4">App Data Manager</h1>
                {auth.isAuthenticated ? (
                    <>
                        <p className="mb-4">Authenticated as: <span className="font-semibold">{auth.user?.username}</span></p>
                        
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-2">Existing Files:</h2>
                            <div className="flex flex-col gap-2 p-2 border rounded-md max-h-60 overflow-y-auto">
                                {files.length > 0 ? files.map((file) => (
                                    <div key={file.id} className="flex flex-row gap-4 p-2 bg-gray-50 rounded">
                                        <p>{file.name}</p>
                                    </div>
                                )) : <p className="text-gray-500">No files found.</p>}
                            </div>
                        </div>
                        
                        <div>
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md cursor-pointer transition-colors duration-300 disabled:bg-red-300"
                                onClick={handleDelete}
                                disabled={files.length === 0}
                            >
                                Wipe All App Data
                            </button>
                        </div>
                    </>
                ) : (
                    <p>Please log in to manage your app data.</p>
                )}
            </div>
        </div>
    );
};

export default WipeApp;