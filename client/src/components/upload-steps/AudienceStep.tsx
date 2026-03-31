
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Alert, AlertDescription } from '../ui/alert';
import { Info } from 'lucide-react';
import type  {VideoUploadData} from '../../pages/UploadVideo';;

interface AudienceStepProps {
  data: VideoUploadData;
  updateData: (updates: Partial<VideoUploadData>) => void;
}

export function AudienceStep({ data, updateData }: AudienceStepProps) {
  return (
    <div className="space-y-6">
      {/* Made for Kids */}
      <div className="space-y-4">
        <div>
          <Label className="text-base">
            Is this video made for kids? <span className="text-destructive">*</span>
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Regardless of your location, you're legally required to comply with the Children's 
            Online Privacy Protection Act (COPPA) and/or other laws.
          </p>
        </div>

        <Alert>
          <Info className="size-4" />
          <AlertDescription>
            Videos marked as "made for kids" have limited features to protect children's privacy. 
            This includes no personalized ads, comments, and some features will be disabled.
          </AlertDescription>
        </Alert>

        <div className="space-y-3 pl-2">
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => updateData({ madeForKids: true })}
          >
            <div>
              <p className="font-medium">Yes, it's made for kids</p>
              <p className="text-sm text-muted-foreground">
                This video is designed for children
              </p>
            </div>
            <input
              title='radio'
              type="radio"
              checked={data.madeForKids === true}
              onChange={() => updateData({ madeForKids: true })}
              className="size-4"
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => updateData({ madeForKids: false })}
          >
            <div>
              <p className="font-medium">No, it's not made for kids</p>
              <p className="text-sm text-muted-foreground">
                This video is intended for general or adult audiences
              </p>
            </div>
            <input
              title='radio'
              type="radio"
              checked={data.madeForKids === false}
              onChange={() => updateData({ madeForKids: false })}
              className="size-4"
            />
          </div>
        </div>
      </div>

      {/* Age Restriction */}
      <div className="space-y-4 pt-4 border-t">
        <div>
          <Label className="text-base">Age Restriction</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Do you want to restrict your video to viewers over 18?
          </p>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">Restrict to 18+ viewers</p>
            <p className="text-sm text-muted-foreground">
              Video won't be shown to users under 18
            </p>
          </div>
          <Switch
            checked={data.ageRestricted}
            onCheckedChange={(checked) => updateData({ ageRestricted: checked })}
            disabled={data.madeForKids === true}
          />
        </div>

        {data.madeForKids === true && (
          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              Content made for kids cannot be age-restricted
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Information Box */}
      <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <Info className="size-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-900 dark:text-blue-100">
          <strong>Important:</strong> These settings affect how your content is displayed and 
          what features are available. Incorrectly classifying your content may result in 
          removal or other actions on your account.
        </AlertDescription>
      </Alert>
    </div>
  );
}
