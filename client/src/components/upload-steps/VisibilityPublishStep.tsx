
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Alert, AlertDescription } from '../ui/alert';
import { Globe, Lock, EyeOff, Calendar, Tv, Info } from 'lucide-react';
import type { VideoUploadData } from '../../pages/UploadVideo';

interface VisibilityPublishStepProps {
  data: VideoUploadData;
  updateData: (updates: Partial<VideoUploadData>) => void;
}

export function VisibilityPublishStep({ data, updateData }: VisibilityPublishStepProps) {
  const visibilityOptions = [
    {
      value: 'public' as const,
      icon: Globe,
      title: 'Public',
      description: 'Anyone can search for and view',
    },
    {
      value: 'unlisted' as const,
      icon: EyeOff,
      title: 'Unlisted',
      description: 'Anyone with the link can view',
    },
    {
      value: 'private' as const,
      icon: Lock,
      title: 'Private',
      description: 'Only you can view',
    },
  ];

  // Get minimum schedule date (current date/time)
  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="space-y-6">
      {/* Visibility Options */}
      <div className="space-y-4">
        <Label className="text-base">Visibility</Label>
        
        <div className="space-y-3">
          {visibilityOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = data.visibility === option.value;
            
            return (
              <div
                key={option.value}
                onClick={() => updateData({ visibility: option.value })}
                className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className={`size-10 rounded-full flex items-center justify-center ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <Icon className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{option.title}</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                <input
                  title='radio'
                  type="radio"
                  checked={isSelected}
                  onChange={() => updateData({ visibility: option.value })}
                  className="size-4 mt-1"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Schedule Upload */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Schedule Upload</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Set a date and time to publish automatically
            </p>
          </div>
          <Switch
            checked={!!data.scheduleDate}
            onCheckedChange={(checked) => {
              if (!checked) {
                updateData({ scheduleDate: '' });
              }
            }}
          />
        </div>

        {data.scheduleDate !== '' && (
          <div className="space-y-2">
            <Label htmlFor="scheduleDate">Publish Date & Time</Label>
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <Input
                id="scheduleDate"
                type="datetime-local"
                value={data.scheduleDate}
                min={getMinDateTime()}
                onChange={(e) => updateData({ scheduleDate: e.target.value })}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Video will be published on {new Date(data.scheduleDate || Date.now()).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Premiere Option */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-start gap-3">
          <Tv className="size-5 text-muted-foreground mt-1" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Set as Premiere</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Watch with your viewers in real-time when it publishes
                </p>
              </div>
              <Switch
                checked={data.isPremiere}
                onCheckedChange={(checked) => updateData({ isPremiere: checked })}
                disabled={data.visibility === 'private'}
              />
            </div>

            {data.isPremiere && (
              <Alert className="mt-3">
                <Info className="size-4" />
                <AlertDescription>
                  Premiere creates a live watch party when your video goes public. 
                  Viewers can chat and watch together.
                </AlertDescription>
              </Alert>
            )}

            {data.visibility === 'private' && (
              <p className="text-xs text-muted-foreground mt-2">
                Premiere is not available for private videos
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-4 pt-4 border-t">
        <Label className="text-base">Upload Summary</Label>
        
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Title:</span>
            <span className="font-medium">{data.title || 'Not set'}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Category:</span>
            <span className="font-medium">{data.category || 'Not set'}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Visibility:</span>
            <span className="font-medium capitalize">{data.visibility}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Made for Kids:</span>
            <span className="font-medium">
              {data.madeForKids === true ? 'Yes' : data.madeForKids === false ? 'No' : 'Not set'}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Age Restricted:</span>
            <span className="font-medium">{data.ageRestricted ? 'Yes (18+)' : 'No'}</span>
          </div>
          
          {data.scheduleDate && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Scheduled:</span>
              <span className="font-medium">{new Date(data.scheduleDate).toLocaleString()}</span>
            </div>
          )}
          
          {data.isPremiere && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Premiere:</span>
              <span className="font-medium text-primary">Enabled</span>
            </div>
          )}
        </div>
      </div>

      <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
        <Info className="size-4 text-green-600 dark:text-green-400" />
        <AlertDescription className="text-green-900 dark:text-green-100">
          <strong>Ready to publish!</strong> Your video will be processed and made available 
          according to your settings. Processing may take a few minutes.
        </AlertDescription>
      </Alert>
    </div>
  );
}
