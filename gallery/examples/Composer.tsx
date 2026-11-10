import { useState } from 'react'
import { Composer, Icon, IconButton } from '../../src'

export function Ask() {
  const [question, setQuestion] = useState('')
  const [asked, setAsked] = useState('Why do the triangles have to be similar?')
  return (
    <div className="grid w-full max-w-[34rem] gap-4">
      <span className="text-muted">{asked}</span>
      <Composer
        label="Ask Gauth AI"
        placeholder="Ask about this step"
        value={question}
        onChange={setQuestion}
        onSend={(text) => {
          setAsked(text)
          setQuestion('')
        }}
      />
    </div>
  )
}

export function WithTools() {
  const [request, setRequest] = useState('')
  return (
    <div className="w-full max-w-[34rem]">
      <Composer
        label="Ask Gauth AI"
        placeholder="Ask about this class, or attach student work"
        value={request}
        onChange={setRequest}
        onSend={() => setRequest('')}
        tools={
          <>
            <IconButton label="Attach a file">
              <Icon name="attach" />
            </IconButton>
            <IconButton label="Dictate">
              <Icon name="mic" />
            </IconButton>
          </>
        }
      />
    </div>
  )
}
