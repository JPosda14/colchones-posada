interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "whatsapp";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 active:scale-[0.97]";

  const variants: Record<string, string> = {
    primary: "bg-verde text-white hover:bg-verde/90 focus-visible:ring-2 focus-visible:ring-verde/50",
    secondary: "bg-crema-oscura text-texto hover:bg-crema-oscura/80",
    outline: "border-2 border-verde text-verde hover:bg-verde hover:text-white",
    whatsapp: "bg-whatsapp text-white hover:bg-whatsapp/90 focus-visible:ring-2 focus-visible:ring-whatsapp/50",
  };

  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm min-h-[36px]",
    md: "px-5 py-2.5 text-base min-h-[44px]",
    lg: "px-7 py-3 text-lg min-h-[52px]",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
