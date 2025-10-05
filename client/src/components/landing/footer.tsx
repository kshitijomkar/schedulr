// src-components/landing/footer.tsx
import { Linkedin, Github } from 'lucide-react'; // Changed Twitter to Github
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Left Side: Copyright & Credits */}
        <div className="text-center sm:text-left text-sm text-muted-foreground">
          <p>&copy; 2025 Schedulr. All Rights Reserved.</p>
          <p>
            Built by{' '}
            <a
              href="https://www.linkedin.com/in/kshitijomkar/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              Kshitij Omkar
            </a>{' '}
            · Powered by{' '}
            <a
              href="https://webrakor.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              Webrakor
            </a>
          </p>
        </div>

        {/* Right Side: Social Media Icons */}
        <div className="flex items-center space-x-4">
          {/* GitHub Icon and Link */}
          <Link 
            href="https://github.com/kshitijomkar" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Visit our GitHub page"
          >
            <Github className="w-5 h-5" />
          </Link>
          
          {/* LinkedIn Icon and Link */}
          <Link 
            href="https://www.linkedin.com/in/kshitijomkar/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Visit our LinkedIn page"
          >
            <Linkedin className="w-5 h-5" />
          </Link>
        </div>
        
      </div>
    </footer>
  );
}