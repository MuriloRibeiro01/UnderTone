import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { cx } from "./format";

export interface TransportButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** primary = ação principal (Pausar tudo); ghost = mute; default = play/pause do canal */
  variant?: "default" | "primary" | "ghost";
  size?: "md" | "sm";
  icon?: IconName;
  /** Nome acessível e tooltip. Obrigatório quando não há texto. */
  label: string;
  /** Liga o estado pressionado (fundo hot) — usado só para mudo. */
  active?: boolean;
  children?: ReactNode;
}

export function TransportButton({
  variant = "default",
  size = "md",
  icon,
  label,
  active,
  children,
  className,
  ...rest
}: TransportButtonProps) {
  return (
    <button
      type="button"
      aria-label={children ? undefined : label}
      aria-pressed={active === undefined ? undefined : active}
      title={label}
      className={cx(
        "li-tbtn",
        `li-tbtn-${variant}`,
        `li-tbtn-${size}`,
        !!children && "has-text",
        active && "is-active",
        className
      )}
      {...rest}
    >
      {icon && <Icon name={icon} />}
      {children && <span>{children}</span>}
    </button>
  );
}
