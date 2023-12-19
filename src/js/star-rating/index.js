export const starRating = percent => {
  const colorEmpty = getComputedStyle(
    document.documentElement
  ).getPropertyValue('--rating-color-inactive');

  const colorFill = getComputedStyle(document.documentElement).getPropertyValue(
    '--rating-color-active'
  );

  return `
<!-- DEFINE SVGs -->
<svg height="0" width="0">
  <defs>
    <!-- DEFINE ONE STAR -->
    <symbol viewBox="0 0 32 32" id="iconstar">
      <path
        d="M13.826 3.262c.684-2.106 3.663-2.106 4.348 0l1.932 5.945a2.285 2.285 0 0 0 2.174 1.579h6.251c2.214 0 3.135 2.833 1.344 4.135l-5.057 3.674a2.286 2.286 0 0 0-.83 2.556l1.931 5.945c.684 2.106-1.726 3.857-3.517 2.555l-5.057-3.674a2.286 2.286 0 0 0-2.687 0l-5.057 3.674c-1.791 1.302-4.202-.45-3.517-2.555l1.932-5.945a2.287 2.287 0 0 0-.83-2.556l-5.057-3.674c-1.791-1.302-.871-4.135 1.344-4.135h6.251c.99 0 1.868-.638 2.174-1.579l1.932-5.945z" />
    </symbol>
    <!-- DEFINE PATTERN FOR EMPTY STARS -->
    <pattern id="stars-empty" patternUnits="userSpaceOnUse" width="24" height="24">
      <use x="0" y="0" xlink:href="#iconstar" fill="${colorEmpty}" height="24" width="24"/>
    </pattern>
    <!-- DEFINE PATTERN FOR FULL STARS -->
    <pattern id="stars-full" patternUnits="userSpaceOnUse" width="24" height="24">
      <use x="0" y="0" xlink:href="#iconstar" fill="${colorFill}" height="24" width="24"/>
    </pattern>
  </defs>
</svg>

<!-- INSERT STARS -->
<svg height="24" viewBox="0 0 120 24" width="120">
  <rect fill="url(#stars-empty)" x="0" y="0" height="24" width="120"/>
  <rect fill="url(#stars-full)" x="0" y="0" height="24" width="${percent}%"/>
</svg>
`;
};
