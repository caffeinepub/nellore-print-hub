import { useState } from 'react';
import { Check } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import BottomSheet from './BottomSheet';
import { haptics } from '../utils/haptics';

interface BottomSheetSelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
}

export default function BottomSheetSelect({
  label,
  value,
  onValueChange,
  options,
  placeholder = 'Select an option',
  required = false,
}: BottomSheetSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    haptics.select();
    onValueChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && '*'}
      </Label>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="w-full justify-start text-left font-normal h-12 text-base"
      >
        {selectedOption ? selectedOption.label : placeholder}
      </Button>

      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title={label}>
        <div className="space-y-2">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-accent transition-colors min-h-[56px]"
            >
              <span className="text-base font-medium">{option.label}</span>
              {value === option.value && <Check className="w-5 h-5 text-primary" />}
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}
