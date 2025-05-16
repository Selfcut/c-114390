
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  accept?: string;
  className?: string;
  helperText?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  multiline = false,
  rows = 3,
  required = false,
  disabled = false,
  accept,
  className,
  helperText
}) => {
  return (
    <div className="space-y-2">
      <Label 
        htmlFor={id}
        className="text-sm font-medium"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {multiline ? (
        <Textarea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows}
          required={required}
          disabled={disabled}
          className={className}
        />
      ) : (
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          accept={accept}
          className={className}
        />
      )}
      
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
};
