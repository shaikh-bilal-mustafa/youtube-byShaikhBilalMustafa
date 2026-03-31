import React, { useRef, useState } from 'react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Upload, FileVideo, Image as ImageIcon, CheckCircle2, X } from 'lucide-react';
import type { VideoUploadData } from '../../pages/UploadVideo';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface MediaUploadStepProps {
  data: VideoUploadData;
  updateData: (updates: Partial<VideoUploadData>) => void;
}

export function MediaUploadStep({ data, updateData }: MediaUploadStepProps) {
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [videoDragActive, setVideoDragActive] = useState(false);
  const [thumbnailDragActive, setThumbnailDragActive] = useState(false);

  // Video Upload Handler
  const handleVideoChange = (file: File | null) => {
    if (!file) return;
    
    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid video file (MP4, WebM, OGG, MOV)');
      return;
    }
    
    // Validate file size (max 2GB for demo)
    const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
    if (file.size > maxSize) {
      alert('File size must be less than 2GB');
      return;
    }
    
    updateData({ videoFile: file });
    simulateUpload('video');
  };

  // Thumbnail Upload Handler
  const handleThumbnailChange = (file: File | null) => {
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPG, PNG, WebP)');
      return;
    }
    
    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      alert('Thumbnail size must be less than 2MB');
      return;
    }
    
    updateData({ thumbnailUrl: file });
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      updateData({ thumbnailPreview: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  // Simulate upload progress
  const simulateUpload = (type: 'video' | 'thumbnail') => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (type === 'video') {
        updateData({ videoProgress: progress });
      }
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  };

  // Drag and Drop Handlers
  const handleVideoDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setVideoDragActive(true);
    } else if (e.type === "dragleave") {
      setVideoDragActive(false);
    }
  };

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVideoDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleVideoChange(e.dataTransfer.files[0]);
    }
  };

  const handleThumbnailDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setThumbnailDragActive(true);
    } else if (e.type === "dragleave") {
      setThumbnailDragActive(false);
    }
  };

  const handleThumbnailDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setThumbnailDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleThumbnailChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Video Upload */}
      <div className="space-y-4">
        <Label>
          Video File <span className="text-destructive">*</span>
        </Label>
        
        {!data.videoFile ? (
          <div
            onDragEnter={handleVideoDrag}
            onDragLeave={handleVideoDrag}
            onDragOver={handleVideoDrag}
            onDrop={handleVideoDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              videoDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="size-16 rounded-full bg-muted flex items-center justify-center">
                <FileVideo className="size-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium mb-1">Drag and drop your video here</p>
                <p className="text-sm text-muted-foreground">or</p>
              </div>
              <Button
                type="button"
                onClick={() => videoInputRef.current?.click()}
              >
                <Upload className="size-4 mr-2" />
                Select File
              </Button>
              <input
                title='file'
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoChange(e.target.files?.[0] || null)}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">
                Supported formats: MP4, WebM, OGG, MOV (Max 2GB)
              </p>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded bg-muted flex items-center justify-center">
                  <FileVideo className="size-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{data.videoFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(data.videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => updateData({ videoFile: null, videoProgress: 0 })}
              >
                <X className="size-4" />
              </Button>
            </div>
            
            {data.videoProgress < 100 ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{data.videoProgress}%</span>
                </div>
                <Progress value={data.videoProgress} />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="size-4" />
                <span className="text-sm font-medium">Upload complete</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Thumbnail Upload */}
      <div className="space-y-4">
        <Label>
          Thumbnail <span className="text-destructive">*</span>
        </Label>
        
        {!data.thumbnailUrl ? (
          <div
            onDragEnter={handleThumbnailDrag}
            onDragLeave={handleThumbnailDrag}
            onDragOver={handleThumbnailDrag}
            onDrop={handleThumbnailDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              thumbnailDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="size-16 rounded-full bg-muted flex items-center justify-center">
                <ImageIcon className="size-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium mb-1">Upload a thumbnail image</p>
                <p className="text-sm text-muted-foreground">1280x720 recommended</p>
              </div>
              <Button
                type="button"
                onClick={() => thumbnailInputRef.current?.click()}
              >
                <Upload className="size-4 mr-2" />
                Select Image
              </Button>
              <input
                title="file"
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleThumbnailChange(e.target.files?.[0] || null)}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, WebP (Max 2MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              {data.thumbnailPreview && (
                <ImageWithFallback
                  src={data.thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                />
              )}
              <button
                title='button'
                type="button"
                onClick={() => updateData({ thumbnailUrl: null, thumbnailPreview: '' })}
                className="absolute top-2 right-2 size-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
              >
                <X className="size-4 text-white" />
              </button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{data.thumbnailUrl?.name}</span>
              <span className="text-green-600 flex items-center gap-1">
                <CheckCircle2 className="size-3" />
                Uploaded
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
