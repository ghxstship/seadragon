
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Image as NextImage } from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ZoomIn,
  ZoomOut,
  Download,
  RotateCcw,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  FileText,
  Image,
  File,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DocumentMetadata {
  id: string
  name: string
  type: string
  size: number
  url: string
  thumbnail?: string
  pages?: number
  duration?: number
  lastModified?: Date
  author?: string
  description?: string
}

export interface DocumentViewerProps {
  document: DocumentMetadata
  documents?: DocumentMetadata[]
  currentPage?: number
  onPageChange?: (page: number) => void
  onZoomChange?: (zoom: number) => void
  onDownload?: (format?: 'original' | 'pdf' | 'png' | 'jpg') => void
  onFullscreen?: () => void
  onDocumentChange?: (documentId: string) => void
  className?: string
}

// Document type configurations
const documentTypeConfig = {
  pdf: {
    icon: FileText,
    color: 'text-semantic-info',
    bg: 'bg-semantic-info/10',
    label: 'PDF Document'
  },
  doc: {
    icon: FileText,
    color: 'text-accent-primary',
    bg: 'bg-accent-primary/10',
    label: 'Word Document'
  },
  docx: {
    icon: FileText,
    color: 'text-accent-primary',
    bg: 'bg-accent-primary/10',
    label: 'Word Document'
  },
  xls: {
    icon: File,
    color: 'text-semantic-success',
    bg: 'bg-semantic-success/10',
    label: 'Excel Spreadsheet'
  },
  xlsx: {
    icon: File,
    color: 'text-semantic-success',
    bg: 'bg-semantic-success/10',
    label: 'Excel Spreadsheet'
  },
  ppt: {
    icon: File,
    color: 'text-semantic-warning',
    bg: 'bg-semantic-warning/10',
    label: 'PowerPoint Presentation'
  },
  pptx: {
    icon: File,
    color: 'text-semantic-warning',
    bg: 'bg-semantic-warning/10',
    label: 'PowerPoint Presentation'
  },
  jpg: {
    icon: Image,
    color: 'text-semantic-success',
    bg: 'bg-semantic-success/10',
    label: 'JPEG Image'
  },
  jpeg: {
    icon: Image,
    color: 'text-semantic-success',
    bg: 'bg-semantic-success/10',
    label: 'JPEG Image'
  },
  png: {
    icon: Image,
    color: 'text-semantic-success',
    bg: 'bg-semantic-success/10',
    label: 'PNG Image'
  },
  gif: {
    icon: Image,
    color: 'text-semantic-success',
    bg: 'bg-semantic-success/10',
    label: 'GIF Image'
  },
  mp4: {
    icon: Play,
    color: 'text-semantic-error',
    bg: 'bg-semantic-error/10',
    label: 'Video File'
  },
  avi: {
    icon: Play,
    color: 'text-semantic-error',
    bg: 'bg-semantic-error/10',
    label: 'Video File'
  },
  mp3: {
    icon: Volume2,
    color: 'text-accent-primary',
    bg: 'bg-purple-50',
    label: 'Audio File'
  },
  wav: {
    icon: Volume2,
    color: 'text-accent-primary',
    bg: 'bg-purple-50',
    label: 'Audio File'
  },
  default: {
    icon: File,
    color: 'text-muted-foreground',
    bg: 'bg-muted/10',
    label: 'Document'
  }
}

const ImageViewer = ({
  document,
  zoom,
  onZoomChange
}: {
  document: DocumentMetadata
  zoom: number
  onZoomChange: (zoom: number) => void
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative">
        <NextImage
          src={document.url}
          alt={document.name}
          width={800}
          height={600}
          className="max-w-full max-h-full object-contain"
          style={{ transform: `scale(${zoom})` }}/>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center space-x-2 mt-4 p-2 bg-background/80 backdrop-blur rounded-lg">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onZoomChange(Math.max(0.25, zoom - 0.25))}
          disabled={zoom <= 0.25}
        >
          <ZoomOut className="w-4 h-4"/>
        </Button>
        <span className="text-sm font-medium min-w-16 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onZoomChange(Math.min(3, zoom + 0.25))}
          disabled={zoom >= 3}
        >
          <ZoomIn className="w-4 h-4"/>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onZoomChange(1)}
        >
          <RotateCcw className="w-4 h-4"/>
        </Button>
      </div>
    </div>
  )
}

