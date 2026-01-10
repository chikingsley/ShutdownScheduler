import React from "react";
import * as Lucide from "lucide-react";

interface IconProps {
  name: keyof typeof Lucide;
  className?: string;
  size?: number;
}

const IconWrapper: React.FC<IconProps> = ({
  name,
  className = "",
  size = 20,
}) => {
  const IconComponent = Lucide[name] as React.ElementType;
  if (!IconComponent) return null;
  return <IconComponent className={className} size={size} />;
};

export default IconWrapper;
