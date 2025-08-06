'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, XCircle, History, TrendingUp, Target, Code } from 'lucide-react'
import { Challenge } from '@/app/page'

interface ChallengeHistoryProps {
  challenges: Challenge[]
}

export function ChallengeHistory({ challenges }: ChallengeHistoryProps) {
  const answeredChallenges = challenges.filter(c => c.userAnswer !== undefined)
  const correctAnswers = answeredChallenges.filter(c => c.userAnswer === c.isCorrect)
  const accuracy = answeredChallenges.length > 0 ? Math.round((correctAnswers.length / answeredChallenges.length) * 100) : 0

  const getLanguageIcon = (language: string) => {
    switch (language) {
      case 'javascript': return '🟨'
      case 'html': return '🟧'
      case 'css': return '🟦'
      default: return '📄'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500'
      case 'medium': return 'bg-yellow-500'
      case 'hard': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  if (challenges.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Challenges Yet</h3>
          <p className="text-muted-foreground mb-4">
            Complete some challenges to see your progress here!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Answered</p>
                <p className="text-2xl font-bold">{answeredChallenges.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Accuracy</p>
                <p className="text-2xl font-bold">{accuracy}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Correct</p>
                <p className="text-2xl font-bold">{correctAnswers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Incorrect</p>
                <p className="text-2xl font-bold">{answeredChallenges.length - correctAnswers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown by Difficulty and Language */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">By Difficulty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {['easy', 'medium', 'hard'].map(difficulty => {
              const count = challenges.filter(c => c.difficulty === difficulty).length
              return (
                <div key={difficulty} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getDifficultyColor(difficulty)}`}></div>
                    <span className="capitalize font-medium">{difficulty}</span>
                  </div>
                  <Badge variant="outline">{count}</Badge>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">By Language</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {['javascript', 'html', 'css'].map(language => {
              const count = challenges.filter(c => c.language === language).length
              return (
                <div key={language} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>{getLanguageIcon(language)}</span>
                    <span className="capitalize font-medium">{language}</span>
                  </div>
                  <Badge variant="outline">{count}</Badge>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Challenge History List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Recent Challenges</span>
          </CardTitle>
          <CardDescription>
            Your challenge history with results and explanations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {challenges.map((challenge, index) => {
                const isCorrect = challenge.userAnswer === challenge.isCorrect
                const hasAnswer = challenge.userAnswer !== undefined
                
                return (
                  <div key={challenge.id} className="border rounded-lg p-4 space-y-3">
                    {/* Challenge Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <span>{getLanguageIcon(challenge.language)}</span>
                          <span className="capitalize">{challenge.language}</span>
                        </Badge>
                        <Badge className={`text-white ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        {hasAnswer && (
                          <div className={`flex items-center space-x-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            {isCorrect ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                            <span className="text-sm font-medium">
                              {isCorrect ? 'Correct' : 'Incorrect'}
                            </span>
                          </div>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {new Date(challenge.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Problem Statement */}
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {challenge.problem}
                    </p>

                    {/* Code Preview */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 font-mono text-sm overflow-x-auto">
                      <pre className="whitespace-pre-wrap">
                        {challenge.code.length > 200 
                          ? challenge.code.substring(0, 200) + '...'
                          : challenge.code
                        }
                      </pre>
                    </div>

                    {/* Answer Details */}
                    {hasAnswer && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            <strong>Your answer:</strong> {challenge.userAnswer ? 'Correct' : 'Incorrect'}
                          </span>
                          <span>
                            <strong>Actual:</strong> {challenge.isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                        
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded text-sm">
                          <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                            {challenge.isCorrect ? '✅ Explanation:' : '❌ Why it\'s incorrect:'}
                          </p>
                          <p className="text-blue-700 dark:text-blue-300">
                            {challenge.explanation}
                          </p>
                        </div>
                      </div>
                    )}

                    {index < challenges.length - 1 && <Separator className="mt-4" />}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
