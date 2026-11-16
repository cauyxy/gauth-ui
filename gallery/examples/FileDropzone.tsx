import { useState } from 'react'
import { Chip, FileDropzone } from '../../src'

export function StudentWork() {
  const [files, setFiles] = useState<File[]>([])
  return (
    <div className="grid w-full max-w-[28rem] gap-3">
      <FileDropzone
        title="Add photos of the student's work"
        hint="PDF or a photo, up to 10 MB each"
        accept=".pdf,image/*"
        multiple
        onChange={(added) => setFiles([...files, ...added])}
      />
      {files.length ? (
        <div className="flex flex-wrap gap-2">
          {files.map((f, i) => (
            <Chip key={`${f.name}-${i}`} onRemove={() => setFiles(files.filter((_, j) => j !== i))} removeLabel={`Remove ${f.name}`}>
              {f.name}
            </Chip>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function SharedWords() {
  return (
    <div className="grid w-full max-w-[28rem] gap-3">
      <FileDropzone onChange={() => {}} />
      <FileDropzone title="Uploads are off for this class" onChange={() => {}} disabled />
    </div>
  )
}
