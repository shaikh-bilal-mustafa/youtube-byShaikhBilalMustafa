import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Eye, EyeOff, User, Mail, Lock, AlertCircle, Camera, LogOut } from 'lucide-react';

// Password strength calculator
const calculatePasswordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 3) return { score, label: 'Fair', color: 'bg-yellow-500' };
  if (score <= 4) return { score, label: 'Good', color: 'bg-blue-500' };
  return { score, label: 'Strong', color: 'bg-green-500' };
};

interface ProfileProps {
  user: {
    fullName: string;
    username: string;
    email: string;
    password: string;
    avatar: string;
    coverImage: string;
  };
  onUpdateProfile: (updatedUser: ProfileProps['user']) => void;
  onLogout: () => void;
}export default function getProfile(){
  // Initial user state
  const [user, setUser] = useState({
    name: "Bilal",
    email: "bilal@example.com",
    avatar: "",      // optional
    coverImage: "",  // optional
  });
  // Update profile callback
  const handleUpdateProfile = (updatedData:any) => {
    console.log("Updating user with:", updatedData);
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  // Logout callback
  const handleLogout = () => {
    console.log("User logged out");
    setUser(null);
  };


 const Profile = ({ user, onUpdateProfile, onLogout }: ProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    username?: string;
    email?: string;
    password?: string;
  }>({});

  // Calculate password strength
  const passwordStrength = updatedUser.password ? calculatePasswordStrength(updatedUser.password) : null;

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    // Full name validation
    if (!updatedUser.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (updatedUser.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }
    
    // Username validation
    if (!updatedUser.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (updatedUser.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    // Email validation
    if (!updatedUser.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedUser.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!updatedUser.password) {
      newErrors.password = 'Password is required';
    } else if (updatedUser.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Mock profile update - in production this would call an API
      console.log('Updating profile with:', updatedUser);
      alert(`Profile updated successfully!\n\nWelcome, ${updatedUser.fullName}!\nEmail: ${updatedUser.email}`);
      onUpdateProfile(updatedUser);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setUpdatedUser(user);
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1640963269654-3fe248c5fba6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdyYWRpZW50JTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NjI2OTE4OTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>

      {/* Profile Card */}
      <Card className="w-full max-w-md mx-4 z-10 shadow-2xl overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-32 bg-linear-to-r from-blue-500 to-purple-600 overflow-hidden">
          <ImageWithFallback
            src={user.coverImage}
            alt="Cover"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/20" />
          {/* Edit cover button - shown on hover when editing */}
          {isEditing && (
            <button
              title='button'
              type="button"
              className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              onClick={() => alert('Cover image upload would be handled here')}
            >
              <Camera className="size-4 text-white" />
            </button>
          )}
        </div>

        {/* Profile Avatar - Positioned to overlap cover */}
        <div className="relative px-6 -mt-16 mb-4">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="size-24 rounded-full border-4 border-background bg-muted overflow-hidden shadow-lg">
                <ImageWithFallback
                  src={user.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Camera icon overlay on hover */}
              {isEditing && (
                <button
                  title='button'
                  type="button"
                  className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  onClick={() => alert('Avatar upload would be handled here')}
                >
                  <Camera className="size-6 text-white" />
                </button>
              )}
            </div>
            {/* Username */}
            <div className="mt-3 text-center">
              <p className="text-sm font-medium text-muted-foreground">@{user.username}</p>
            </div>
          </div>
        </div>

        <CardHeader className="space-y-1 pt-0">
          <CardTitle className="text-center">
            {isEditing ? 'Edit your profile' : 'My Profile'}
          </CardTitle>
          <CardDescription className="text-center">
            {isEditing ? 'Update your details' : 'View and manage your account'}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={updatedUser.fullName}
                  onChange={(e) => {
                    setUpdatedUser({ ...updatedUser, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                  }}
                  className="pl-10"
                  aria-invalid={!!errors.fullName}
                  disabled={!isEditing}
                />
              </div>
              {errors.fullName && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  value={updatedUser.username}
                  onChange={(e) => {
                    setUpdatedUser({ ...updatedUser, username: e.target.value });
                    if (errors.username) setErrors({ ...errors, username: undefined });
                  }}
                  className="pl-7"
                  aria-invalid={!!errors.username}
                  disabled={!isEditing}
                />
              </div>
              {errors.username && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" />
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={updatedUser.email}
                  onChange={(e) => {
                    setUpdatedUser({ ...updatedUser, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className="pl-10"
                  aria-invalid={!!errors.email}
                  disabled={!isEditing}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={updatedUser.password}
                  onChange={(e) => {
                    setUpdatedUser({ ...updatedUser, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  className="pl-10 pr-10"
                  aria-invalid={!!errors.password}
                  disabled={!isEditing}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={!isEditing}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {isEditing && updatedUser.password && passwordStrength && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-200 ${
                          level <= passwordStrength.score
                            ? passwordStrength.color
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password strength: <span className="font-medium">{passwordStrength.label}</span>
                  </p>
                </div>
              )}
              
              {errors.password && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" />
                  {errors.password}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex-col space-y-3">
            {!isEditing ? (
              <>
                {/* Edit Profile Button */}
                <Button 
                  type="button" 
                  className="w-full" 
                  size="lg"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
                
                {/* Logout Button */}
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full" 
                  size="lg"
                  onClick={onLogout}
                >
                  <LogOut className="size-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                {/* Save Changes Button */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                >
                  Save Changes
                </Button>
                
                {/* Cancel Button */}
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full" 
                  size="lg"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
}