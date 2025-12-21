import { cn } from "@/lib/utils";

interface AuthorAvatarProps {
  name: string;
  photo?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-12 h-12 text-lg",
  md: "w-20 h-20 text-2xl",
  lg: "w-32 h-32 text-4xl",
};

export default function AuthorAvatar({ name, photo, size = "md", className }: AuthorAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  // Generate a color based on the author name
  const getAvatarColor = () => {
    const colors = [
      "from-primary/40 to-dawn-mid/50",
      "from-accent to-dawn-end/40",
      "from-dawn-start/50 to-primary/30",
      "from-secondary to-accent/40",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  if (!photo) {
    return (
      <div
        className={cn(
          "rounded-full bg-gradient-to-br flex items-center justify-center",
          sizeClasses[size],
          getAvatarColor(),
          className
        )}
      >
        <span className="font-heading font-semibold text-foreground/70">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img
      src={photo}
      alt={name}
      className={cn(
        "rounded-full object-cover",
        sizeClasses[size],
        className
      )}
    />
  );
}
