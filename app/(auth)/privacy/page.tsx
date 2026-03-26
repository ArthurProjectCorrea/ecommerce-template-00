import PrivacyContent from '@/content/privacy.mdx';
import { Card, CardContent } from '@/components/ui/card';
import { BackButton } from '@/components/auth/back-button';

export default function PrivacyPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 text-left">
      <BackButton />
      <Card>
        <CardContent className="p-8 md:p-12">
          <PrivacyContent />
        </CardContent>
      </Card>
    </main>
  );
}
