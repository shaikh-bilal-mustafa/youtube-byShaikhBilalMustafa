import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { uploadVideo } from '../api/video';
import { 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  Upload,
  FileVideo,
  Shield,
  Eye,
  Sparkles
} from 'lucide-react';
import { BasicInfoStep } from '../components/upload-steps/BasicInfoStep';
import { MediaUploadStep } from '../components/upload-steps/MediaUploadStep';
import { AudienceStep } from '../components/upload-steps/AudienceStep';
import { SafetyComplianceStep } from '../components/upload-steps/SafetyComplianceStep';
import { VisibilityPublishStep } from '../components/upload-steps/VisibilityPublishStep';


export interface VideoUploadData {
  // Basic Info
  title: string;
  description: string;
  tags: string[];
  category: string;
  language: string;
  recordingDate: string;
  location: string;
  duration: number;
  likecount: number;
  dislikecount: number;
  commentCount: number;
  
  // Media
  videoFile: File | null;
  thumbnailUrl: File | null;
  videoProgress: number;
  thumbnailPreview: string;
  
  // Audience
  madeForKids: boolean | null;
  ageRestricted: boolean;
  
  // Safety & Compliance
  containsViolence: boolean;
  containsBlood: boolean;
  containsWeapons: boolean;
  dangerousActs: boolean;
  mentalHealthTopics: boolean;
  selfHarmReferences: boolean;
  politicalContent: boolean;
  religiousContent: boolean;
  containsNudity: boolean;
  suggestiveContent: boolean;
  containsRealPeople: boolean;
  hasConsent: boolean;
  facesVisible: boolean;
  copyrightOwnership: boolean;
  
  // Visibility
  visibility: 'public' | 'private' | 'unlisted';
  scheduleDate: string;
  isPremiere: boolean;
}

const STEPS = [
  { id: 1, name: 'Basic Info', icon: FileVideo },
  { id: 2, name: 'Media Upload', icon: Upload },
  { id: 3, name: 'Audience', icon: Eye },
  { id: 4, name: 'Safety & Compliance', icon: Shield },
  { id: 5, name: 'Visibility & Publish', icon: Sparkles },
];

