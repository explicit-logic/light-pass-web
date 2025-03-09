import React, { useState, useRef } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { loadQuizFromZip } from '@/utils/loadQuizFromZip';
import { useLanguage } from '@/hooks/useLanguage';

interface UploadPageProps {
  onUploadSuccess: () => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({ onUploadSuccess }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsLoading(true);
      await loadQuizFromZip(selectedFile);
      navigate({ to: '/start' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quiz from ZIP file');
    } finally {
      setIsLoading(false);
    }
    
    // If no error occurred, proceed to the next page
    if (!error) {
      onUploadSuccess();
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 dark:text-white text-center">
          {t('uploadTitle') || 'Upload Quiz'}
        </h1>
        
        <p className="mb-8 text-lg font-normal text-gray-500 dark:text-gray-400 text-center">
          {t('uploadDescription') || 'Upload a ZIP file containing quiz configuration'}
        </p>

        <div 
          className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center cursor-pointer transition-colors
            ${isDragging 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 hover:border-blue-400 dark:border-gray-600 dark:hover:border-blue-500'
            }
            ${selectedFile ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept=".zip"
            onChange={handleFileChange}
          />
          
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          
          {selectedFile ? (
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {t('dropFilesHere') || 'Drop your ZIP file here or click to browse'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('supportedFormats') || 'Supported format: ZIP'}
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-900/20 dark:text-red-400" role="alert">
            <AlertCircle className="flex-shrink-0 inline w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          className={`w-full text-white font-medium rounded-lg text-lg px-5 py-4 text-center transition-all duration-200
            ${!selectedFile || isLoading
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
              : 'bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            }`}
        >
          {isLoading 
            ? (t('uploading') || 'Uploading...') 
            : (t('uploadQuiz') || 'Upload Quiz')}
        </button>
      </div>
    </div>
  );
}; 
