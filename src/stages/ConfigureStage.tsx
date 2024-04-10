import * as React from 'react';
import { Button, Card, Input, Link } from 'squiffles-components';
import { useCallback, useRef, useState } from 'react';
import type { FormEvent } from 'react';

import { DONATION_URL, StageError } from '../defs';
import type { DateSpan } from '../defs';

import './ConfigureStage.css';

export default function ConfigureStage(props: {
  loadDatabase: (dateSpan: DateSpan) => Promise<void>;
  setError: (error: Error | null) => void;
  setUsername: (username: string) => void;
  username: string;
}): JSX.Element {
  const { loadDatabase, setError, setUsername, username } = props;
  const [dateSpan, setDateSpan] = useState<DateSpan>(7);
  const usernameInput = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      try {
        if (username.length < 2 || username.length > 15) {
          throw new StageError('Username must be between 2 and 15 characters.');
        }

        if (!/^[A-Z][-\w]*$/i.test(username)) {
          throw new StageError(
            'Username must start with a letter and contain only letters, numbers, hyphens, and underscores.'
          );
        }

        loadDatabase(dateSpan);
      } catch (error) {
        if ((error as Error).name === 'StageError') {
          setError(error as StageError);
          usernameInput.current?.focus();
        } else {
          throw error;
        }
      }

      event.preventDefault();
    },
    [dateSpan, loadDatabase, setError, username]
  );

  return (
    <div>
      <main>
        <h1>Vacuum.fm</h1>
        <Card width={20}>
          <form onSubmit={handleSubmit}>
            <Input
              id="configure-username"
              inputRef={usernameInput}
              label="Last.fm Username"
              onUpdate={setUsername}
              value={username}
            />
            <Input
              id="configure-date-span"
              label="Date Range"
              onUpdate={setDateSpan}
              options={[
                { label: '7 days', value: 7 },
                { label: '30 days', value: 30 },
                { label: '90 days', value: 90 },
                { label: '180 days', value: 180 },
                { label: '365 days', value: 365 },
                { label: 'All time', value: 0 }
              ]}
              value={dateSpan}
            />
            <figure>
              <Button variant="primary" isSubmit={true}>
                Get Started
              </Button>
            </figure>
          </form>
        </Card>
      </main>
      <ul className="configure-card-links">
        <li>
          <Link external={true} href={DONATION_URL}>
            Donate
          </Link>
        </li>
        <li>
          <Link external={true} href="https://github.com/deeptoaster/vacuum.fm">
            GitHub
          </Link>
        </li>
        <li>
          <Link external={true} href="https://fishbotwilleatyou.com/">
            fishbotwilleatyou
          </Link>
        </li>
      </ul>
    </div>
  );
}
