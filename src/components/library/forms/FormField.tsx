
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  multiline?: boolean;
  type?: string;
  className?: string;
  required?: boolean;
  rows?: number;
  disabled?: boolean;
  accept?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  type = 'text',
  className = '',
  required = false,
  rows = 3,
  disabled = false,
  accept
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      {multiline ? (
        <Textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`min-h-[${rows * 24}px]`}
          rows={rows}
          disabled={disabled}
          required={required}
        />
      ) : (
        <Input
          id={id}
          type={type}
          value={type === 'file' ? undefined : value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          accept={accept}
        />
      )}
    </div>
  );
};
