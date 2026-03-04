import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from './Button';

interface MagicButtonProps {
  onClick: () => Promise<void>;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const MagicButton: React.FC<MagicButtonProps> = ({ onClick, label = "Auto-fill with AI", className, disabled }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleClick} 
      disabled={loading || disabled}
      className={`text-indigo-600 border-indigo-200 hover:bg-indigo-50 ${className}`}
    >
      {loading ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Sparkles size={16} className="mr-2" />}
      {loading ? 'Generating...' : label}
    </Button>
  );
};
