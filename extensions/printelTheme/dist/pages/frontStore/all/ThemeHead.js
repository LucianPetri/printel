import React from 'react';
const iconSrc = '/assets/branding/printel-logo.jpeg';
const frontStoreLogoSrc = '/assets/branding/logo_plus_text.svg';
export default function ThemeHead() {
    return (React.createElement(React.Fragment, null,
        React.createElement("link", { rel: "icon", href: iconSrc, type: "image/jpeg" }),
        React.createElement("link", { rel: "apple-touch-icon", href: iconSrc }),
        React.createElement("link", { rel: "preload", as: "image", href: frontStoreLogoSrc }),
        React.createElement("meta", { name: "theme-color", content: "#66D878" }),
        React.createElement("style", null, `
        :root {
          --background: oklch(0.992 0.012 130);
          --foreground: oklch(0.29 0.03 162);
          --card: oklch(0.987 0.014 130);
          --card-foreground: oklch(0.29 0.03 162);
          --popover: oklch(0.99 0.014 130);
          --popover-foreground: oklch(0.29 0.03 162);
          --primary: oklch(0.82 0.18 148);
          --primary-foreground: oklch(0.28 0.03 160);
          --secondary: oklch(0.967 0.022 125);
          --secondary-foreground: oklch(0.31 0.03 160);
          --muted: oklch(0.966 0.014 138);
          --muted-foreground: oklch(0.53 0.018 160);
          --accent: oklch(0.93 0.17 98);
          --accent-foreground: oklch(0.46 0.07 95);
          --border: oklch(0.92 0.02 145);
          --divider: oklch(0.92 0.02 145);
          --input: oklch(0.955 0.018 145);
          --ring: oklch(0.82 0.18 148);
          --sidebar: oklch(0.98 0.018 130);
          --sidebar-foreground: oklch(0.29 0.03 162);
          --sidebar-primary: oklch(0.82 0.18 148);
          --sidebar-primary-foreground: oklch(0.28 0.03 160);
          --sidebar-accent: oklch(0.95 0.024 125);
          --sidebar-accent-foreground: oklch(0.29 0.03 162);
          --sidebar-border: oklch(0.92 0.02 145);
          --sidebar-ring: oklch(0.82 0.18 148);
        }

        body {
          font-family: 'Avenir Next', 'Trebuchet MS', 'Segoe UI', sans-serif;
          background:
            radial-gradient(circle at top left, rgba(102, 216, 120, 0.24), transparent 30%),
            radial-gradient(circle at 82% 12%, rgba(255, 215, 0, 0.16), transparent 16%),
            radial-gradient(circle at right top, rgba(215, 186, 255, 0.22), transparent 28%),
            linear-gradient(135deg, #f5fff3 0%, #f2fbff 48%, #fbf1ff 100%);
          color: var(--foreground);
        }

        .header {
          position: sticky;
          top: 0;
          z-index: 40;
          padding-top: 0.85rem;
          padding-bottom: 0.85rem;
          background: rgba(255, 255, 255, 0.74);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(102, 216, 120, 0.18);
          box-shadow: 0 18px 40px rgba(91, 160, 111, 0.12);
        }

        .header__middle {
          max-width: 1240px;
          margin: 0 auto;
          align-items: center;
          gap: 1rem;
        }

        .header__middle__left,
        .header__middle__center,
        .header__middle__right {
          min-width: 0;
        }

        .header__middle__center .logo {
          padding: 0.45rem 1rem;
          border-radius: 999px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(216, 245, 220, 0.88));
          border: 1px solid rgba(102, 216, 120, 0.22);
          box-shadow: 0 14px 32px rgba(85, 158, 105, 0.16);
        }

        .header__middle__center .logo img {
          display: block;
          width: auto;
          height: clamp(3.6rem, 8vw, 5.15rem);
          object-fit: contain;
        }

        .header__middle__center .logo svg {
          display: none;
        }

        .header__middle__left nav a,
        .header__middle__right a,
        .header__middle__right button {
          border-radius: 999px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
        }

        .header__middle__left nav a:hover,
        .header__middle__right a:hover,
        .header__middle__right button:hover {
          transform: translateY(-1px);
        }

        .header__middle__right .search__icon,
        .header__middle__right [href*='account'],
        .header__middle__right button {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(102, 216, 120, 0.14);
          box-shadow: 0 10px 24px rgba(91, 160, 111, 0.08);
        }

        .header__middle__right .search__icon,
        .header__middle__right [href*='account'] {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.55rem;
        }

        .header__middle__right button {
          padding: 0.55rem;
        }

        .header__middle svg,
        .header__middle a {
          color: #458b58;
        }

        input[type='email'],
        input[type='password'],
        input[type='tel'],
        input[type='text'],
        select,
        textarea {
          border-radius: 1rem;
          border-color: rgba(102, 216, 120, 0.18);
          background: rgba(255, 255, 255, 0.86);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
        }

        [data-slot='button'] {
          box-shadow: 0 14px 28px rgba(91, 160, 111, 0.14);
        }

        main.content {
          padding-bottom: 3rem;
        }

        main.content .slideshow-widget {
          max-width: 1260px;
          margin: 1rem auto 3rem;
          padding: 0 1.25rem;
        }

        main.content .slideshow-widget .slick-list,
        main.content .slideshow-widget .slide__wrapper {
          border-radius: 2rem;
          overflow: hidden;
          box-shadow: 0 30px 70px rgba(91, 160, 111, 0.18);
        }

        main.content .slideshow-widget [aria-label^='Slide'] {
          background: rgba(255, 255, 255, 0.58) !important;
          color: #458b58 !important;
          border: 1px solid rgba(102, 216, 120, 0.18);
          backdrop-filter: blur(10px);
        }

        main.content .slideshow-widget [aria-label^='Slide']:hover {
          background: rgba(255, 255, 255, 0.86) !important;
        }

        .footer {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(241, 251, 243, 0.94));
          border-top: 1px solid rgba(102, 216, 120, 0.16);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
        }

        .footer__middle,
        .footer__bottom {
          max-width: 1240px;
          margin: 0 auto;
          padding-left: 1.25rem;
          padding-right: 1.25rem;
        }

        .footer .card-icons > div {
          border-radius: 0.95rem;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(102, 216, 120, 0.12);
          box-shadow: 0 10px 24px rgba(91, 160, 111, 0.08);
          padding: 0.15rem 0.45rem;
        }

        @media (max-width: 767px) {
          .header__middle {
            grid-template-columns: auto minmax(0, 1fr) auto;
            gap: 0.5rem;
          }

          .header__middle__center {
            justify-content: flex-start;
          }

          .header__middle__center .logo {
            padding: 0.35rem 0.75rem;
          }

          .header__middle__center .logo img {
            height: 2.8rem;
          }

          main.content .slideshow-widget {
            padding: 0 1rem;
          }

          .footer__middle,
          .footer__bottom {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `)));
}
export const layout = {
    areaId: 'head',
    sortOrder: 100
};
//# sourceMappingURL=ThemeHead.js.map