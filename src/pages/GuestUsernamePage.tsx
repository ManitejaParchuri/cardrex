import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageIntro } from '../components/layout/PageIntro';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function GuestUsernamePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('StarlitFox');
  const [error, setError] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = username.trim();
    if (trimmed.length < 3 || trimmed.length > 24) {
      setError('Use between 3 and 24 characters.');
      return;
    }
    sessionStorage.setItem('cardrex-guest-name', trimmed);
    navigate('/claim');
  };

  return (
    <div className="mx-auto grid w-full max-w-xl content-center py-10 sm:py-16">
      <PageIntro
        eyebrow="Guest access"
        title="Choose your cosmic name"
        description="This temporary name stays with your collection for this browser session. You can create an account later."
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
              setError('');
            }}
            minLength={3}
            maxLength={24}
            autoComplete="nickname"
            aria-describedby="username-hint username-error"
            aria-invalid={Boolean(error)}
            className="mt-2 min-h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-base text-white placeholder:text-violet-100/30 focus:border-violet-300/50 focus:outline-none"
          />
          <div className="mt-2 flex min-h-5 justify-between gap-4 text-xs">
            <span id="username-error" className="text-rose-300" role="alert">
              {error}
            </span>
            <span id="username-hint" className="ml-auto text-violet-100/40">
              {username.length}/24
            </span>
          </div>
          <Button type="submit" fullWidth className="mt-5">
            Enter the vault
          </Button>
        </form>
      </Card>
    </div>
  );
}
