import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'small' | 'medium' | 'large';

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export const Button: React.FC<CustomButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "medium",
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles = "font-regular rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center";
  
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-black hover:bg-gray-800 text-white focus:ring-black disabled:bg-gray-300",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500 disabled:bg-gray-100",
    outline: "border-2 border-black hover:bg-gray-100 focus:ring-black disabled:border-gray-300 disabled:text-gray-300"
  };
  
  const sizes: Record<ButtonSize, string> = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};