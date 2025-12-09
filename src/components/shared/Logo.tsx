import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import logoImage from './Logo.png';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="ASG Autotransportes Santa Gertrudis homepage"
      className={cn('inline-flex items-center', className)}
    >
      <Image
        src={logoImage}
        alt="ASG Transport Hub Logo"
        width={200}
        height={80}
        priority
        className="h-10 w-auto sm:h-12"
      />
    </Link>
  );
}
