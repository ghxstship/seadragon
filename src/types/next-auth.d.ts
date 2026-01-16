
import NextAuth from "next-auth"

interface Permissions {
  [key: string]: string[] | boolean
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      organizationId: string
      organizationSlug: string
      role: string
      permissions: Permissions
    }
  }

  interface User {
    organizationId: string
    organizationSlug: string
    role: string
    permissions: Permissions
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    organizationId: string
    organizationSlug: string
    role: string
    permissions: Permissions
  }
}
