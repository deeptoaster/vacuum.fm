import * as React from 'react';
import { Button, Input, Link } from 'squiffles-components';
import { useCallback, useRef, useState } from 'react';
import { StageError } from '../defs';

import './ConfigureStage.css';

export default function ConfigureStage(props: {
  setError: (error: Error | null) => void;
}): JSX.Element {
  const { setError } = props;
  const [dateSpan, setDateSpan] = useState<0 | 7 | 30 | 90 | 180 | 365>(7);
  const [username, setUsername] = useState<string>('');
  const usernameInput = useRef<HTMLInputElement>(null);

  const focusUsername = useCallback(
    (): void => usernameInput.current?.focus(),
    []
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>): void => {
      try {
        if (username.length < 2 || username.length > 15) {
          throw new StageError(
            'Username must be between 2 and 15 characters.',
            focusUsername
          );
        }

        if (!/^[A-Z][-\w]*$/i.test(username)) {
          throw new StageError(
            'Username must start with a letter and contain only letters, numbers, hyphens, and underscores.',
            focusUsername
          );
        }
      } catch (error) {
        if ((error as Error).name === 'StageError') {
          setError(error as StageError);
          (error as StageError).focus();
        } else {
          throw error;
        }
      }

      event.preventDefault();
    },
    [focusUsername, setError, username]
  );

  return (
    <div>
      <main>
        <h1>Vacuum.fm</h1>
        <article className="configure-card">
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
        </article>
      </main>
      <ul className="configure-card-links">
        <li>
          <Link
            external={true}
            href="https://www.paypal.com/donate?business=T3NJS3T45WMFC&item_name=Vacuum.fm&currency_code=USD"
          >
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
