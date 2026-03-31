
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';
import type { VideoUploadData } from '../../pages/UploadVideo';

interface SafetyComplianceStepProps {
  data: VideoUploadData;
  updateData: (updates: Partial<VideoUploadData>) => void;
}

export function SafetyComplianceStep({ data, updateData }: SafetyComplianceStepProps) {
  const checkboxes = [
    {
      section: 'Harmful or Dangerous Content',
      items: [
        { key: 'promotesHarmfulActivities', label: 'Promotes harmful or dangerous activities' },
        { key: 'drugUse', label: 'Contains drug use or drug-related content' },
        { key: 'selfHarmContent', label: 'Contains self-harm content or references' },
        { key: 'childEndangerment', label: 'Contains content that endangers children' },
      ]
    },
    {
      section: 'Violence & Sensitive Content',
      items: [
        { key: 'containsViolence', label: 'Contains violence or physical altercations' },
        { key: 'containsBlood', label: 'Contains blood or graphic imagery' },
        { key: 'containsWeapons', label: 'Contains weapons or firearms' },
        { key: 'dangerousActs', label: 'Contains dangerous acts or stunts' },
      ]
    },
    {
      section: 'Sensitive Issues',
      items: [
        { key: 'mentalHealthTopics', label: 'Discusses mental health topics' },
        { key: 'selfHarmReferences', label: 'Contains references to self-harm' },
        { key: 'politicalContent', label: 'Contains political content or commentary' },
        { key: 'religiousContent', label: 'Contains religious content or discussions' },
      ]
    },
    {
      section: 'Sexual Content',
      items: [
        { key: 'containsFemaleContent', label: 'Contains female content like dancing or modeling performances pictures' },
        { key: 'containsNudity', label: 'Contains nudity or partial nudity' },
        { key: 'suggestiveContent', label: 'Contains suggestive or sexual content' },
      ]
    },
    {
      section: 'Privacy & People',
      items: [
        { key: 'containsRealPeople', label: 'Contains identifiable individuals' },
        { key: 'facesVisible', label: 'Faces are clearly visible' },
        { key: 'hasConsent', label: 'I have consent from all individuals shown' },
      ]
    },
  ];

  const handleCheckboxChange = (key: string, checked: boolean) => {
    updateData({ [key]: checked } as Partial<VideoUploadData>);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Shield className="size-4" />
        <AlertDescription>
          Help us understand your content by answering these questions honestly. 
          This information is used to protect viewers and ensure compliance with platform policies.
        </AlertDescription>
      </Alert>

      {checkboxes.map((section) => (
        <div key={section.section} className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">{section.section}</h3>
          <div className="space-y-3 pl-2">
            {section.items.map((item) => (
              <div key={item.key} className="flex items-start space-x-3">
                <Checkbox
                  id={item.key}
                  checked={data[item.key as keyof VideoUploadData] as boolean}
                  onCheckedChange={(checked) => handleCheckboxChange(item.key, checked as boolean)}
                />
                <Label
                  htmlFor={item.key}
                  className="cursor-pointer leading-relaxed font-normal"
                >
                  {item.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Copyright Ownership */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold text-sm text-muted-foreground">Copyright & Ownership</h3>
        
        <div className="flex items-start space-x-3 p-4 border rounded-lg bg-muted/30">
          <Checkbox
            id="copyrightOwnership"
            checked={data.copyrightOwnership}
            onCheckedChange={(checked) => updateData({ copyrightOwnership: checked as boolean })}
            className="mt-1"
          />
          <Label
            htmlFor="copyrightOwnership"
            className="cursor-pointer leading-relaxed font-normal"
          >
            <span className="font-medium">I confirm that I own all rights to this content</span>
            <p className="text-sm text-muted-foreground mt-1">
              This includes all video footage, audio, music, images, and any other copyrighted 
              material used in this video. I have obtained all necessary licenses and permissions.
            </p>
          </Label>
        </div>

        {!data.copyrightOwnership && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertDescription>
              You must confirm copyright ownership before publishing
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Warnings */}
      {data.containsRealPeople && !data.hasConsent && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertDescription>
            If your video contains identifiable individuals, you must have their consent
          </AlertDescription>
        </Alert>
      )}

      <Alert className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
        <AlertTriangle className="size-4 text-yellow-600 dark:text-yellow-400" />
        <AlertDescription className="text-yellow-900 dark:text-yellow-100">
          <strong>Note:</strong> False declarations may result in content removal and 
          potential account suspension. Be truthful and accurate.
        </AlertDescription>
      </Alert>
    </div>
  );
}
