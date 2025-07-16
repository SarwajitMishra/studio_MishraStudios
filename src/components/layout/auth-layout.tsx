
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  imageUrl: string;
  imageHint: string;
}

export function AuthLayout({ children, imageUrl, imageHint }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
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
    </div>
  );
}
