// import '@testing-library/jest-dom/jest-globals'
import { screen } from '@testing-library/dom'
import { describe, expect, it } from 'vitest'
import { render } from './dom'

describe('render', () => {
  it('render() - should render HTML', () => {
    expect(screen.queryByTestId('g-u2n-html-test-wrapper')).not.toBeInTheDocument()

    render('<h1>Rendered title</h1>', 'test-wrapper')

    expect(screen.queryByTestId('g-u2n-html-test-wrapper')).toBeInTheDocument()
    expect(screen.getByText('Rendered title')).toBeInTheDocument()
  })

  it('render() - should update HTML for the same id', () => {
    render('<h1>Rendered title</h1>', 'test-wrapper')

    expect(screen.queryByText('Rendered title')).toBeInTheDocument()

    render('<h1>Second title</h1>', 'test-wrapper')

    expect(screen.queryByText('Second title')).toBeInTheDocument()

    expect(screen.queryByText('Rendered title')).not.toBeInTheDocument()
  })
})
