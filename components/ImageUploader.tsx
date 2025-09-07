import React, { useState, useMemo } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
  onBack: () => void;
  isAnalyzing: boolean;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-4-4V6a2 2 0 012-2h10a2 2 0 012 2v6a4 4 0 01-4 4H7z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2m12-4l-4-4-4 4m4-4v12" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, onBack, isAnalyzing }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        if (event.target.files) {
            const files = Array.from(event.target.files);
            if (files.length > 12) {
                setError("You can upload a maximum of 12 images.");
                return;
            }
            setSelectedFiles(files);
        }
    };

    const imagePreviews = useMemo(() => {
        return selectedFiles.map(file => ({
            id: file.name + file.lastModified,
            url: URL.createObjectURL(file)
        }));
    }, [selectedFiles]);
    
    // Cleanup object URLs on unmount
    React.useEffect(() => {
        return () => {
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
        };
    }, [imagePreviews]);

    const handleSubmit = () => {
        if (selectedFiles.length > 0) {
            onUpload(selectedFiles);
        }
    };

    return (
        <div className="flex flex-col items-center p-4 sm:p-8">
            <div className="w-full max-w-4xl">
                <button onClick={onBack} className="text-sm text-indigo-600 hover:underline mb-4">&larr; Back</button>
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-slate-800">Upload Your Images</h1>
                    <p className="text-slate-600 mt-2 text-lg">Select 2 to 12 images to start your story. We'll analyze them to create a narrative.</p>
                </div>
                
                <Card className="p-8">
                    <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadIcon />
                            <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-slate-500">PNG, JPG, or GIF (max 12 images)</p>
                        </div>
                        <input id="image-upload" type="file" className="hidden" multiple accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} />
                    </label>

                    {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
                </Card>

                {imagePreviews.length > 0 && (
                     <div className="mt-8">
                        <h2 className="text-2xl font-semibold text-slate-700 mb-4">Your Selected Images ({imagePreviews.length})</h2>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                            {imagePreviews.map((preview) => (
                                <img key={preview.id} src={preview.url} alt="Preview" className="w-full h-full object-cover rounded-lg shadow-md aspect-square" />
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="mt-8 flex justify-end">
                    <Button 
                        onClick={handleSubmit} 
                        disabled={selectedFiles.length < 2 || selectedFiles.length > 12 || isAnalyzing}
                        isLoading={isAnalyzing}
                    >
                        {isAnalyzing ? "Creating Story..." : "Create Story from Images"}
                    </Button>
                </div>
            </div>
        </div>
    );
};