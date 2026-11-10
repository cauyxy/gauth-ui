import { useEffect, useRef, useState } from 'react'
import { AiStatus, Composer, FollowUps, Icon, IconButton, Message, Quote, ReplyActions, type ReplyVote } from '../../src'
import { RichText } from '../../src/math'

const QUESTION = 'Which mistake did Period 3 make most on the hypotenuse problems?'
const REPLY = 'Six students added the legs: for legs 6 and 8 they wrote $c = 6 + 8 = 14$. The theorem squares the legs first: $c = \\sqrt{6^2 + 8^2} = 10$. The other 22 students answered 10.'
/* The dot stays with the word before it. */
const SOURCE = 'Read 28 answers in Geometry · Period 3'
const WHO = 'Which six students added the legs?'
const PRACTICE = 'Make five practice problems on HSG.SRT.C.8'
/* This example has no model: it holds these answers only. */
const REPLIES: Record<string, string> = {
  [WHO]: 'Devon Wright, Maya Chen, Diego Ramirez, Aiko Tanaka, Jordan Lee and Priya Patel. All six wrote $c = a + b$ on problems 3 and 5.',
  [PRACTICE]: 'Five problems are ready. Each gives two legs and asks for $c$, and the last two have legs that are not whole numbers.',
}
const NO_MODEL = 'This example holds only the answers above. In a product, the reply to your question comes here.'

type Turn = { id: number; from: 'user'; text: string; quote?: string } | { id: number; from: 'ai'; text?: string; status: string }

/* A teacher's page is 14px. A message takes the size of its page. */
export function Turns() {
  return (
    <div className="grid w-full max-w-[34rem] gap-4 text-sm">
      <Message from="user">{QUESTION}</Message>
      <Message from="ai">
        <RichText text={REPLY} />
      </Message>
    </div>
  )
}

export function Conversation() {
  const [turns, setTurns] = useState<Turn[]>([
    { id: 1, from: 'user', text: QUESTION },
    { id: 2, from: 'ai', text: REPLY, status: SOURCE },
  ])
  const [votes, setVotes] = useState<Record<number, ReplyVote | null>>({})
  const [draft, setDraft] = useState('')
  const [quote, setQuote] = useState<string | null>('Six students added the legs: for legs 6 and 8 they wrote $c = 6 + 8 = 14$.')
  const [busy, setBusy] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const add = (turn: Turn) => setTurns((all) => [...all, turn])
  const send = (text: string) => {
    const id = turns.length + 1
    add({ id, from: 'user', text, quote: quote ?? undefined })
    setDraft('')
    setQuote(null)
    setBusy(true)
    timer.current = setTimeout(() => {
      add({ id: id + 1, from: 'ai', text: REPLIES[text] ?? NO_MODEL, status: SOURCE })
      setBusy(false)
    }, 2000)
  }
  const stop = () => {
    clearTimeout(timer.current)
    add({ id: turns.length + 1, from: 'ai', status: 'Stopped' })
    setBusy(false)
  }

  return (
    <div className="grid w-full max-w-[34rem] gap-4 text-sm">
      {turns.map((turn) =>
        turn.from === 'user' ? (
          <Message key={turn.id} from="user">
            {turn.quote ? (
              <Quote>
                <RichText text={turn.quote} />
              </Quote>
            ) : null}
            {turn.text}
          </Message>
        ) : (
          <Message key={turn.id} from="ai">
            <AiStatus state="done">{turn.status}</AiStatus>
            {turn.text ? (
              <>
                <RichText text={turn.text} />
                <ReplyActions
                  onCopy={() => void navigator.clipboard?.writeText(turn.text!)}
                  vote={votes[turn.id]}
                  onVote={(vote) => setVotes((all) => ({ ...all, [turn.id]: vote }))}
                >
                  <IconButton size="sm" label="Quote" onClick={() => setQuote(turn.text!)}>
                    <Icon name="quote" />
                  </IconButton>
                </ReplyActions>
              </>
            ) : null}
          </Message>
        ),
      )}
      {busy ? (
        <Message from="ai">
          <AiStatus state="working">Reading 28 answers in Geometry{' '}· Period 3</AiStatus>
        </Message>
      ) : turns.length === 2 ? (
        <FollowUps items={[WHO, PRACTICE]} onPick={send} />
      ) : null}
      <Composer
        label="Ask Gauth AI"
        placeholder="Ask about Period 3"
        value={draft}
        onChange={setDraft}
        onSend={send}
        busy={busy}
        onStop={stop}
        before={
          quote ? (
            <Quote onRemove={() => setQuote(null)}>
              <RichText text={quote} />
            </Quote>
          ) : null
        }
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
