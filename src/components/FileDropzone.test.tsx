import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FileDropzone } from './FileDropzone'

const pdf = new File(['%PDF'], 'worksheet.pdf', { type: 'application/pdf' })
const png = new File(['png'], 'work.png', { type: 'image/png' })

it('says the shared words without a title, and its input is named by them', () => {
  const { container } = render(<FileDropzone onChange={() => {}} hint="PDF or a photo, up to 10 MB" className="mine" />)
  expect(container.firstElementChild).toHaveClass('gx-file-dropzone', 'mine')
  expect(screen.getByLabelText(/Drop files here, or click to choose/)).toHaveAttribute('type', 'file')
  expect(screen.getByText('PDF or a photo, up to 10 MB')).toHaveClass('gx-file-dropzone__hint')
})

it('gives the chosen files that accept allows', async () => {
  const onChange = vi.fn<(files: File[]) => void>()
  render(<FileDropzone title="Add work" accept=".pdf,image/*" multiple onChange={onChange} />)
  await userEvent.upload(screen.getByLabelText('Add work'), [pdf, png])
  expect(onChange).toHaveBeenLastCalledWith([pdf, png])
})

it('takes dropped files, shows when files are over it, and keeps one without multiple', () => {
  const onChange = vi.fn<(files: File[]) => void>()
  const { container } = render(<FileDropzone title="Add work" accept="image/*" onChange={onChange} />)
  const zone = container.firstElementChild!
  fireEvent.dragOver(zone)
  expect(zone).toHaveAttribute('data-over', 'true')
  fireEvent.drop(zone, { dataTransfer: { files: [pdf, png, png] } })
  expect(zone).not.toHaveAttribute('data-over')
  expect(onChange).toHaveBeenLastCalledWith([png])
})

it('takes nothing when disabled', () => {
  const onChange = vi.fn()
  const { container } = render(<FileDropzone title="Add work" disabled onChange={onChange} />)
  fireEvent.drop(container.firstElementChild!, { dataTransfer: { files: [pdf] } })
  expect(onChange).not.toHaveBeenCalled()
  expect(screen.getByLabelText('Add work')).toBeDisabled()
})
