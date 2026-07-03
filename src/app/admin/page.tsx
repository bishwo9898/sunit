"use client";

import { useState, useCallback, useRef } from "react";
import { 
  FiUploadCloud, 
  FiDownload, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiFile, 
  FiX, 
  FiPlay, 
  FiTrash2,
  FiSettings,
  FiPackage
} from "react-icons/fi";

type OptimizationTask = {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'success' | 'error';
  error?: string;
  originalSize: number;
  optimizedSize?: number;
  reduction?: string;
  resultUrl?: string;
  resultName?: string;
};

// Vercel Serverless has a strict 4.5MB upload limit. 
// For giant 10-20MB originals, we do a lightning-fast pre-compression in the browser
// using HTML canvas to get it just under 4MB before sending to Sharp for rigorous optimization.
const preCompressFile = async (file: File, maxSizeMB = 4.2): Promise<File> => {
  if (file.size <= maxSizeMB * 1024 * 1024) return file;
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        // Scale down if enormous, but keep it high-res
        const maxDim = 3200;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // binary search for right quality could be done, but a simple stepped reduction works fast
        const attemptCompress = (quality: number) => {
          canvas.toBlob((blob) => {
            if (!blob) return resolve(file); // fail safe
            if (blob.size <= maxSizeMB * 1024 * 1024 || quality <= 0.6) {
               resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            } else {
               attemptCompress(quality - 0.1);
            }
          }, 'image/jpeg', quality);
        };
        attemptCompress(0.95);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export default function ImageOptimizerPage() {
  const [tasks, setTasks] = useState<OptimizationTask[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(2560);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      const newTasks: OptimizationTask[] = selectedFiles.map(file => ({
        id: Math.random().toString(36).substring(7),
        file,
        status: 'pending',
        originalSize: file.size
      }));
      setTasks(prev => [...prev, ...newTasks]);
    }
    // Reset input so same files can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeTask = (id: string) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === id);
      if (task?.resultUrl) URL.revokeObjectURL(task.resultUrl);
      return prev.filter(t => t.id !== id);
    });
  };

  const clearAll = () => {
    tasks.forEach(t => {
      if (t.resultUrl) URL.revokeObjectURL(t.resultUrl);
    });
    setTasks([]);
  };

  const runOptimizationFlow = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    // Process tasks one by one to avoid overwhelming server/network
    const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'error');
    
    for (const task of pendingTasks) {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'processing', error: undefined } : t));

      try {
        // Guarantee file is under Vercel's 4.5MB body limit
        const safeFile = await preCompressFile(task.file);
        
        const formData = new FormData();
        formData.append("image", safeFile);

        const response = await fetch("/api/admin/optimize", {
          method: "POST",
          headers: {
            "X-Target-Quality": quality.toString(),
            "X-Max-Width": maxWidth.toString(),
          },
          body: formData,
        });

        if (!response.ok) {
          let errorMsg = "Optimization failed";
          if (response.status === 413) {
             errorMsg = "File is still too large for the server. Try uploading a smaller original.";
          } else {
             try {
                const errData = await response.json();
                errorMsg = errData.error || errorMsg;
             } catch (err) {
                // Handle Vercel returning plain text for router timeouts/crashes
                const textErr = await response.text();
                errorMsg = textErr.substring(0, 100) || errorMsg;
             }
          }
          throw new Error(errorMsg);
        }

        const blob = await response.blob();
        const optimizedSize = parseInt(response.headers.get("X-Optimized-Size") || "0");
        const reduction = (((task.originalSize - optimizedSize) / task.originalSize) * 100).toFixed(1);
        const url = URL.createObjectURL(blob);
        const name = task.file.name.replace(/\.[^/.]+$/, "") + ".webp";

        setTasks(prev => prev.map(t => t.id === task.id ? { 
          ...t, 
          status: 'success', 
          optimizedSize, 
          reduction, 
          resultUrl: url, 
          resultName: name 
        } : t));
      } catch (err: any) {
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'error', error: err.message } : t));
      }
    }

    setIsProcessing(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const completedCount = tasks.filter(t => t.status === 'success').length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-12 md:py-20 font-sans">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-neutral-900">
              Bulk Optimizer
            </h1>
            <p className="mt-3 text-neutral-500 max-w-xl">
              Batch process high-resolution images into production-ready WebP files. 
              Drastically reduce load times while maintaining premium visual quality.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             {tasks.length > 0 && (
               <button 
                onClick={clearAll}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-500 hover:text-red-600 transition-colors"
               >
                 <FiTrash2 /> Clear All
               </button>
             )}
             <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 shadow-lg shadow-black/10"
            >
              <FiUploadCloud /> Add Images
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </header>

        {/* Global Progress Bar */}
        {tasks.length > 0 && (
          <div className="mb-8 bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-neutral-700">
                Overall Progress
              </span>
              <span className="text-sm font-mono text-neutral-500">
                {completedCount} / {tasks.length} optimized
              </span>
            </div>
            <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-neutral-900 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm sticky top-8">
              <div className="flex items-center gap-2 mb-6 font-semibold text-neutral-800">
                <FiSettings /> Optimization Settings
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Target Quality</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="10" max="100" 
                      value={quality} 
                      onChange={(e) => setQuality(parseInt(e.target.value))}
                      className="flex-1 accent-neutral-900"
                    />
                    <span className="text-sm font-mono w-8 text-right font-bold">{quality}</span>
                  </div>
                  <p className="mt-1 text-[10px] text-neutral-400 italic">80 is optimal for high-res photos.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Max Width (px)</label>
                  <input 
                    type="number" 
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-neutral-200 outline-none"
                  />
                </div>

                <div className="pt-4">
                   <button 
                    onClick={runOptimizationFlow}
                    disabled={isProcessing || tasks.filter(t => t.status === 'pending' || t.status === 'error').length === 0}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:opacity-50 disabled:grayscale shadow-xl shadow-black/10"
                   >
                     {isProcessing ? (
                       <><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Working...</>
                     ) : (
                       <><FiPlay /> Start Batch</>
                     )}
                   </button>
                </div>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="lg:col-span-2 space-y-3">
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-neutral-200 text-neutral-400">
                <FiFile className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm font-medium">No images selected for optimization.</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 text-neutral-900 text-sm font-bold hover:underline"
                >
                  Choose files
                </button>
              </div>
            ) : (
              tasks.map((task) => (
                <div 
                  key={task.id}
                  className={`group bg-white rounded-xl border p-4 transition-all hover:shadow-md ${
                    task.status === 'success' ? 'border-green-100' : 'border-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                        task.status === 'success' ? 'bg-green-50 text-green-600' : 
                        task.status === 'error' ? 'bg-red-50 text-red-600' : 
                        'bg-neutral-100 text-neutral-400'
                      }`}>
                        {task.status === 'processing' ? (
                          <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
                        ) : task.status === 'success' ? (
                          <FiCheckCircle className="w-5 h-5" />
                        ) : task.status === 'error' ? (
                          <FiAlertCircle className="w-5 h-5" />
                        ) : (
                          <FiFile className="w-5 h-5" />
                        )}
                      </div>
                      
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-neutral-900 truncate">
                          {task.file.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {formatSize(task.originalSize)}
                          </span>
                          {task.status === 'success' && (
                            <>
                              <span className="text-[10px] text-neutral-300">→</span>
                              <span className="text-[10px] text-green-600 font-bold font-mono">
                                {formatSize(task.optimizedSize || 0)}
                              </span>
                              <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-bold">
                                -{task.reduction}%
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                       {task.status === 'success' && (
                         <a 
                          href={task.resultUrl} 
                          download={task.resultName}
                          className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
                          title="Download Optimized"
                         >
                           <FiDownload className="w-4 h-4" />
                         </a>
                       )}
                       {!isProcessing && (
                         <button 
                          onClick={() => removeTask(task.id)}
                          className="p-2 text-neutral-300 hover:text-red-500 transition-colors"
                          title="Remove"
                         >
                           <FiX className="w-4 h-4" />
                         </button>
                       )}
                    </div>
                  </div>
                  {task.error && (
                    <p className="mt-2 text-[10px] text-red-500 font-medium pl-14">
                      {task.error}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
