import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { PageIntro } from '../components/layout/PageIntro';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Loading } from '../components/ui/Loading';
import { useGuestSession } from '../guest/GuestSessionContext';
import { validateGuestDisplayName } from '../guest/guestSession';

export function GuestUsernamePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, isLoading, startSession, resetSession } = useGuestSession();
  const [username, setUsername] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const error = validateGuestDisplayName(username);
  const intendedPath = (
    location.state as { from?: { pathname?: string } } | null
  )?.from?.pathname;
  const destination =
    intendedPath === '/claim' || intendedPath === '/collection'
      ? intendedPath
      : '/claim';

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setIsTouched(true);
    if (error) return;

    setIsSubmitting(true);
    await startSession(username);
    navigate(destination, { replace: true });
  };

  if (isLoading) return <Loading label="Restoring guest session" />;

  if (session) {
    return (
      <div className="mx-auto grid w-full max-w-xl content-center py-10 sm:py-16">
        <PageIntro
          eyebrow="Guest access"
          title={`Welcome back, ${session.displayName}`}
          description="Your temporary guest session is active on this browser."
        />
        <Card className="mt-8 space-y-3">
          <Button fullWidth onClick={() => navigate(destination)}>
            Continue to the vault
          </Button>
          <Button
            fullWidth
            variant="secondary"
            onClick={async () => {
              await resetSession();
              setUsername('');
            }}
          >
            Continue as different guest
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-xl content-center py-10 sm:py-16">
      <PageIntro
        eyebrow="Guest access"
        title="Choose your cosmic name"
        description="This display name is saved temporarily on this browser. It is not an account or authentication."
      />
      <Card className="mt-8">
        <form onSubmit={submit} noValidate>
          <label
            htmlFor="username"
            className="text-sm font-semibold text-violet-50"
          >
            Guest username
          </label>
          <input
            id="username"
            name="username"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            onBlur={() => setIsTouched(true)}
            minLength={3}
            maxLength={20}
            pattern="[A-Za-z0-9 _-]+"
            autoComplete="nickname"
            aria-describedby="username-hint username-error"
            aria-invalid={isTouched && Boolean(error)}
            className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-base text-white placeholder:text-violet-100/30 focus:border-violet-300/50 focus:outline-none"
          />
          <div className="mt-2 flex min-h-5 justify-between gap-4 text-xs">
            <span id="username-error" className="text-rose-300" role="alert">
              {isTouched ? error : ''}
            </span>
            <span id="username-hint" className="ml-auto text-violet-100/40">
              {username.length}/20
            </span>
          </div>
          <Button
            type="submit"
            fullWidth
            className="mt-5"
            disabled={Boolean(error)}
            loading={isSubmitting}
          >
            Enter the vault
          </Button>
        </form>
      </Card>
    </div>
  );
}
