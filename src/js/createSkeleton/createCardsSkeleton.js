export function createCardsSkeleton(amount, element) {
  let skeleton = '';
  for (let i = 0; i < amount; i += 1) {
    if (element.classList.contains('workout-cards__wrapper') || element.classList.contains('favorite-cards__wrapper')) {
      skeleton += `
      <li class='workouts__skeleton-loader'>
        <div class='svg-container'>
          <svg
            role="img"
            width="100%"
            height="135"
            aria-labelledby="loading-aria"
            viewBox="0 0 405 141"
            preserveAspectRatio="none"
          >
            <title id="loading-aria">Loading...</title>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              clip-path="url(#clip-path)"
              style='fill: url("#fill");'
            ></rect>
            <defs>
              <clipPath id="clip-path">
                  <rect x="9" y="5" rx="10" ry="10" width="81" height="19" />
                  <rect x="107" y="5" rx="3" ry="3" width="19" height="18" />
                  <circle cx="28" cy="67" r="19" />
                  <rect x="311" y="7" rx="4" ry="4" width="58" height="20" />
                  <rect x="381" y="18" rx="0" ry="0" width="40" height="0" />
                  <rect x="74" y="54" rx="0" ry="0" width="192" height="25" />
                  <rect x="6" y="108" rx="0" ry="0" width="123" height="28" />
                  <rect x="164" y="109" rx="0" ry="0" width="122" height="26" />
                  <rect x="314" y="109" rx="0" ry="0" width="77" height="27" />
                  <rect x="379" y="8" rx="7" ry="7" width="19" height="19" />
              </clipPath>
              <linearGradient id="fill">
                <stop
                  offset="0.599964"
                  stop-color="#ecebeb"
                  stop-opacity="1"
                >
                  <animate
                    attributeName="offset"
                    values="-2; -2; 1"
                    keyTimes="0; 0.25; 1"
                    dur="2s"
                    repeatCount="indefinite"
                  ></animate>
                </stop>
                <stop
                  offset="1.59996"
                  stop-color="#ffffff"
                  stop-opacity="1"
                >
                  <animate
                    attributeName="offset"
                    values="-1; -1; 2"
                    keyTimes="0; 0.25; 1"
                    dur="2s"
                    repeatCount="indefinite"
                  ></animate>
                </stop>
                <stop
                  offset="2.59996"
                  stop-color="#ecebeb"
                  stop-opacity="1"
                >
                  <animate
                    attributeName="offset"
                    values="0; 0; 3"
                    keyTimes="0; 0.25; 1"
                    dur="2s"
                    repeatCount="indefinite"
                  ></animate>
                </stop>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </li>
      `;
    } else {
      skeleton += `
      <li class='exercises__skeleton-loader'>
        <div class='card'>
          <div class='cover-image-skeleton'></div>
        </div>
      </li>
      `;
    }
  }
  return skeleton;
}