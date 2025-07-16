
import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  imageUrl: string;
  imageHint: string;
}

export function AuthLayout({ children, imageUrl, imageHint }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 relative">
      <div className="flex items-center justify-center p-6 sm:p-12">
        {children}
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src={imageUrl}
          alt="Authentication background"
          data-ai-hint={imageHint}
          width="1200"
          height="800"
          className="h-full w-full object-cover dark:brightness-[0.8] dark:grayscale"
        />
      </div>
       <footer className="absolute bottom-0 left-0 w-full p-4">
         <div className="container mx-auto px-4 md:px-6">
            <p className="text-xs text-muted-foreground text-center lg:text-left">
                Made with ❤️ by{" "}
                <Link href="https://shravya.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                    Shravya Foundation
                </Link>
                .
            </p>
         </div>
      </footer>
    </div>
  );
}
