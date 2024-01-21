import * as React from 'react';
import { useState } from 'react';

import Input from '../components/Input';

import './ConfigureStage.css';

export default function ConfigureStage(): JSX.Element {
  const [username, setUsername] = useState<string>('');
  const [dateSpan, setDateSpan] = useState<0 | 7 | 30 | 90 | 180 | 365>(7);

  return (
    <div className="configure-stage">
      <h1>Vacuum.fm</h1>
      <article className="configure-card">
        <form>
          <Input
            id="configure-username"
            label="Username"
            onUpdate={setUsername}
            value={username}
          />
          <Input
            id="configure-date-span"
            label="Date Span"
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
      </article>
    </div>
  );
}