const PDFViewer = ({
  document,
  currentPage,
  totalPages,
  zoom,
  onPageChange,
  onZoomChange
}: {
  document: DocumentMetadata
  currentPage: number
  totalPages: number
  zoom: number
  onPageChange: (page: number) => void
  onZoomChange: (zoom: number) => void
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* PDF Content Placeholder */}
      <div className="flex-1 bg-muted/20 rounded-lg flex items-center justify-center">
        <div className="text-center space-y-4">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto"/>
          <div>
            <h3 className="text-lg font-medium">{document.name}</h3>
            <p className="text-muted-foreground">PDF Preview</p>
            <p className="text-sm text-muted-foreground mt-2">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-4 p-4 bg-background/80 backdrop-blur rounded-lg">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="w-4 h-4"/>
          </Button>
          <span className="text-sm">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="w-4 h-4"/>
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onZoomChange(Math.max(0.5, zoom - 0.25))}
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="w-4 h-4"/>
          </Button>
          <span className="text-sm font-medium min-w-16 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onZoomChange(Math.min(2, zoom + 0.25))}
            disabled={zoom >= 2}
          >
            <ZoomIn className="w-4 h-4"/>
          </Button>
        </div>
      </div>
    </div>
  )
}

const VideoViewer = ({
  document,
  isPlaying,
  volume,
  currentTime,
  duration,
  onPlayPause,
  onVolumeChange,
  onSeek
}: {
  document: DocumentMetadata
  isPlaying: boolean
  volume: number
  currentTime: number
  duration: number
  onPlayPause: () => void
  onVolumeChange: (volume: number) => void
  onSeek: (time: number) => void
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 bg-neutral-900 rounded-lg overflow-hidden relative">
        <video
          ref={videoRef}
          src={document.url}
          className="w-full h-full object-contain"
          onTimeUpdate={() => {
            if (videoRef.current) {
              onSeek(videoRef.current.currentTime)
            }
          }}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              // Duration handling would go here
            }
          }}/>

        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="space-y-2">
            {/* Progress Bar */}
            <div className="w-full bg-background/20 rounded-full h-1">
              <div
                className="bg-accent-primary h-1 rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}/>
            </div>

            <div className="flex items-center justify-between text-primary-foreground">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onPlayPause}
                  className="text-primary-foreground hover:bg-background/20"
                >
                  {isPlaying ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
                </Button>
                <span className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onVolumeChange(volume > 0 ? 0 : 1)}
                  className="text-primary-foreground hover:bg-background/20"
                >
                  {volume > 0 ? <Volume2 className="w-4 h-4"/> : <VolumeX className="w-4 h-4"/>}
                </Button>
                <Input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  className="w-20 h-1 bg-background/20 rounded-full appearance-none cursor-pointer"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const AudioViewer = ({
  document,
  isPlaying,
  volume,
  currentTime,
  duration,
  onPlayPause,
  onVolumeChange,
  onSeek
}: {
  document: DocumentMetadata
  isPlaying: boolean
  volume: number
  currentTime: number
  duration: number
  onPlayPause: () => void
  onVolumeChange: (volume: number) => void
  onSeek: (time: number) => void
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      <div className="text-center space-y-4">
        <Volume2 className="w-24 h-24 text-accent-primary mx-auto"/>
        <div>
          <h3 className="text-xl font-medium">{document.name}</h3>
          <p className="text-muted-foreground">Audio File</p>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={document.url}
        onTimeUpdate={() => {
          if (audioRef.current) {
            onSeek(audioRef.current.currentTime)
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            // Duration handling would go here
          }
        }}/>

      <div className="w-full max-w-md space-y-4">
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-accent-primary h-2 rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}/>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <Button variant="outline" size="lg" onClick={onPlayPause}>
            {isPlaying ? <Pause className="w-6 h-6"/> : <Play className="w-6 h-6"/>}
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onVolumeChange(volume > 0 ? 0 : 1)}
            >
              {volume > 0 ? <Volume2 className="w-4 h-4"/> : <VolumeX className="w-4 h-4"/>}
            </Button>
            <Input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-20 h-1 bg-muted rounded-full appearance-none cursor-pointer"/>
          </div>
        </div>
      </div>
    </div>
  )
}

const GenericViewer = ({ document }: { document: DocumentMetadata }) => {
  const config = documentTypeConfig[document.type as keyof typeof documentTypeConfig] || documentTypeConfig.default
  const Icon = config.icon

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      <div className="text-center space-y-4">
        <div className={cn("w-24 h-24 rounded-lg flex items-center justify-center mx-auto", config.bg)}>
          <Icon className={cn("w-12 h-12", config.color)}/>
        </div>
        <div>
          <h3 className="text-xl font-medium">{document.name}</h3>
          <p className="text-muted-foreground">{config.label}</p>
          <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-muted-foreground">
            <span>Size: {formatFileSize(document.size)}</span>
            {document.lastModified && (
              <span>Last modified: {document.lastModified.toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>

      {document.description && (
        <div className="max-w-md text-center">
          <p className="text-muted-foreground">{document.description}</p>
        </div>
      )}
    </div>
  )
}

export function DocumentViewer({
  document,
  documents = [],
  currentPage = 1,
  onPageChange,
  onZoomChange,
  onDownload,
  onFullscreen,
  onDocumentChange,
  className
}: DocumentViewerProps) {
  return <div>DocumentViewer: {document.name}</div>
}

export default DocumentViewer

// Export types for external usage
export type { DocumentMetadata, DocumentViewerProps }
