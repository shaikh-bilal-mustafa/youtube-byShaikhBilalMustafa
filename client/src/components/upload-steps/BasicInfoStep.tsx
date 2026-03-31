import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { X, Sparkles } from 'lucide-react';
import type  { VideoUploadData } from '../../pages/UploadVideo';

interface BasicInfoStepProps {
  data: VideoUploadData;
  updateData: (updates: Partial<VideoUploadData>) => void;
}

const CATEGORIES = [
  'Entertainment',
  'Education',
  'Gaming',
  'Music',
  'Sports',
  'News & Politics',
  'Science & Technology',
  'How-to & Style',
  'Travel & Events',
  'Cooking & Food',
  'Health & Fitness',
  'Vlog',
  'Comedy',
  'Documentary',
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ur', name: 'Urdu' }
];

export function BasicInfoStep({ data, updateData }: BasicInfoStepProps) {
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
      updateData({ tags: [...data.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    updateData({ tags: data.tags.filter(t => t !== tag) });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // AI Tag Suggestion (mock)
  const suggestTags = () => {
    const suggestions = generateTagSuggestions(data.title, data.description);
    const newTags = [...data.tags];
    
    suggestions.forEach(tag => {
      if (!newTags.includes(tag)) {
        newTags.push(tag);
      }
    });
    
    updateData({ tags: newTags });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Enter a descriptive title for your video"
          value={data.title}
          onChange={(e) => updateData({ title: e.target.value })}
          maxLength={100}
        />
        <p className="text-xs text-muted-foreground">
          {data.title.length}/100 characters
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Tell viewers about your video"
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
          rows={5}
          maxLength={5000}
        />
        <p className="text-xs text-muted-foreground">
          {data.description.length}/5000 characters
        </p>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="tags">Tags</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={suggestTags}
            disabled={!data.title}
          >
            <Sparkles className="size-3 mr-2" />
            AI Suggest
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            id="tags"
            placeholder="Add tags (press Enter)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button type="button" onClick={handleAddTag}>Add</Button>
        </div>
        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button
                  title="Remove tag"
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Add tags to help people find your video
        </p>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">
          Category <span className="text-destructive">*</span>
        </Label>
        <Select value={data.category} onValueChange={(value) => updateData({ category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Optional Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Language */}
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select value={data.language} onValueChange={(value) => updateData({ language: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Recording Date */}
        <div className="space-y-2">
          <Label htmlFor="recordingDate">Recording Date</Label>
          <Input
            id="recordingDate"
            type="date"
            value={data.recordingDate}
            onChange={(e) => updateData({ recordingDate: e.target.value })}
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="Where was this video recorded?"
          value={data.location}
          onChange={(e) => updateData({ location: e.target.value })}
        />
      </div>
    </div>
  );
}

// AI Tag Suggestion Helper
function generateTagSuggestions(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const suggestions: string[] = [];
  
  const keywords = [
    { word: 'tutorial', tags: ['tutorial', 'howto', 'guide'] },
    { word: 'review', tags: ['review', 'unboxing', 'comparison'] },
    { word: 'gaming', tags: ['gaming', 'gameplay', 'walkthrough'] },
    { word: 'music', tags: ['music', 'song', 'audio'] },
    { word: 'cooking', tags: ['cooking', 'recipe', 'food'] },
    { word: 'travel', tags: ['travel', 'vlog', 'adventure'] },
    { word: 'fitness', tags: ['fitness', 'workout', 'health'] },
    { word: 'tech', tags: ['technology', 'tech', 'gadgets'] },
    { word: 'comedy', tags: ['funny', 'comedy', 'humor'] },
    { word: 'education', tags: ['educational', 'learning', 'tutorial'] },
  ];
  
  keywords.forEach(({ word, tags }) => {
    if (text.includes(word)) {
      tags.forEach(tag => {
        if (!suggestions.includes(tag)) {
          suggestions.push(tag);
        }
      });
    }
  });
  
  return suggestions.slice(0, 5);
}
