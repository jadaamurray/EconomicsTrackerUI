import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Footer } from '../components/Footer'

describe('Footer', () => {
  it('renders heading text', () => {
    render(<Footer />)
    expect(screen.getByText('Welcome to My App')).toBeInTheDocument()
  })
})
