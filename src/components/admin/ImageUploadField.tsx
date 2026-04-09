import { useRef, useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useImageUpload } from '@/hooks/useImageUpload';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  bucket: 'products' | 'banners' | 'avatars' | 'site-assets';
  hint?: string;
  previewHeight?: string;
  previewAspect?: 'square' | 'landscape' | 'portrait';
}

export const ImageUploadField = ({
  label,
  value,
  onChange,
  bucket,
  hint,
  previewHeight = 'h-40',
  previewAspect = 'landscape',
}: ImageUploadFieldProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  // Cast bucket to match hook's expected type
  const { upload, isUploading } = useImageUpload(bucket as 'products' | 'banners' | 'avatars');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await upload(file);
    if (url) onChange(url);
    // Reset input so user can re-upload same file
    e.target.value = '';
  };

  const aspectClass = previewAspect === 'square' ? 'aspect-square' : previewAspect === 'portrait' ? 'aspect-[3/4]' : '';

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}

      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt={label}
            className={`w-full ${aspectClass || previewHeight} object-cover rounded-lg border`}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Change
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onChange('')}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`w-full ${aspectClass || previewHeight} border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer`}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to upload</span>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => setShowUrlInput(!showUrlInput)}
        >
          <ImageIcon className="h-3 w-3 mr-1" />
          {showUrlInput ? 'Hide URL input' : 'Or paste URL'}
        </Button>
      </div>

      {showUrlInput && (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="text-sm"
        />
      )}
    </div>
  );
};
