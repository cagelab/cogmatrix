import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";

export const metadata = {
  title: {
    default: "CogMatrix Docs",
    template: "%s | CogMatrix Docs",
  },
  description: "Documentation for CogMatrix projects and workflows.",
};

const banner = (
  <Banner storageKey="cogmatrix-docs-banner">Welcome to CogMatrix Docs</Banner>
);
const navbar = <Navbar logo={<b>CogMatrix Docs</b>} />;
const footer = <Footer>{new Date().getFullYear()} © CogMatrix.</Footer>;

export default async function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
