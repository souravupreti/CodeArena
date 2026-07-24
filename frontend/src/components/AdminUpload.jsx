import { useParams, NavLink } from 'react-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../utils/axiosClient';
import { ArrowLeft, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

function AdminUpload(){
    const {problemId}  = useParams();
    
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedVideo, setUploadedVideo] = useState(null);
    
    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
      reset,
      setError,
      clearErrors
    } = useForm();
  
    const selectedFile = watch('videoFile')?.[0];
  
    // Upload video to Cloudinary
    const onSubmit = async (data) => {
      const file = data.videoFile[0];
      
      setUploading(true);
      setUploadProgress(0);
      clearErrors();
  
      try {
        // Step 1: Get upload signature from backend
        const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
        const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;  
  
        // Step 2: Create FormData for Cloudinary upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('signature', signature);
        formData.append('timestamp', timestamp);
        formData.append('public_id', public_id);
        formData.append('api_key', api_key);
  
        // Step 3: Upload directly to Cloudinary
        const uploadResponse = await axios.post(upload_url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          },
        });
  
        const cloudinaryResult = uploadResponse.data;
  
        // Step 4: Save video metadata to backend
        const metadataResponse = await axiosClient.post('/video/save', {
          problemId: problemId,
          cloudinaryPublicId: cloudinaryResult.public_id,
          secureUrl: cloudinaryResult.secure_url,
          duration: cloudinaryResult.duration,
        });  
  
        setUploadedVideo(metadataResponse.data.videoSolution);
        reset();
        
      } catch (err) {
        console.error('Upload error:', err);
        setError('root', {
          type: 'manual',
          message: err.response?.data?.message || 'Upload failed. Please check network/credentials.'
        });
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    };  
  
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
  
    const formatDuration = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };  

    return (
      <div className="min-h-screen bg-[#f8f9fa] text-gray-900 font-sans p-6 selection:bg-orange-100 selection:text-orange-600">
        <div className="max-w-xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
            <NavLink to="/admin/video" className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
              <ArrowLeft size={16} />
            </NavLink>
            <div>
              <h1 className="text-2xl font-bold font-mono text-gray-900">
                UPLOAD <span className="text-[#FFA116]">EDITORIAL VIDEO</span>
              </h1>
              <p className="text-xs text-gray-500 font-mono">Upload video file directly to Cloudinary pipeline</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs font-mono">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Select Video File (.mp4, .webm)</label>
                <input
                  type="file"
                  accept="video/*"
                  {...register('videoFile', {
                    required: 'Please select a video file',
                    validate: {
                      isVideo: (files) => {
                        if (!files || !files[0]) return 'Please select a video file';
                        const file = files[0];
                        return file.type.startsWith('video/') || 'Please select a valid video file';
                      },
                      fileSize: (files) => {
                        if (!files || !files[0]) return true;
                        const file = files[0];
                        const maxSize = 100 * 1024 * 1024;
                        return file.size <= maxSize || 'File size must be less than 100MB';
                      }
                    }
                  })}
                  className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-xs text-gray-900 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-black cursor-pointer"
                  disabled={uploading}
                />
                {errors.videoFile && (
                  <span className="text-rose-600 text-xs mt-1 block">{errors.videoFile.message}</span>
                )}
              </div>

              {/* Selected File Details */}
              {selectedFile && (
                <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 text-xs space-y-1">
                  <div className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Upload size={14} className="text-[#FFA116]" />
                    {selectedFile.name}
                  </div>
                  <div className="text-gray-500 text-[11px]">Size: {formatFileSize(selectedFile.size)}</div>
                </div>
              )}

              {/* Upload Progress Bar */}
              {uploading && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                    <span>Uploading Stream...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#FFA116] h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {errors.root && (
                <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{errors.root.message}</span>
                </div>
              )}

              {/* Success Alert */}
              {uploadedVideo && (
                <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    Upload Completed Successfully!
                  </div>
                  <div>Duration: {formatDuration(uploadedVideo.duration)}</div>
                </div>
              )}

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3 px-4 rounded-lg bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-2xs transition-all cursor-pointer disabled:opacity-50"
              >
                {uploading ? 'UPLOADING TO CLOUDINARY...' : 'START VIDEO UPLOAD'}
              </button>

            </form>
          </div>
        </div>
      </div>
    );
}

export default AdminUpload;