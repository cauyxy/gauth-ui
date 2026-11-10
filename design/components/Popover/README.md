# Popover

A menu or picker that opens from a control. `Popover`, `PopoverTrigger`, `PopoverAnchor`, `PopoverContent` in `src/components/Popover.tsx` (Radix).

- White, 24px radius, 20px padding, up to 420px wide, `shadow-pop`: the only place a drop shadow is used. An optional arrow points at what opened it.
- It grows out of what opened it (Radix sets the origin). The motion stops under reduced motion.
- It closes on Escape or a click outside.
