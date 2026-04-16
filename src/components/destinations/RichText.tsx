/** Trusted editorial HTML from our CMS / data layer — styled for luxury magazine rhythm. */
export function RichText({
  html,
  className = "",
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={`ftmag-rich space-y-5 text-[15px] leading-[1.75] text-white/85 md:text-base ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
