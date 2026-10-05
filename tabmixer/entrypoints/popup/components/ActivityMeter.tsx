import { cx } from "./format";

export interface ActivityMeterProps {
  /** true só se tocando E não mudo. */
  playing: boolean;
}

export function ActivityMeter({ playing }: ActivityMeterProps) {
  return (
    <span className={cx("li-meter", playing && "is-playing")} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}
