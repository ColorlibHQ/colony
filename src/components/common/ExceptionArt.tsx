/**
 * Exception illustrations.
 *
 * antd's built-in Result artwork for 403/404/500 ships hardcoded fills
 * (#E4EBF7, #FFF, #1677ff, #FFB594 …). On a dark ground it floats as a bright
 * rectangle, and the blue stays antd-blue no matter which theme preset is
 * active. These draw from currentColor and the live antd token instead, so they
 * follow both the colour mode and the chosen preset.
 */

type Code = '403' | '404' | '500';

const TITLE_KEY: Record<Code, string> = {
  '403': 'Forbidden',
  '404': 'Not found',
  '500': 'Server error',
};

export function ExceptionArt({ code }: { code: Code }) {
  return (
    <svg
      viewBox="0 0 240 160"
      width="240"
      height="160"
      role="img"
      aria-label={TITLE_KEY[code]}
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      {/* Ground shadow — a token tint, so it disappears correctly on dark. */}
      <ellipse
        cx="120"
        cy="140"
        rx="72"
        ry="8"
        fill="var(--c-surface-sunken)"
      />

      {/* Card stack */}
      <rect
        x="52"
        y="34"
        width="136"
        height="88"
        rx="10"
        fill="var(--c-surface)"
        stroke="var(--c-border)"
        strokeWidth="2"
      />
      <rect
        x="66"
        y="22"
        width="108"
        height="14"
        rx="7"
        fill="var(--c-surface-sunken)"
        stroke="var(--c-border)"
        strokeWidth="2"
      />

      {/* Content lines */}
      <rect
        x="70"
        y="54"
        width="58"
        height="7"
        rx="3.5"
        fill="var(--c-border)"
      />
      <rect
        x="70"
        y="70"
        width="86"
        height="7"
        rx="3.5"
        fill="var(--c-border-soft)"
      />
      <rect
        x="70"
        y="86"
        width="42"
        height="7"
        rx="3.5"
        fill="var(--c-border-soft)"
      />

      {/* Badge — the one accented element, from the active preset */}
      <circle
        cx="168"
        cy="52"
        r="22"
        fill="var(--ant-color-primary, #1677ff)"
      />
      <text
        x="168"
        y="52"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="15"
        fontWeight="600"
        fill="#fff"
        fontFamily="var(--font-mono)"
      >
        {code}
      </text>
    </svg>
  );
}
