
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"

// GET /api/credentials/[id] - Get credential details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const { id } = await params
    const credentialId = id

    // Get credential with related data
    const { data: credential, error } = await supabase
      .from('credentials')
      .select(`
        *,
        event:event_id(id, name, slug),
        person:person_id(id, first_name, last_name, email, phone, company, role)
      `)
      .eq('id', credentialId)
      .single()

    if (error || !credential) {
      return NextResponse.json({ error: "Credential not found or access denied" }, { status: 404 })
    }

    // Verify user has access to the credential's organization
    const { data: userOrg } = await supabase
      .from('user_organizations')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('organization_id', credential.organization_id)
      .eq('is_active', true)
      .single()

    if (!userOrg) {
      return NextResponse.json({ error: "Credential not found or access denied" }, { status: 404 })
    }

    return NextResponse.json({ credential })
  } catch (error) {
    logger.error("Error fetching credential", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/credentials/[id] - Update credential
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const credentialId = id
    const body = await request.json()

    // Get credential to check organization
    const { data: credential, error: credError } = await supabase
      .from('credentials')
      .select('id, organization_id')
      .eq('id', credentialId)
      .single()

    if (credError || !credential) {
      return NextResponse.json({ error: "Credential not found" }, { status: 404 })
    }

    // Check if user has write access to the credential's organization
    const { data: userOrg } = await supabase
      .from('user_organizations')
      .select('id, roles(permissions)')
      .eq('user_id', session.user.id)
      .eq('organization_id', credential.organization_id)
      .eq('is_active', true)
      .single()

    if (!userOrg) {
      return NextResponse.json({ error: "Credential not found or insufficient permissions" }, { status: 403 })
    }

    // Build update object
    const updateData: Record<string, unknown> = {}
    if (body.type !== undefined) updateData.type = body.type
    if (body.level !== undefined) updateData.level = body.level
    if (body.zones !== undefined) updateData.zones = body.zones
    if (body.department !== undefined) updateData.department = body.department
    if (body.position !== undefined) updateData.position = body.position
    if (body.validFrom !== undefined) updateData.valid_from = body.validFrom
    if (body.validTo !== undefined) updateData.valid_to = body.validTo
    if (body.status !== undefined) updateData.status = body.status

    // Update credential
    const { data: updatedCredential, error: updateError } = await supabase
      .from('credentials')
      .update(updateData)
      .eq('id', credentialId)
      .select(`
        *,
        event:event_id(id, name, slug),
        person:person_id(id, first_name, last_name, email)
      `)
      .single()

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ credential: updatedCredential })
  } catch (error) {
    logger.error("Error updating credential", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/credentials/[id] - Delete credential
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const { id } = await params
    const credentialId = id

    // Get credential to check organization
    const { data: credential, error: credError } = await supabase
      .from('credentials')
      .select('id, organization_id')
      .eq('id', credentialId)
      .single()

    if (credError || !credential) {
      return NextResponse.json({ error: "Credential not found" }, { status: 404 })
    }

    // Check if user has write access
    const { data: userOrg } = await supabase
      .from('user_organizations')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('organization_id', credential.organization_id)
      .eq('is_active', true)
      .single()

    if (!userOrg) {
      return NextResponse.json({ error: "Credential not found or insufficient permissions" }, { status: 403 })
    }

    // Delete credential
    const { error: deleteError } = await supabase
      .from('credentials')
      .delete()
      .eq('id', credentialId)

    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json({ message: "Credential deleted successfully" })
  } catch (error) {
    logger.error("Error deleting credential", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
