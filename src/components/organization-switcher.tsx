
'use client'

import { useState } from 'react'
import { useMultiTenancy } from '@/lib/multi-tenancy'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Building2, ChevronDown, Plus, Settings, Users } from 'lucide-react'
import Link from 'next/link'

export function OrganizationSwitcher() {
  const {
    currentOrganization,
    currentWorkspace,
    userOrganizations,
    availableWorkspaces,
    setCurrentOrganization,
    setCurrentWorkspace,
    isLoading
  } = useMultiTenancy()

  const [isOpen, setIsOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2">
        <div className="h-8 w-8 bg-muted animate-pulse rounded"/>
        <div className="h-4 w-24 bg-muted animate-pulse rounded"/>
      </div>
    )
  }

  if (!currentOrganization) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link href="/auth/login">
          <Building2 className="h-4 w-4 mr-2"/>
          Select Organization
        </Link>
      </Button>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 px-3 py-2 h-auto">
          <Avatar className="h-6 w-6">
            <AvatarImage src={(currentOrganization as any).logo?.primary}/>
            <AvatarFallback>
              {currentOrganization.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium truncate max-w-32">
              {currentOrganization.name}
            </span>
            {currentWorkspace && (
              <span className="text-xs text-muted-foreground truncate max-w-32">
                {currentWorkspace.name}
              </span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground"/>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>

        {/* Current Organization */}
        <DropdownMenuItem className="flex items-center space-x-2 p-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={(currentOrganization as any).logo?.primary}/>
            <AvatarFallback>
              {currentOrganization.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{currentOrganization.name}</span>
            <Badge variant="secondary" className="w-fit text-xs">
              Current
            </Badge>
          </div>
        </DropdownMenuItem>

        {/* Other Organizations */}
        {userOrganizations
          .filter(org => org.id !== currentOrganization.id)
          .map((org) => (
            <DropdownMenuItem
              key={org.id}
              className="flex items-center space-x-2 p-3 cursor-pointer"
              onClick={() => {
                setCurrentOrganization(org)
                setIsOpen(false)
              }}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={(org as any).logo?.primary}/>
                <AvatarFallback>
                  {org.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{org.name}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {(org.role as any)?.name || org.role}
                </span>
              </div>
            </DropdownMenuItem>
          ))}

        <DropdownMenuSeparator/>

        {/* Create Organization */}
        <DropdownMenuItem asChild>
          <Link href="/organizations/create" className="flex items-center space-x-2 p-3">
            <Plus className="h-4 w-4"/>
            <span>Create Organization</span>
          </Link>
        </DropdownMenuItem>

        {/* Manage Organizations */}
        <DropdownMenuItem asChild>
          <Link href="/organizations" className="flex items-center space-x-2 p-3">
            <Settings className="h-4 w-4"/>
            <span>Manage Organizations</span>
          </Link>
        </DropdownMenuItem>

        {/* Workspace Section */}
        {availableWorkspaces.length > 0 && (
          <>
            <DropdownMenuSeparator/>
            <DropdownMenuLabel className="flex items-center space-x-2">
              <Users className="h-4 w-4"/>
              <span>Workspaces</span>
            </DropdownMenuLabel>

            {/* Current Workspace */}
            {currentWorkspace && (
              <DropdownMenuItem className="flex items-center space-x-2 p-3">
                <div className="h-2 w-2 bg-accent-primary rounded-full"/>
                <span className="font-medium">{currentWorkspace.name}</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  Current
                </Badge>
              </DropdownMenuItem>
            )}

            {/* Other Workspaces */}
            {availableWorkspaces
              .filter(workspace => workspace.id !== currentWorkspace?.id)
              .map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  className="flex items-center space-x-2 p-3 cursor-pointer"
                  onClick={() => {
                    setCurrentWorkspace(workspace)
                    setIsOpen(false)
                  }}
                >
                  <div className="h-2 w-2 bg-muted rounded-full"/>
                  <span>{workspace.name}</span>
                </DropdownMenuItem>
              ))}

            {/* No Workspace Selected */}
            {!currentWorkspace && (
              <DropdownMenuItem
                className="flex items-center space-x-2 p-3 cursor-pointer text-muted-foreground"
                onClick={() => {
                  setCurrentWorkspace(null)
                  setIsOpen(false)
                }}
              >
                <div className="h-2 w-2 border border-muted rounded-full"/>
                <span>No workspace selected</span>
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Workspace-only switcher for when organization is fixed
export function WorkspaceSwitcher() {
  const {
    currentWorkspace,
    availableWorkspaces,
    setCurrentWorkspace
  } = useMultiTenancy()

  const [isOpen, setIsOpen] = useState(false)

  if (availableWorkspaces.length === 0) {
    return null
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
          <Users className="h-4 w-4"/>
          <span className="hidden sm:inline">
            {currentWorkspace?.name || 'Select Workspace'}
          </span>
          <ChevronDown className="h-4 w-4"/>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>

        {availableWorkspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            className="cursor-pointer"
            onClick={() => {
              setCurrentWorkspace(workspace)
              setIsOpen(false)
            }}
          >
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${
                workspace.id === currentWorkspace?.id
                  ? 'bg-accent-primary'
                  : 'bg-muted'
              }`}/>
              <span className={workspace.id === currentWorkspace?.id ? 'font-medium' : ''}>
                {workspace.name}
              </span>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator/>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            setCurrentWorkspace(null)
            setIsOpen(false)
          }}
        >
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 border border-muted rounded-full"/>
            <span className="text-muted-foreground">No workspace</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
