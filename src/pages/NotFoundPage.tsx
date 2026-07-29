import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="grid w-full place-items-center py-20 text-center">
      <div>
        <p className="text-6xl font-black text-violet-300">404</p>
        <h1 className="mt-4 text-2xl font-bold text-white">Lost between stars</h1>
        <p className="mt-2 text-sm text-violet-100/55">This part of the cosmos does not exist.</p>
        <Link className="mt-6 inline-flex min-h-11 items-center font-semibold text-violet-300 underline" to="/">
          Return home
        </Link>
      </div>
    </div>
  );
}
