// Search field with a magnifier glyph — matches the design's inputs.
export default function SearchInput({ value, onChange, placeholder, style }) {
  return (
    <div style={{ position: 'relative', ...style }}>
      <svg width="16" height="16" viewBox="0 0 18 18" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted3)' }}>
        <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ width: '100%', padding: '11px 14px 11px 36px', borderRadius: 11, background: 'var(--surface)', border: '1px solid var(--border2)', color: 'var(--strong)', fontSize: 14, outline: 'none' }}
      />
    </div>
  )
}
