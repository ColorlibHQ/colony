import { Button, Dropdown, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import { useState, type ReactNode } from 'react';

interface HeaderActionProps {
  /** Accessible name and tooltip copy — already translated by the caller. */
  label: string;
  icon: ReactNode;
  items: NonNullable<MenuProps['items']>;
  selectedKeys: string[];
  onSelect: (key: string) => void;
}

/**
 * An icon button that opens a menu, with a tooltip that gets out of its own way.
 *
 * Naively nesting `<Dropdown><Tooltip><Button/></Tooltip></Dropdown>` leaves the
 * tooltip visible after the click, floating on top of the menu it just opened —
 * the pointer is still inside the trigger, so hover never ends. Both float in
 * the same overlay layer, so z-index cannot fix it.
 *
 * So the tooltip is controlled rather than hover-driven: it shows only while the
 * trigger has pointer or keyboard focus AND the menu is closed. Opening the menu
 * withdraws it immediately, and it does not reappear until the pointer leaves
 * and returns — which is also the correct behaviour, since an open menu already
 * names what the button does.
 */
export function HeaderAction({
  label,
  icon,
  items,
  selectedKeys,
  onSelect,
}: HeaderActionProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [triggerFocused, setTriggerFocused] = useState(false);

  return (
    <Dropdown
      open={menuOpen}
      onOpenChange={setMenuOpen}
      trigger={['click']}
      placement="bottomRight"
      menu={{
        items,
        selectable: true,
        selectedKeys,
        onClick: ({ key }) => {
          onSelect(key);
          setMenuOpen(false);
        },
      }}
    >
      <Tooltip
        title={label}
        open={triggerFocused && !menuOpen}
        placement="bottom"
      >
        <Button
          type="text"
          aria-label={label}
          icon={icon}
          onMouseEnter={() => setTriggerFocused(true)}
          onMouseLeave={() => setTriggerFocused(false)}
          onFocus={() => setTriggerFocused(true)}
          onBlur={() => setTriggerFocused(false)}
        />
      </Tooltip>
    </Dropdown>
  );
}
