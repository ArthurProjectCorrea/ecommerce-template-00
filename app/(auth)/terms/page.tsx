import TermsContent from '@/content/terms.mdx';
import { Card, CardContent } from '@/components/ui/card';
import { BackButton } from '@/components/auth/back-button';

export default function TermsPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 text-left">
      <BackButton />
      <Card>
        <CardContent className="p-8 md:p-12">
          <TermsContent />
        </CardContent>
      </Card>
    </main>
  );
}
