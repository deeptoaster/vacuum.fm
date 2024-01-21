import * as React from 'react';
import { ChangeEvent, RefObject, useMemo } from 'react';

import './Input.css';

type CommonInputProps<Value extends number | string> = {
  id: string;
  label: string;
  onUpdate: (value: Value) => void;
  value: Value;
};

type Option<Value extends number | string> = {
  label: string;
  value: Value;
};

type SelectInputProps<Value extends number | string> = {
  inputRef?: RefObject<HTMLSelectElement>;
  options: ReadonlyArray<Option<Value>>;
};

type TextInputProps = {
  inputRef?: RefObject<HTMLInputElement>;
};

export default function Input<Value extends number | string>(
  props: CommonInputProps<Value> & (SelectInputProps<Value> | TextInputProps)
): JSX.Element {
  // eslint-disable-next-line react/prop-types
  const { id, inputRef, label, onUpdate, options, value } =
    props as CommonInputProps<Value> &
      Partial<SelectInputProps<Value> & TextInputProps>;

  const handleChange = useMemo(
    () =>
      (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void =>
        onUpdate(event.currentTarget.value as Value),
    [onUpdate]
  );

  return (
    <div className="form-control">
      <label htmlFor={id}>{label}</label>
      <div className="input-group">
        {options != null ? (
          <select id={id} onChange={handleChange} ref={inputRef} value={value}>
            {/* eslint-disable-next-line react/prop-types */}
            {options.map(
              ({ label, value }: Option<Value>): JSX.Element => (
                <option key={value} value={value}>
                  {label}
                </option>
              )
            )}
          </select>
        ) : (
          <input
            id={id}
            onChange={handleChange}
            ref={inputRef}
            type="text"
            value={value}
          />
        )}
      </div>
    </div>
  );
}
