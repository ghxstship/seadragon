/**
 * Component Test Example
 * Demonstrates testing a React component with the testing utilities
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { createTestUser, createTestSession, mockRouter } from '@/lib/test-utils'
import { Button } from '@/components/ui/button'

// Component to test
const UserProfile = ({ user, onEdit }) => {
  return (
    <div>
      <h1 data-testid="user-name">{user.name}</h1>
      <p data-testid="user-email">{user.email}</p>
      <Button onClick={onEdit} data-testid="edit-button">
        Edit Profile
      </Button>
    </div>
  )
}

describe('UserProfile Component', () => {
  const testUser = createTestUser({
    name: 'John Doe',
    email: 'john@example.com'
  })

  const mockOnEdit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders user information correctly', () => {
    render(<UserProfile user={testUser} onEdit={mockOnEdit} />)

    expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe')
    expect(screen.getByTestId('user-email')).toHaveTextContent('john@example.com')
  })

  it('calls onEdit when edit button is clicked', async () => {
    render(<UserProfile user={testUser} onEdit={mockOnEdit} />)

    const editButton = screen.getByTestId('edit-button')
    fireEvent.click(editButton)

    await waitFor(() => {
      expect(mockOnEdit).toHaveBeenCalledTimes(1)
    })
  })

  it('displays default user data correctly', () => {
    const defaultUser = createTestUser()
    render(<UserProfile user={defaultUser} onEdit={mockOnEdit} />)

    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User')
    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com')
  })
})
