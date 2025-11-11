'use client';

import { useState, useCallback } from 'react';
import { Upload, X, File, Image, FileText, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface FileUploadProps {
  onUpload?: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

interface UploadFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  id: string;
}

export function FileUpload({ 
  onUpload, 
  maxFiles = 10, 
  maxSize = 100,
  acceptedTypes = ['*/*']
}: FileUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.includes('text') || file.type.includes('document')) return FileText;
    if (file.type.includes('database') || file.name.endsWith('.sql')) return Database;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const simulateUpload = (file: File): Promise<void> => {
    return new Promise((resolve) => {
      const uploadId = Math.random().toString(36).substr(2, 9);
      const uploadFile: UploadFile = {
        file,
        progress: 0,
        status: 'uploading',
        id: uploadId
      };

      setUploadFiles(prev => [...prev, uploadFile]);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadFiles(prev => prev.map(f => {
          if (f.id === uploadId) {
            const newProgress = Math.min(f.progress + Math.random() * 30, 100);
            const isCompleted = newProgress >= 100;
            
            return {
              ...f,
              progress: newProgress,
              status: isCompleted ? 'completed' : 'uploading'
            };
          }
          return f;
        }));
      }, 200);

      // Complete upload after 2-4 seconds
      setTimeout(() => {
        clearInterval(interval);
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadId ? { ...f, progress: 100, status: 'completed' } : f
        ));
        resolve();
      }, Math.random() * 2000 + 2000);
    });
  };

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Validate file count
    if (uploadFiles.length + fileArray.length > maxFiles) {
      toast.error(`Máximo de ${maxFiles} arquivos permitidos`);
      return;
    }

    // Validate file sizes
    const oversizedFiles = fileArray.filter(file => file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error(`Arquivos muito grandes. Máximo: ${maxSize}MB`);
      return;
    }

    // Start uploads
    for (const file of fileArray) {
      try {
        await simulateUpload(file);
        toast.success(`${file.name} enviado com sucesso!`);
      } catch (error) {
        toast.error(`Erro ao enviar ${file.name}`);
      }
    }

    onUpload?.(fileArray);
  }, [uploadFiles.length, maxFiles, maxSize, onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearCompleted = () => {
    setUploadFiles(prev => prev.filter(f => f.status !== 'completed'));
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : 'border-muted-foreground/25'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Upload className={`h-12 w-12 mb-4 ${isDragOver ? 'text-blue-500' : 'text-muted-foreground'}`} />
          <h3 className="text-lg font-medium mb-2">
            Arraste arquivos aqui ou clique para selecionar
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Máximo {maxFiles} arquivos, até {maxSize}MB cada
          </p>
          <input
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            accept={acceptedTypes.join(',')}
          />
          <Button asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              Selecionar Arquivos
            </label>
          </Button>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Uploads</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearCompleted}
                disabled={!uploadFiles.some(f => f.status === 'completed')}
              >
                Limpar Concluídos
              </Button>
            </div>
            
            <div className="space-y-3">
              {uploadFiles.map((uploadFile) => {
                const IconComponent = getFileIcon(uploadFile.file);
                return (
                  <div key={uploadFile.id} className="flex items-center gap-3">
                    <IconComponent className="h-4 w-4 text-blue-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate">
                          {uploadFile.file.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              uploadFile.status === 'completed' ? 'default' :
                              uploadFile.status === 'error' ? 'destructive' : 'secondary'
                            }
                            className="text-xs"
                          >
                            {uploadFile.status === 'completed' ? 'Concluído' :
                             uploadFile.status === 'error' ? 'Erro' : 'Enviando'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(uploadFile.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={uploadFile.progress} className="flex-1" />
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(uploadFile.file.size)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
