import { useState } from 'react'

// Renders any element with a base style that merges in `hover` styles while
// the pointer is over it — the React equivalent of the prototype's style-hover.
export default function Hover({ as = 'button', style, hover = {}, children, ...rest }) {
  const [over, setOver] = useState(false)
  const Tag = as
  return (
    <Tag
      {...rest}
      onMouseEnter={(e) => { setOver(true); rest.onMouseEnter && rest.onMouseEnter(e) }}
      onMouseLeave={(e) => { setOver(false); rest.onMouseLeave && rest.onMouseLeave(e) }}
      style={{ ...style, ...(over ? hover : null) }}
    >
      {children}
    </Tag>
  )
}
