import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import styles from './index.module.css'

const features = [
  {
    title: 'Design-System Agnostic',
    description:
      'Use Material Design 3 out of the box, build your own theme system, or mix both. The theme engine adapts to your design language.',
    icon: '🎨',
  },
  {
    title: 'Tree-Shakeable',
    description:
      'Every component has its own subpath export. Import only what you use — your bundle stays lean.',
    icon: '📦',
  },
  {
    title: 'Accessible by Default',
    description:
      'Proper roles, labels, and accessibility states baked into every component. No extra configuration needed.',
    icon: '♿',
  },
  {
    title: 'TypeScript First',
    description:
      'Strict types, full IntelliSense, and autocomplete for every prop, theme token, and style override.',
    icon: '⌨️',
  },
  {
    title: 'Highly Customizable',
    description:
      'Override colors, styles, and variants at every level — theme defaults, component props, or direct style overrides. You have full control.',
    icon: '🔧',
  },
  {
    title: 'CLI Scaffolding',
    description:
      'Copy components directly into your project with the onlynative CLI. Own your code, customize freely.',
    icon: '⚡',
  },
]

function Hero() {
  const { siteConfig } = useDocusaurusContext()

  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
          <p className={styles.heroTagline}>{siteConfig.tagline}</p>
          <p className={styles.heroSubtext}>
            Ships with Material Design 3. Works with Expo and bare React Native.
          </p>
          <div className={styles.heroCtas}>
            <Link className={styles.ctaPrimary} to="/introduction">
              Get Started
            </Link>
            <Link
              className={styles.ctaSecondary}
              href="https://github.com/onlynative/ui"
            >
              GitHub
            </Link>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroImagePlaceholder}>
            <div className={styles.phoneMockup}>
              <div className={styles.phoneMockupScreen}>
                <div className={styles.mockAppBar}>
                  <div className={styles.mockAppBarTitle} />
                </div>
                <div className={styles.mockContent}>
                  <div className={styles.mockCard}>
                    <div className={styles.mockCardMedia} />
                    <div className={styles.mockCardBody}>
                      <div className={styles.mockCardTitle} />
                      <div className={styles.mockCardSubtitle} />
                    </div>
                  </div>
                  <div className={styles.mockButton} />
                </div>
                <div className={styles.mockFab}>
                  <div className={styles.mockFabIcon} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function InstallSnippet() {
  return (
    <section className={styles.install}>
      <div className={styles.installInner}>
        <div className={styles.installCode}>
          <div className={styles.codeHeader}>
            <span className={styles.codeDot} data-color="red" />
            <span className={styles.codeDot} data-color="yellow" />
            <span className={styles.codeDot} data-color="green" />
          </div>
          <pre className={styles.codePre}>
            <code>
              <span className={styles.codeComment}>
                # Create a new project in seconds
              </span>
              {'\n'}
              <span className={styles.codePrompt}>$</span> npx onlynative create
              my-app
              {'\n'}
              <span className={styles.codePrompt}>$</span> cd my-app
              {'\n'}
              <span className={styles.codePrompt}>$</span> npx expo start
            </code>
          </pre>
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section className={styles.features}>
      <div className={styles.featuresInner}>
        <h2 className={styles.sectionTitle}>Why OnlyNative?</h2>
        <p className={styles.sectionSubtitle}>
          Everything you need to build beautiful, accessible React Native apps.
        </p>
        <div className={styles.featuresGrid}>
          {features.map((feature) => (
            <div key={feature.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CodePreview() {
  return (
    <section className={styles.codePreview}>
      <div className={styles.codePreviewInner}>
        <div className={styles.codePreviewText}>
          <h2 className={styles.sectionTitle}>Simple API, Powerful Results</h2>
          <p className={styles.sectionSubtitle}>
            Theme-aware components with a clean, intuitive API. Wrap your app
            once and start building.
          </p>
          <Link className={styles.ctaPrimary} to="/introduction">
            Read the Docs
          </Link>
        </div>
        <div className={styles.codePreviewCode}>
          <div className={styles.codeHeader}>
            <span className={styles.codeDot} data-color="red" />
            <span className={styles.codeDot} data-color="yellow" />
            <span className={styles.codeDot} data-color="green" />
            <span className={styles.codeFilename}>App.tsx</span>
          </div>
          <pre className={styles.codePre}>
            <code>
              <span className={styles.codeKeyword}>import</span>
              {' { ThemeProvider } '}
              <span className={styles.codeKeyword}>from</span>
              {" '@onlynative/core'\n"}
              <span className={styles.codeKeyword}>import</span>
              {' { Button } '}
              <span className={styles.codeKeyword}>from</span>
              {" '@onlynative/components/button'\n\n"}
              <span className={styles.codeKeyword}>export default</span>{' '}
              <span className={styles.codeFunction}>function</span>
              {' App() {\n'}
              {'  '}
              <span className={styles.codeKeyword}>return</span>
              {' (\n'}
              {'    <'}
              <span className={styles.codeTag}>ThemeProvider</span>
              {'>\n'}
              {'      <'}
              <span className={styles.codeTag}>Button</span>
              {'\n'}
              {'        '}
              <span className={styles.codeProp}>variant</span>
              {'='}
              <span className={styles.codeString}>&quot;filled&quot;</span>
              {'\n'}
              {'        '}
              <span className={styles.codeProp}>onPress</span>
              {'={() => console.log('}
              <span className={styles.codeString}>&apos;Hello!&apos;</span>
              {')}\n'}
              {'      >\n'}
              {'        Get Started\n'}
              {'      </'}
              <span className={styles.codeTag}>Button</span>
              {'>\n'}
              {'    </'}
              <span className={styles.codeTag}>ThemeProvider</span>
              {'>\n'}
              {'  )\n'}
              {'}'}
            </code>
          </pre>
        </div>
      </div>
    </section>
  )
}

function BottomCta() {
  return (
    <section className={styles.bottomCta}>
      <div className={styles.bottomCtaInner}>
        <h2 className={styles.bottomCtaTitle}>Ready to build?</h2>
        <p className={styles.bottomCtaText}>
          Get up and running in minutes with the CLI or install packages
          directly.
        </p>
        <div className={styles.heroCtas}>
          <Link className={styles.ctaPrimary} to="/quick-start">
            Quick Start
          </Link>
          <Link className={styles.ctaSecondary} to="/installation">
            Installation Guide
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Home(): React.ReactNode {
  const { siteConfig } = useDocusaurusContext()

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <Hero />
      <main>
        <InstallSnippet />
        <Features />

        <CodePreview />
        <BottomCta />
      </main>
    </Layout>
  )
}
