
"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/auth-layout";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Google</title>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.73 1.9-5.27 0-9.49-4.22-9.49-9.49s4.22-9.49 9.49-9.49c2.35 0 4.16.87 5.6 2.25l2.43-2.43C18.4 1.19 15.7.02 12.48.02c-6.63 0-12 5.37-12 12s5.37 12 12 12c6.94 0 11.52-4.88 11.52-11.72 0-.79-.07-1.54-.19-2.28h-11.3v.01Z" />
    </svg>
  );
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function SignupPage() {
  return (
    <AuthLayout
      imageUrl="https://placehold.co/1200x800.png"
      imageHint="abstract video art"
    >
      <div className="flex flex-col justify-center items-start h-full">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2 text-primary">
              <Icons.Logo className="h-8 w-8" />
              <span className="text-xl font-bold text-foreground">
                Mishra Studios
              </span>
            </Link>
            <p className="text-muted-foreground mt-2">
              Create. Edit. Publish. Powered by AI.
            </p>
          </div>

          <form className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input type="text" id="name" placeholder="John Doe" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="user@example.com" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input type="password" id="password" placeholder="••••••••" />
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox id="terms" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-normal text-muted-foreground"
                >
                  I agree to Mishra Studios’{" "}
                  <Link href="/terms" className="font-bold text-primary hover:underline" target="_blank">
                    Terms of Use
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="font-bold text-primary hover:underline" target="_blank">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
            </div>
            
            <div className="pt-2">
                <Button className="w-full" size="lg">Create your free account</Button>
                <p className="text-center text-xs text-muted-foreground mt-2">
                    No credit card required. Start editing in seconds.
                </p>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="outline">
              <GoogleIcon className="mr-2 h-5 w-5" />
              Google
            </Button>
            <Button variant="outline">
              <GithubIcon className="mr-2 h-5 w-5" />
              GitHub
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
