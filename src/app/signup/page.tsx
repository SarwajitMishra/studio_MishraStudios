
"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Phone } from "lucide-react";
import Link from "next/link";

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

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Icons.Logo className="h-10 w-10 text-primary" />
          </div>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            Get started with your creative journey at Mishra Studios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="user@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full">Create Account</Button>
          <div className="relative">
            <Separator className="my-4" />
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline">
              <GoogleIcon className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button variant="outline">
              <Phone className="mr-2 h-4 w-4" />
              Phone
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
