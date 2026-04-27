import React from 'react';
const iconSrc = '/assets/branding/printel-logo.jpeg';
const adminLogoSrc = '/assets/branding/logo_only.svg';
export default function ThemeHead() {
    React.useEffect(()=>{
        const replaceAdminLogo = ()=>{
            const adminLogoLink = document.querySelector('.header .printel-admin-logo a');
            if (adminLogoLink) {
                adminLogoLink.setAttribute('aria-label', 'Printel admin');
                adminLogoLink.style.display = 'inline-flex';
                adminLogoLink.style.alignItems = 'center';
                adminLogoLink.style.width = '100%';
                adminLogoLink.style.minWidth = '8.75rem';
                adminLogoLink.style.height = '2.75rem';
            }
            const loginForm = document.querySelector('.admin-login-form');
            if (!loginForm) {
                return;
            }
            const existingBrand = loginForm.querySelector('[data-printel-login-brand]');
            if (!existingBrand) {
                const logoBlock = document.createElement('div');
                logoBlock.setAttribute('data-printel-login-brand', 'true');
                logoBlock.style.height = '7rem';
                logoBlock.style.marginBottom = '1.5rem';
                logoBlock.style.background = `url(${adminLogoSrc}) center / contain no-repeat`;
                loginForm.prepend(logoBlock);
            }
            const legacyLogo = loginForm.querySelector('div.flex.items-center.justify-center.mb-7');
            if (legacyLogo) {
                legacyLogo.style.display = 'none';
            }
        };
        replaceAdminLogo();
        const frame = window.requestAnimationFrame(replaceAdminLogo);
        return ()=>window.cancelAnimationFrame(frame);
    }, []);
    return /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("link", {
        rel: "icon",
        href: iconSrc,
        type: "image/jpeg"
    }), /*#__PURE__*/ React.createElement("link", {
        rel: "apple-touch-icon",
        href: iconSrc
    }), /*#__PURE__*/ React.createElement("link", {
        rel: "preload",
        as: "image",
        href: adminLogoSrc
    }), /*#__PURE__*/ React.createElement("meta", {
        name: "theme-color",
        content: "#66D878"
    }), /*#__PURE__*/ React.createElement("style", null, `
        :root {
          --background: oklch(0.992 0.01 135);
          --foreground: oklch(0.3 0.03 160);
          --card: oklch(0.988 0.012 132);
          --card-foreground: oklch(0.3 0.03 160);
          --popover: oklch(0.99 0.012 132);
          --popover-foreground: oklch(0.3 0.03 160);
          --primary: oklch(0.82 0.18 148);
          --primary-foreground: oklch(0.29 0.03 160);
          --secondary: oklch(0.965 0.02 130);
          --secondary-foreground: oklch(0.31 0.03 160);
          --muted: oklch(0.962 0.016 135);
          --muted-foreground: oklch(0.54 0.018 160);
          --accent: oklch(0.93 0.17 98);
          --accent-foreground: oklch(0.46 0.07 95);
          --border: oklch(0.92 0.018 145);
          --divider: oklch(0.91 0.018 145);
          --input: oklch(0.955 0.015 145);
          --ring: oklch(0.82 0.18 148);
          --sidebar: oklch(0.978 0.016 132);
          --sidebar-foreground: oklch(0.3 0.03 160);
          --sidebar-primary: oklch(0.82 0.18 148);
          --sidebar-primary-foreground: oklch(0.29 0.03 160);
          --sidebar-accent: oklch(0.95 0.024 125);
          --sidebar-accent-foreground: oklch(0.3 0.03 160);
          --sidebar-border: oklch(0.91 0.018 145);
          --sidebar-ring: oklch(0.82 0.18 148);
        }

        body {
          font-family: 'Avenir Next', 'Trebuchet MS', 'Segoe UI', sans-serif;
          background:
            radial-gradient(circle at top left, rgba(102, 216, 120, 0.24), transparent 30%),
            radial-gradient(circle at 82% 12%, rgba(255, 215, 0, 0.16), transparent 16%),
            radial-gradient(circle at right top, rgba(215, 186, 255, 0.22), transparent 28%),
            linear-gradient(135deg, #f5fff3 0%, #f3fbff 48%, #fbf1ff 100%);
          color: var(--foreground);
        }

        .header {
          align-items: center;
          gap: 1rem;
          padding: 0 1.25rem;
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(102, 216, 120, 0.2);
          box-shadow: 0 16px 34px rgba(92, 169, 116, 0.12);
        }

        body.admin .header > .printel-admin-logo,
        body.adminLogin .header > .printel-admin-logo {
          width: auto;
          height: auto;
          flex: 0 0 auto;
        }

        body.admin .header > .printel-admin-logo a,
        body.adminLogin .header > .printel-admin-logo a {
          display: inline-flex !important;
          align-items: center;
          justify-content: flex-start;
          width: auto !important;
          min-width: 0;
          height: auto !important;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #2f7a4b;
          text-decoration: none;
        }

        body.admin .header > .printel-admin-logo img,
        body.adminLogin .header > .printel-admin-logo img {
          display: none;
        }

        body.admin .header > .logo:not(.printel-admin-logo),
        body.adminLogin .header > .logo:not(.printel-admin-logo) {
          display: none !important;
        }

        body.admin .header > .logo svg,
        body.admin .header > .logo a > svg,
        body.adminLogin .header > .logo svg,
        body.adminLogin .header > .logo a > svg {
          display: none !important;
          visibility: hidden !important;
        }

        .header > .relative.self-center {
          margin-left: 2rem !important;
          width: min(32rem, calc(100vw - 29rem)) !important;
        }

        .header > .relative.self-center > div:first-child {
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid rgba(102, 216, 120, 0.18);
          border-radius: 999px;
          box-shadow: 0 12px 30px rgba(90, 158, 110, 0.1);
        }

        .header input {
          background: transparent;
        }

        .admin-user {
          gap: 0.75rem;
        }

        .admin-navigation {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.84), rgba(242, 252, 243, 0.97));
          backdrop-filter: blur(16px);
          border-right: 1px solid rgba(102, 216, 120, 0.18);
          box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.7);
          padding-right: 0.5rem;
        }

        .admin-nav-container {
          padding: 0.85rem 0.45rem 1.5rem;
        }

        .admin-nav > ul {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          padding-bottom: 0.9rem;
        }

        .admin-nav > ul > li {
          margin-top: 0 !important;
        }

        .admin-nav > ul > li.root-nav-item:last-child {
          display: none;
        }

        .admin-nav .root-label {
          color: #6f8d75;
          letter-spacing: 0.12em;
          font-size: 0.69rem;
        }

        .admin-nav li span,
        .admin-navigation li a {
          line-height: 1.3;
          font-size: 0.96rem;
        }

        .nav-item > a,
        .nav-item .root-label {
          display: flex;
          align-items: center;
          margin-left: 0;
          min-height: 2.3rem;
          padding: 0.48rem 0.85rem;
          border-radius: 0.95rem;
        }

        .nav-item .root-label a {
          display: inline-flex;
          align-items: center;
          flex: 1 1 auto;
          min-width: 0;
          color: inherit;
          text-decoration: none;
        }

        .nav-item .menu-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.2rem;
        }

        .nav-item .menu-icon svg,
        .root-label svg {
          width: 0.98rem;
          height: 0.98rem;
        }

        .root-nav-item .item-group {
          margin-top: 0.25rem;
        }

        .root-nav-item .item-group .nav-item > a {
          padding-left: 1.55rem;
        }

        .nav-item > a:hover {
          background: rgba(102, 216, 120, 0.12);
        }

        .nav-item.active::before {
          left: 0.15rem;
          border-radius: 999px;
          background: linear-gradient(180deg, #66d878, #ffd700);
        }

        .nav-item.active a {
          background: linear-gradient(135deg, rgba(102, 216, 120, 0.16), rgba(255, 215, 0, 0.14));
          color: #3f8758;
          box-shadow: inset 0 0 0 1px rgba(102, 216, 120, 0.18);
        }

        .content-wrapper .main-content {
          background: transparent;
        }

        .content-wrapper .main-content .main-content-inner {
          padding: 1.5rem 2rem;
        }

        .main-content-inner [data-slot='card'],
        .main-content-inner .card,
        .main-content-inner form {
          border-radius: 1.25rem;
        }

        .main-content-inner [data-slot='card'] {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(102, 216, 120, 0.14);
          box-shadow: 0 18px 38px rgba(91, 156, 111, 0.1);
          backdrop-filter: blur(12px);
        }

        .footer {
          color: #6b8674;
          border-top-color: rgba(102, 216, 120, 0.16);
        }

        body.adminLogin .main-content-inner {
          min-height: 100vh;
          padding: 2rem;
        }

        body.adminLogin .admin-login-form {
          position: relative;
          width: min(31rem, 92vw);
          max-width: min(31rem, 92vw);
          border-radius: 1.5rem;
          border: 1px solid rgba(102, 216, 120, 0.18);
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(18px);
          box-shadow: 0 30px 80px rgba(84, 158, 104, 0.16);
        }

        body.adminLogin .admin-login-form > div:first-of-type {
          display: none !important;
        }

        body.adminLogin .admin-login-form::before {
          content: '';
          display: block !important;
          height: 7rem;
          margin-bottom: 1.5rem;
          background: url(${adminLogoSrc}) center / contain no-repeat;
        }

        body.adminLogin .admin-login-form .form-submit-button button {
          width: 100%;
        }

        @media (max-width: 1024px) {
          .header > .relative.self-center {
            margin-left: 1rem !important;
            width: calc(100vw - 20rem) !important;
          }
        }

        @media (max-width: 767px) {
          .header {
            padding: 0 0.75rem;
          }

          .header > .logo {
            width: 7.5rem;
          }

          .header > .logo a {
            height: 2.15rem;
          }

          .header > .relative.self-center {
            display: none;
          }

          .admin-navigation {
            width: 100%;
            height: auto;
            position: static;
            padding-bottom: 1rem;
          }

          .content-wrapper .main-content {
            margin-left: 0;
          }

          .content-wrapper .main-content .main-content-inner {
            padding: 1rem;
          }

          body.adminLogin .main-content-inner {
            padding: 1rem;
          }
        }
      `));
}
export const layout = {
    areaId: 'head',
    sortOrder: 100
};