interface UploadVideoProps {
  onPublish: (data: VideoUploadData) => void;
  onCancel: () => void; 
}

 function UploadVideo({ onPublish, onCancel }: UploadVideoProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  
  const [formData, setFormData] = useState<VideoUploadData>({
    title: '',
    description: '',
    tags: [],
    category: '',
    language: 'en',
    recordingDate: '',
    location: '',
    duration: 0,
    likecount: 0,
    dislikecount: 0,
    commentCount: 0,
    videoFile: null,
    thumbnailUrl: null,
    videoProgress: 0,
    thumbnailPreview: '',
    madeForKids: null,
    ageRestricted: false,
    containsViolence: false,
    containsBlood: false,
    containsWeapons: false,
    dangerousActs: false,
    mentalHealthTopics: false,
    selfHarmReferences: false,
    politicalContent: false,
    religiousContent: false,
    containsNudity: false,
    suggestiveContent: false,
    containsRealPeople: false,
    hasConsent: false,
    facesVisible: false,
    copyrightOwnership: false,
    visibility: 'public',
    scheduleDate: '',
    isPremiere: false,
  });

  // Save draft to localStorage
  useEffect(() => {
    const draftKey = 'video_upload_draft';
    const savedDraft = localStorage.getItem(draftKey);
    
    if (savedDraft && !formData.title) {
      const parsed = JSON.parse(savedDraft);
      setFormData({ ...formData, ...parsed });
    }
  }, []);

  useEffect(() => {
    const draftKey = 'video_upload_draft';
    localStorage.setItem(draftKey, JSON.stringify(formData));
  }, [formData]);

  // Auto warning system
  useEffect(() => {
    const newWarnings: string[] = [];
    
    // Violence + Kids content warning
    if (formData.madeForKids === true && (
      formData.containsViolence || 
      formData.containsBlood || 
      formData.containsWeapons ||
      formData.dangerousActs
    )) {
      newWarnings.push('⚠️ Violent content cannot be marked as "Made for Kids"');
    }
    
    // Adult content + Kids warning
    if (formData.madeForKids === true && (
      formData.containsNudity || 
      formData.suggestiveContent
    )) {
      newWarnings.push('⚠️ Adult content cannot be marked as "Made for Kids"');
    }
    
    // Age restriction requirements
    if ((formData.containsNudity || formData.suggestiveContent) && !formData.ageRestricted) {
      newWarnings.push('⚠️ Adult content should be age-restricted');
    }
    
    // Consent warning
    if (formData.containsRealPeople && !formData.hasConsent) {
      newWarnings.push('⚠️ You must have consent from people shown in the video');
    }
    
    // Copyright warning
    if (!formData.copyrightOwnership && currentStep === 5) {
      newWarnings.push('⚠️ You must confirm copyright ownership before publishing');
    }
    
    setWarnings(newWarnings);
  }, [formData, currentStep]);

  const updateFormData = (updates: Partial<VideoUploadData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Basic Info
        if (!formData.title.trim()) {
          alert('Title is required');
          return false;
        }
        if (!formData.description.trim()) {
          alert('Description is required');
          return false;
        }
        if (!formData.category) {
          formData.category = "Education";
          return true;
        }
        return true;
        
      case 2: // Media Upload
        if (!formData.videoFile) {
          alert('Please upload a video file');
          return false;
        }
        if (!formData.thumbnailUrl) {
          console.log(formData.thumbnailUrl);
          alert('Please upload a thumbnail');
          return false;
        }
        return true;
        
      case 3: // Audience
        if (formData.madeForKids === null) {
          alert('Please specify if this content is made for kids');
          return false;
        }
        return true;
        
      case 4: // Safety & Compliance
        if (!formData.copyrightOwnership) {
          alert('You must confirm copyright ownership');
          return false;
        }
        if (formData.containsRealPeople && !formData.hasConsent) {
          alert('You must have consent from people shown in the video');
          return false;
        }
        return true;
        
      case 5: // Visibility
        return true;
        
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = () => {
    if (validateStep(currentStep)) {
      if (warnings.length > 0) {
        const confirm = window.confirm(
          `You have ${warnings.length} warning(s). Do you want to continue?\n\n${warnings.join('\n')}`
        );
        if (!confirm) return;
      }
      
      setShowPolicyModal(true);
    }
  };

  const confirmPublish = () => {
    setShowPolicyModal(false);
    localStorage.removeItem('video_upload_draft');
    onPublish(formData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep data={formData} updateData={updateFormData} />;
      case 2:
        return <MediaUploadStep data={formData} updateData={updateFormData} />;
      case 3:
        return <AudienceStep data={formData} updateData={updateFormData} />;
      case 4:
        return <SafetyComplianceStep data={formData} updateData={updateFormData} />;
      case 5:
        return <VisibilityPublishStep data={formData} updateData={updateFormData} />;
      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Video</h1>
          <p className="text-muted-foreground">
            Follow the steps to upload and publish your content
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progressPercentage} className="h-2 mb-4" />
          <div className="flex justify-between items-center">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStep === step.id;
              
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center flex-1 ${
                    isCurrent ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
                  }`}
                >
                  <div
                    className={`size-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                      isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-muted'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="size-5" /> : <Icon className="size-5" />}
                  </div>
                  <span className="text-xs font-medium text-center hidden sm:block">{step.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="mb-6 space-y-2">
            {warnings.map((warning, index) => (
              <Alert key={index} variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{warning}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Step {currentStep}: {STEPS[currentStep - 1].name}</CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Provide basic information about your video'}
              {currentStep === 2 && 'Upload your video file and thumbnail'}
              {currentStep === 3 && 'Set audience and age restrictions'}
              {currentStep === 4 && 'Declare content safety and compliance information'}
              {currentStep === 5 && 'Choose visibility settings and publish'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onCancel : handleBack}
            disabled={false}
          >
            <ChevronLeft className="size-4 mr-2" />
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>

          {currentStep < STEPS.length ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="size-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={() => handlePublish()}>
              Publish Video
            </Button>
          )}
        </div>
      </div>

      {/* Content Policy Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto bg-gray-50">
            <CardHeader>
              <CardTitle>Content Policy Agreement</CardTitle>
              <CardDescription>Please review before publishing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm">
                <h3 className="font-semibold">Community Guidelines</h3>
                <ul className="text-sm space-y-2">
                  <li>Your content must not violate copyright laws</li>
                  <li>You must have rights to all music, images, and video used</li>
                  <li>Content must not promote violence, hatred, or illegal activities</li>
                  <li>You must have consent from individuals shown in the video</li>
                  <li>Age-restricted content must be properly labeled</li>
                  <li>Misleading metadata or clickbait is prohibited</li>
                  <li>Spam, scams, and deceptive practices are not allowed</li>
                </ul>

                <h3 className="font-semibold mt-4">Your Responsibilities</h3>
                <ul className="text-sm space-y-2">
                  <li>You are responsible for all content you upload</li>
                  <li>False declarations may result in account termination</li>
                  <li>Content may be removed if it violates our policies</li>
                  <li>Repeated violations will result in account suspension</li>
                </ul>

                <h3 className="font-semibold mt-4">Copyright</h3>
                <p className="text-sm">
                  By uploading, you confirm that you own all rights to this content or have 
                  obtained proper licenses. We respect intellectual property and will respond 
                  to valid DMCA takedown requests.
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowPolicyModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={confirmPublish} className="flex-1">
                  I Agree - Publish Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
export default function Uvideo(){
  const handelePublish = (data: VideoUploadData) => {
    console.log("Publishing video with data:", data);
    try {
        const res = uploadVideo(data);
        res.then((response: any) => {
          alert(`Video uploaded successfully! ${response.status}`);
        }).catch((err: any) => {
          alert('Failed to upload video. Please try again.');
          console.error(err);
        });
    } catch (error) {
      console.error("Error publishing video:", error);
    }
  }
  const handleCancel = () => {
    console.log("Upload cancelled");
  }
  return (
    <UploadVideo onPublish={handelePublish} onCancel={handleCancel} />
  );

}