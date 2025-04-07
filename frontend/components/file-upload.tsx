"use client";

import { useState } from 'react';
import { toast } from 'sonner';
import { FileUp, Loader2, X, FileText, AlertCircle, File } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  vectorStoreId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface FileStatus {
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  file: File; // Store the actual File object
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function FileUpload({ vectorStoreId, onSuccess, onError }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<FileStatus[]>([]);
  
  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newFiles: FileStatus[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'pending',
        file: file // Store the actual File object
      });
    }
    
    setSelectedFiles([...selectedFiles, ...newFiles]); // Append to existing files
    e.target.value = ''; // Clear the input for future selections
  };
  
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Create a copy of the files for updating status
    const updatedFiles = [...selectedFiles];
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < selectedFiles.length; i++) {
      // Skip files that are not pending
      if (selectedFiles[i].status !== 'pending') continue;
      
      // Get the file object directly from our state
      const fileObj = selectedFiles[i].file;
      
      // Update status to uploading
      updatedFiles[i].status = 'uploading';
      setSelectedFiles([...updatedFiles]);
      
      const formData = new FormData();
      formData.append('file', fileObj);
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/vector-stores/${vectorStoreId}/files/`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: response.statusText }));
          throw new Error(errorData.detail || `Upload failed: ${response.statusText}`);
        }
        
        // Update status to success
        updatedFiles[i].status = 'success';
        successCount++;
        
      } catch (err: any) {
        console.error(`Error uploading file ${selectedFiles[i].name}:`, err);
        updatedFiles[i].status = 'error';
        updatedFiles[i].error = err.message;
        errorCount++;
      }
      
      // Update UI
      setSelectedFiles([...updatedFiles]);
      
      // Count how many files have been processed (not skipped)
      const processedCount = updatedFiles.filter(f => 
        f.status === 'success' || f.status === 'error'
      ).length;
      
      // Update progress based on processed files
      setUploadProgress(Math.round(processedCount / updatedFiles.length * 100));
    }
    
    // Show appropriate toast based on results
    if (successCount > 0) {
      toast.success("Files uploaded successfully!", {
        description: `${successCount} file(s) uploaded to vector store.`,
      });
      
      // Call success callback if provided
      if (onSuccess) onSuccess();
    }
    
    if (errorCount > 0) {
      const errorMessage = `Failed to upload ${errorCount} file(s)`;
      toast.error("Upload incomplete", { description: errorMessage });
      
      // Call error callback if provided
      if (onError) onError(errorMessage);
    }
    
    setIsUploading(false);
  };
  
  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };
  
  const clearSuccessfulFiles = () => {
    // Keep only files that are not success
    setSelectedFiles(selectedFiles.filter(file => file.status !== 'success'));
  };
  
  const triggerFileInput = () => {
    document.getElementById(`file-upload-${vectorStoreId}`)?.click();
  };
  
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="h-4 w-4 text-red-400" />;
    if (fileType.includes('image')) return <File className="h-4 w-4 text-blue-400" />;
    if (fileType.includes('text')) return <FileText className="h-4 w-4 text-gray-400" />;
    return <File className="h-4 w-4 text-gray-400" />;
  };
  
  // Count pending files
  const pendingFiles = selectedFiles.filter(file => file.status === 'pending').length;
  
  return (
    <div>
      <input
        id={`file-upload-${vectorStoreId}`}
        type="file"
        multiple
        onChange={handleFileSelection}
        className="hidden"
        disabled={isUploading}
      />
      
      <div 
        className="border-2 border-dashed border-[#374151] rounded-lg p-8 text-center hover:border-[#3b82f6] transition-colors cursor-pointer"
        onClick={triggerFileInput}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <FileUp className="h-10 w-10 text-gray-500" />
          <h3 className="mt-2 text-base font-semibold text-white">Drop files or click to upload</h3>
          <p className="text-xs text-gray-400">
            Drag and drop files here or click to browse your device
          </p>
        </div>
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-white">Selected Files ({selectedFiles.length})</h4>
            {selectedFiles.some(f => f.status === 'success') && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs hover:bg-[#374151] text-gray-400"
                onClick={clearSuccessfulFiles}
              >
                Clear Uploaded Files
              </Button>
            )}
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-[#1e293b] p-2 rounded-md">
                <div className="flex items-center gap-2">
                  {getFileIcon(file.type)}
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {file.status === 'uploading' && (
                    <div className="h-4 w-4 rounded-full border-2 border-[#3b82f6] border-t-transparent animate-spin"></div>
                  )}
                  {file.status === 'success' && (
                    <div className="h-4 w-4 rounded-full bg-green-500"></div>
                  )}
                  {file.status === 'error' && (
                    <div title={file.error}>
                      <AlertCircle className="h-4 w-4 text-red-400" />
                    </div>
                  )}
                  {file.status === 'pending' && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 hover:bg-[#374151] text-gray-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {isUploading && (
        <div className="mt-4">
          <div className="h-2 bg-[#0f172a] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#3b82f6] transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}
      
      <div className="mt-4 flex justify-center gap-2">
        <Button
          onClick={triggerFileInput}
          className="bg-[#374151] hover:bg-[#4b5563] text-white"
          disabled={isUploading}
        >
          <FileUp className="mr-2 h-4 w-4" />
          Select Files
        </Button>
        
        {pendingFiles > 0 && (
          <Button
            onClick={handleUpload}
            disabled={isUploading || pendingFiles === 0}
            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Upload {pendingFiles} File{pendingFiles !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
} 