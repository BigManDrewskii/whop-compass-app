import Link from 'next/link'
import { ArrowRight, CheckCircle, Zap, Users, Layout } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#141212]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#262626] via-[#141212] to-[#141212]" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-32 sm:pb-32">
          {/* Logo/Brand */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-[#fa4616] rounded-2xl flex items-center justify-center shadow-2xl">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
          </div>

          {/* Hero Text */}
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#fafafa] mb-6">
              Card-Based Onboarding
              <br />
              <span className="text-[#fa4616]">Made Simple</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
              Create beautiful, interactive onboarding experiences for your Whop community with elegant card-based flows.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#features"
                className="inline-flex items-center px-8 py-4 bg-[#fa4616] hover:bg-[#e03d12] text-white text-lg font-semibold rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl group"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#demo"
                className="inline-flex items-center px-8 py-4 bg-[#262626] hover:bg-[#333333] border border-[#7f7f7f]/20 hover:border-[#fa4616]/50 text-white text-lg font-semibold rounded-xl transition-all duration-200"
              >
                View Demo
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { number: '10K+', label: 'Active Users' },
              { number: '99.9%', label: 'Uptime' },
              { number: '24/7', label: 'Support' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-[#fa4616] mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#262626]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#fafafa] mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful features to create engaging onboarding experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Layout className="w-6 h-6" />,
                title: 'Elegant Card Layouts',
                description: 'Choose from multiple layout options including centered cards, full-screen, and split views.',
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Interactive Elements',
                description: 'Add CTA buttons, forms, quizzes, and more to engage your users.',
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Role-Based Content',
                description: 'Show different content to admins and members with conditional visibility.',
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: 'Rich Media Support',
                description: 'Embed images, videos, and rich text content in your onboarding cards.',
              },
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>,
                title: 'Theme Customization',
                description: 'Full control over colors, fonts, and styling to match your brand.',
              },
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
                title: 'Mobile Responsive',
                description: 'Looks perfect on all devices with optimized mobile layouts.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-[#262626] border border-[#7f7f7f]/20 rounded-2xl p-8 hover:border-[#fa4616]/30 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-[#fa4616]/20 border border-[#fa4616] rounded-xl flex items-center justify-center text-[#fa4616] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#fafafa] mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="demo" className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-[#fa4616] to-[#e03d12] rounded-3xl p-12 sm:p-16 shadow-2xl">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of communities using Compass to create amazing onboarding experiences.
            </p>
            <a
              href="https://whop.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-100 text-[#fa4616] text-lg font-semibold rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl group"
            >
              Install Compass App
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#262626]/50 border-t border-[#7f7f7f]/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-[#fafafa] font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-[#fa4616] transition-colors">Features</a></li>
                <li><a href="#demo" className="text-gray-400 hover:text-[#fa4616] transition-colors">Demo</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#fa4616] transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#fafafa] font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="https://docs.whop.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#fa4616] transition-colors">Documentation</a></li>
                <li><a href="https://docs.whop.com/apps" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#fa4616] transition-colors">Developer Guide</a></li>
                <li><a href="https://whop.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#fa4616] transition-colors">Whop Platform</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#fafafa] font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="https://whop.com/about" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#fa4616] transition-colors">About</a></li>
                <li><a href="https://whop.com/blog" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#fa4616] transition-colors">Blog</a></li>
                <li><a href="https://whop.com/careers" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#fa4616] transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#fafafa] font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="https://whop.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#fa4616] transition-colors">Privacy</a></li>
                <li><a href="https://whop.com/terms" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#fa4616] transition-colors">Terms</a></li>
                <li><a href="https://whop.com/security" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#fa4616] transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#7f7f7f]/20 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Compass by Whop. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="https://twitter.com/whop" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#fa4616] transition-colors">
                Twitter
              </a>
              <a href="https://github.com/whopio" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#fa4616] transition-colors">
                GitHub
              </a>
              <a href="https://discord.gg/whop" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#fa4616] transition-colors">
                Discord
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
