"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Hospital } from "lucide-react"
import { useFirebase } from "@/components/firebase/firebase-provider"
import { useTranslation } from "@/components/i18n/language-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LanguageSelector } from "@/components/language-selector"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import SplineAnimation from "@/components/ui/spline-animation"
import { MotionDiv, MotionText, MotionCard, MotionButton } from "@/components/ui/motion"

export default function LoginPage() {
  const { signIn, signUp, signInWithGoogle } = useFirebase()
  const { t } = useTranslation()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>("")
  const [loginPassword, setLoginPassword] = useState<string>("")

  // Signup form state
  const [signupEmail, setSignupEmail] = useState<string>("")
  const [signupPassword, setSignupPassword] = useState<string>("")
  const [signupRole, setSignupRole] = useState<string>("doctor")

  // Set mounted state for client-side animations
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Check if email and password are provided
      if (!loginEmail || !loginPassword) {
        throw new Error("Please enter both email and password")
      }
      
      await signIn(loginEmail, loginPassword)
    } catch (err: any) {
      setError(err.message || "Failed to login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate email format
      if (!/^\S+@\S+\.\S+$/.test(signupEmail)) {
        throw new Error("Please enter a valid email address")
      }
      
      // Validate password length
      if (signupPassword.length < 6) {
        throw new Error("Password must be at least 6 characters long")
      }
      
      await signUp(signupEmail, signupPassword, signupRole as "doctor" | "health_worker")
    } catch (err: any) {
      setError(err.message || "Failed to sign up")
    } finally {
      setIsLoading(false)
    }
  }

  // For demo purposes, provide a quick login function
  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signIn("demo@ruralcare.org", "password");
    } catch (err: any) {
      console.error("Demo login failed:", err);
      setError("Demo login failed. Using fallback mode.");
      // Even if the Firebase call fails, we'll still navigate to dashboard
      // since our provider has fallback handling for the demo user
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Failed to login with Google");
    } finally {
      setIsLoading(false);
    }
  }

  if (!mounted) {
    return null; // Avoid flash of content before animations are ready
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-stretch overflow-hidden">
      {/* 3D Animation Panel */}
      <MotionDiv 
        variant="fadeIn" 
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8 relative"
      >
        <div className="absolute top-4 left-4 z-10">
          <MotionText 
            className="text-3xl font-bold text-primary" 
            delay={0.3}
          >
            RuralCare AI
          </MotionText>
          <MotionText 
            className="text-lg text-muted-foreground" 
            delay={0.5}
          >
            Smart Healthcare Solutions
          </MotionText>
        </div>
        
        <div className="w-full h-full">
          <SplineAnimation 
            scene="https://prod.spline.design/eXhiM12HgM3KCHzZ/scene.splinecode" 
          />
        </div>
        
        <div className="absolute bottom-8 left-8 right-8 z-10">
          <MotionCard 
            variant="slideUp" 
            delay={0.7} 
            className="p-4 bg-background/80 backdrop-blur-md"
          >
            <MotionText delay={0.9}>
              <span className="font-semibold">"RuralCare AI is revolutionizing healthcare delivery in rural areas. The predictive analytics and resource optimization have helped us serve 40% more patients."</span>
              <div className="mt-2 text-sm text-muted-foreground">
                — Dr. Meera Patel, Chief Medical Officer
              </div>
            </MotionText>
          </MotionCard>
        </div>
      </MotionDiv>

      {/* Login Form Panel */}
      <MotionDiv 
        variant="fadeIn" 
        className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-950 dark:to-gray-900"
      >
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <LanguageSelector />
        </div>

        <MotionCard 
          variant="scale" 
          delay={0.3} 
          className="w-full max-w-md"
        >
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <MotionDiv 
                whileHover={{ rotate: 5, scale: 1.1 }} 
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Hospital className="h-12 w-12 text-primary" />
              </MotionDiv>
            </div>
            <CardTitle className="text-2xl text-center">{t("app.title")}</CardTitle>
            <CardDescription className="text-center">{t("app.subtitle")}</CardDescription>
          </CardHeader>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">{t("login.title")}</TabsTrigger>
              <TabsTrigger value="signup">{t("login.signup")}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4 pt-4">
                  {error && (
                    <MotionDiv
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    </MotionDiv>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">{t("login.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="m.patel@healthcare.org"
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{t("login.password")}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <MotionButton
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="h-5 w-5 border-2 border-current border-r-transparent rounded-full animate-spin mr-2"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      t("login.button")
                    )}
                  </MotionButton>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <MotionButton 
                    type="button" 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2 border border-input bg-background"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    <span>Google</span>
                  </MotionButton>
                </CardContent>
              </form>

              <CardFooter className="flex flex-col items-center gap-2">
                <div className="text-sm text-muted-foreground">{t("login.demo")}</div>
                <MotionButton 
                  variant="default" 
                  size="sm" 
                  onClick={handleDemoLogin}
                  className="w-full bg-primary/10 text-primary hover:bg-primary/20"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2"></div>
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    "Use Demo Account"
                  )}
                </MotionButton>
              </CardFooter>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4 pt-4">
                  {error && (
                    <MotionDiv
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    </MotionDiv>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t("login.email")}</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="m.patel@healthcare.org"
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t("login.password")}</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">{t("login.role")}</Label>
                    <Select value={signupRole} onValueChange={setSignupRole}>
                      <SelectTrigger id="role" className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="doctor">{t("role.doctor")}</SelectItem>
                        <SelectItem value="health_worker">{t("role.health_worker")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <MotionButton 
                    type="submit" 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="h-5 w-5 border-2 border-current border-r-transparent rounded-full animate-spin mr-2"></div>
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      t("login.signup")
                    )}
                  </MotionButton>
                </CardContent>
              </form>
            </TabsContent>
          </Tabs>
        </MotionCard>
      </MotionDiv>
    </div>
  );
}
