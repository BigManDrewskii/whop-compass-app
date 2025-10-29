import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typedRoutes: true,
  async headers() {
    const isDev = process.env.NODE_ENV === 'development'

    // Allow iframe embedding in development, restrict in production
    if (isDev) {
      return []
    }

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.whop.com https://*.apps.whop.com",
          },
        ],
      },
    ]
  },
}

export default nextConfig
