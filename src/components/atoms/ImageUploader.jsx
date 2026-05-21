import React, { useRef, useState, useCallback } from 'react';
import api from '../../services/api';

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXT   = '.jpg, .jpeg, .png, .webp';

const ImageUploader = ({
  value       = null,
  onChange,
  context     = 'project',
  label       = 'Imagen',
  description = 'Arrastra una imagen o haz clic para seleccionar',
  aspectRatio = '16/9',
  disabled    = false,
}) => {
  const fileInputRef         = useRef(null);
  const [isUploading,    setIsUploading]    = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [localPreview,   setLocalPreview]   = useState(null);
  const [error,          setError]          = useState(null);
  const [isDragging,     setIsDragging]     = useState(false);

  // ── Validación local antes de subir ──────────────────────────────────────
  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Tipo no permitido. Usa: ${ALLOWED_EXT}`;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `El archivo supera ${MAX_SIZE_MB}MB`;
    }
    return null;
  };

  // ── Lógica de upload ──────────────────────────────────────────────────────
  const handleFile = useCallback(async (file) => {
    if (!file || disabled) return;

    setError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Preview local inmediato (blob URL)
    const blobUrl = URL.createObjectURL(file);
    setLocalPreview(blobUrl);

    // Subir al backend
    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await api.post(
        `/images/upload?context=${context}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            const pct = Math.round((e.loaded * 100) / e.total);
            setUploadProgress(pct);
          },
        }
      );

      const cdnUrl = response.data.imageUrl;
      onChange?.(cdnUrl);

      URL.revokeObjectURL(blobUrl);
      setLocalPreview(null);

    } catch (err) {
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error   ||
        err.message                 ||
        'Error al subir la imagen. Intenta de nuevo.';

      setError(backendMessage);
      setLocalPreview(null);
      URL.revokeObjectURL(blobUrl);
      onChange?.(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [context, onChange, disabled]);

  // ── Handlers de interacción ───────────────────────────────────────────────
  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile, disabled]);

  const handleDragOver  = (e) => { e.preventDefault(); if (!disabled) setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange?.(null);
    setLocalPreview(null);
    setError(null);
  };

  const displayImage = value || localPreview;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}

      <div
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative rounded-xl border-2 border-dashed transition-all overflow-hidden
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isDragging
            ? 'border-blue-500 bg-blue-50 scale-[1.01]'
            : displayImage
              ? 'border-gray-200 bg-gray-50 hover:border-blue-300'
              : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/30'
          }
        `}
        style={{ aspectRatio }}
      >
        {/* Estado: imagen cargada */}
        {displayImage && !isUploading && (
          <>
            <img
              src={displayImage}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {/* Overlay con acciones */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all flex items-center justify-center gap-3 opacity-0 hover:opacity-100">
              <button
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="bg-white text-gray-900 text-xs font-bold px-3 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
              >
                Cambiar imagen
              </button>
              <button
                onClick={handleRemove}
                className="bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </>
        )}

        {/* Estado: subiendo */}
        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
            <p className="text-sm font-semibold text-gray-700">Subiendo imagen…</p>
            <div className="w-48 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">{uploadProgress}%</p>
          </div>
        )}

        {/* Estado: vacío */}
        {!displayImage && !isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
              🖼️
            </div>
            <p className="text-sm font-semibold text-gray-600">{description}</p>
            <p className="text-xs text-gray-400">{ALLOWED_EXT} · Máx {MAX_SIZE_MB}MB</p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled || isUploading}
      />
    </div>
  );
};

export default ImageUploader;