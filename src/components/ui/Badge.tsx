interface BadgeProps {
  variant?: "verde" | "acento" | "rojo";
  children: React.ReactNode;
}

export function Badge({ variant = "verde", children }: BadgeProps) {
  const variants: Record<string, string> = {
    verde: "bg-verde-muy-claro text-verde",
    acento: "bg-acento/10 text-acento",
    rojo: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
