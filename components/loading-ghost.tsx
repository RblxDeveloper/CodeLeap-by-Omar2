'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Brain } from 'lucide-react'

export function LoadingGhost() {
  return (
    <Card className="shadow-lg border-0 bg-white dark:bg-gray-900">
      <CardContent className="p-6 space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600 animate-pulse" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>

        {/* Problem skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Code block skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* Explanation skeleton */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 p-4 rounded-lg space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        {/* Loading message */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center space-x-2 text-purple-600 dark:text-purple-400">
            <Brain className="h-6 w-6 animate-pulse" />
            <span className="text-lg font-medium animate-pulse">AI is crafting your challenge...</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            This may take a few seconds
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
