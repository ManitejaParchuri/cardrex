import { useState } from 'react';
import { Link } from 'react-router-dom';

import { PageIntro } from '../components/layout/PageIntro';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';

export function SignInPage() {
  const [showNotice, setShowNotice] = useState(false);

  return (
    <div className="mx-auto grid w-full max-w-xl content-center py-10 sm:py-16">
      <PageIntro
        eyebrow="Collector account"
        title="Welcome back"
        description="Account sign-in is coming in a future phase. Guest access is ready for this preview."
      />
      <Card className="mt-8 space-y-3">
        <Button fullWidth onClick={() => setShowNotice(true)}>
          Continue with email
        </Button>
        <Button
          fullWidth
          variant="secondary"
          onClick={() => setShowNotice(true)}
        >
          Continue with company account
        </Button>
        <p className="pt-2 text-center text-xs text-violet-100/45">
          Want to explore now?{' '}
          <Link className="font-semibold text-violet-300 underline" to="/guest">
            Continue as guest
          </Link>
        </p>
      </Card>
      <Modal
        isOpen={showNotice}
        onClose={() => setShowNotice(false)}
        title="Sign-in is on its way"
      >
        <p>
          Secure account authentication will arrive in a later phase. Continue
          as a guest to preview the claim experience.
        </p>
      </Modal>
    </div>
  );
}
