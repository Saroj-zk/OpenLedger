import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Wordmark } from './ui/Ledger';
import { Link } from '../router';

/** The slim header the subpages share, since they have no hero to sit under. */
export default function PageHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--color-border)] bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <Link to="/" className="shrink-0">
          <Wordmark />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/models"
            className="ui-label hidden text-[color:var(--color-graphite)] transition-colors hover:text-foreground sm:inline"
          >
            Models
          </Link>
          <Link
            to="/token"
            className="ui-label hidden text-[color:var(--color-graphite)] transition-colors hover:text-foreground sm:inline"
          >
            Token
          </Link>
          <Link
            to="/"
            className="ui-label inline-flex items-center gap-2 text-[color:var(--color-graphite)] transition-colors hover:text-foreground"
          >
            <ArrowLeft size={13} />
            Home
          </Link>
          <a href="#" className="btn btn-accent px-5 py-2 text-[13px]">
            Start a chat
          </a>
        </div>
      </div>
    </header>
  );
}
