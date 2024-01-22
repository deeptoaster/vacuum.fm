import * as React from 'react';
import { useState } from 'react';

import Button from '../components/Button';
import Input from '../components/Input';
import Link from '../components/Link';

import './ConfigureStage.css';

export default function ConfigureStage(): JSX.Element {
  const [username, setUsername] = useState<string>('');
  const [dateSpan, setDateSpan] = useState<0 | 7 | 30 | 90 | 180 | 365>(7);

  return (
    <div>
      <main>
        <h1>Vacuum.fm</h1>
        <article className="configure-card">
          <form>
            <Input
              id="configure-username"
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
          </form>
          <figure>
            <Button variant="primary">Get Started</Button>
          </figure>
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
