import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { registerUser } from "../api/user.api";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
} from "lucide-react";

// Password strength calculator
const calculatePasswordStrength = (
  password: string,
): { score: number; label: string; color: string } => {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 3) return { score, label: "Fair", color: "bg-yellow-500" };
  if (score <= 4) return { score, label: "Good", color: "bg-blue-500" };
  return { score, label: "Strong", color: "bg-green-500" };
};

interface SignUpProps {
  onSwitchToSignIn: () => void;
  onSignUp: (fullName: string, email: string, password: string) => void;
}

export default function SignUp({ onSwitchToSignIn, onSignUp }: SignUpProps) {
  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
   
  // Error state
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    terms?: string;
    bakend?: string;
  }>({});
  // message state
  const [message, setMessage] = useState<string | null>(null);

  // Calculate password strength
  const passwordStrength = password
    ? calculatePasswordStrength(password)
    : null;

  // Validation function
  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Full name validation
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Terms validation
    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsLoading(true);
    setErrors({});
    setMessage(null);
    
    try {
      // Simulate API call
      const response = await registerUser({ fullName, email, password });
      console.log("User registered successfully:", response);
      setMessage("Account created successfully! Please sign in.");
      onSignUp(fullName, email, password);
    } catch (error: any) {
      const backendMessage = error.response?.data?.message;
      setErrors({ bakend: backendMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background Image with Overlay */}

      {/* Registration Card */}
      <Card className="w-full max-w-md mx-4 z-10 shadow-2xl overflow-hidden absolute ">
        {/* Cover Image */}
        {/* Profile Avatar - Positioned to overlap cover */}
        <div className="relative px-6 -mt-16 mb-4">
          <div className="flex flex-col items-center">
            <div className="relative group"></div>
            {/* Default Username */}
          </div>
        </div>

        <CardHeader className="space-y-1 pt-0">
          <CardTitle className="text-center">
            Create your account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to get started
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Success/Error Message Display */}
            {message && (
              <div className="p-3 rounded-md bg-green-50 border border-green-200 flex items-center gap-2">
                <AlertCircle className="size-4 text-green-600" />
                <p className="text-sm text-green-700">{message}</p>
              </div>
            )}

            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName)
                      setErrors({ ...errors, fullName: undefined });
                  }}
                  className="pl-10"
                  aria-invalid={!!errors.fullName}
                  disabled={isLoading}
                />
              </div>
              {errors.fullName && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" />
                  {errors.fullName}
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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors({ ...errors, email: undefined });
                  }}
                  className="pl-10"
                  aria-invalid={!!errors.email}
                  disabled={isLoading}
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors({ ...errors, password: undefined });
                  }}
                  className="pl-10 pr-10"
                  aria-invalid={!!errors.password}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && passwordStrength && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-200 ${
                          level <= passwordStrength.score
                            ? passwordStrength.color
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password strength:{" "}
                    <span className="font-medium">
                      {passwordStrength.label}
                    </span>
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

            {/* Terms & Conditions Checkbox */}
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked: any) => {
                    setAcceptTerms(checked === true);
                    if (errors.terms)
                      setErrors({ ...errors, terms: undefined });
                  }}
                  aria-invalid={!!errors.terms}
                  disabled={isLoading}
                  className="mt-0.5"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm cursor-pointer leading-relaxed"
                >
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() =>
                      alert("Terms & Conditions would be displayed here")
                    }
                  >
                    Terms & Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() =>
                      alert("Privacy Policy would be displayed here")
                    }
                  >
                    Privacy Policy
                  </button>
                </Label>
              </div>
              {errors.terms && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="size-3" />
                  {errors.terms}
                </p>
              )}
              {/* Success Message */}
  {message && (
    <p className="text-sm text-green-500 flex items-center gap-1">
      {message}
    </p>
  )}
  {/* {error Message} */}
  {errors && (
    <p className="text-sm text-red-500 flex items-center gap-1">
      {/* <AlertCircle className="size-3" /> */}
      {Object.values(errors).join(", ")}
    </p>
  )}
            </div>
          </CardContent>

          <CardFooter className="flex-col space-y-4">
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Sign In Link */}
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <button
                type="button"
                className="text-primary hover:underline font-medium"
                onClick={onSwitchToSignIn}
                disabled={isLoading}
              >
                Sign in
              </button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
