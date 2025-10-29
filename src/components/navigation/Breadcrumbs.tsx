'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
}

export function Breadcrumbs() {
  const pathname = usePathname()

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    let currentPath = ''

    for (let i = 0; i < paths.length; i++) {
      const segment = paths[i]
      currentPath += `/${segment}`

      // Skip UUIDs and technical segments
      if (segment.startsWith('exp_') || segment.startsWith('user_')) {
        continue
      }

      // Format the label
      let label = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      // Handle specific routes
      if (segment === 'experiences' && paths[i + 1]) {
        label = 'Experience'
        // Include the experience ID in the path but not the label
        currentPath += `/${paths[i + 1]}`
        i++ // Skip the next segment since we've processed it
      }

      breadcrumbs.push({
        label,
        href: currentPath,
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Don't show breadcrumbs on home page
  if (pathname === '/') {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
      {/* Home Link */}
      <Link
        href="/"
        className="text-gray-400 hover:text-[#fa4616] transition-colors flex items-center"
      >
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>

      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1

        return (
          <div key={item.href} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-gray-600" />
            {isLast ? (
              <span className="text-[#fafafa] font-medium">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-400 hover:text-[#fa4616] transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
