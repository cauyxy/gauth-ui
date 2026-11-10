import { useEffect, useRef, useState } from 'react'
import { IconButton } from '../src/components/IconButton'
import { Icon } from '../src/core/Icon'
import { AiStatus } from '../src/learning/AiStatus'
import { Composer } from '../src/learning/Composer'
import { FollowUps } from '../src/learning/FollowUps'
import { Message } from '../src/learning/Message'
import { Quote } from '../src/learning/Quote'
import { ReplyActions, type ReplyVote } from '../src/learning/ReplyActions'
import { RichText } from '../src/math/RichText'
import { Section } from './section'

/* One class and one skill for the whole page: Geometry, Period 3, on the Pythagorean theorem (HSG.SRT.C.8). */
const QUESTION = 'Which mistake did Period 3 make most on the hypotenuse problems?'
/* The dot stays with the word before it. */
const CLASS = 'Geometry\u00a0· Period 3'
const WORKING = `Reading 28 answers in ${CLASS}`
const SOURCE = `Read 28 answers in ${CLASS}`
const REPLY = 'Six students added the legs: for legs 6 and 8 they wrote $c = 6 + 8 = 14$. The theorem squares the legs first: $c = \\sqrt{6^2 + 8^2} = 10$. The other 22 students answered 10.'
const QUOTED = 'Six students added the legs: for legs 6 and 8 they wrote $c = 6 + 8 = 14$.'
const WHO = 'Which six students added the legs?'
const PRACTICE = 'Make five practice problems on HSG.SRT.C.8'
const FOLLOW_UPS = [WHO, PRACTICE] as const
const REPLIES: Record<string, string> = {
  [WHO]: 'Devon Wright, Maya Chen, Diego Ramirez, Aiko Tanaka, Jordan Lee and Priya Patel. All six wrote $c = a + b$ on problems 3 and 5.',
  [PRACTICE]: 'Five problems are ready. Each gives two legs and asks for $c$, and the last two have legs that are not whole numbers.',
}
/* The gallery has no model: any other question gets this. */
const NO_MODEL = 'This gallery holds only the answers above. In a product, the reply to your question comes here.'
const WORK_MS = 2000

/* A teacher's page is 14px. A message takes the size of its page. */
const STAFF = { fontSize: 'var(--gx-text-sm)' }
const copy = (text: string) => void navigator.clipboard?.writeText(text).catch(() => undefined)

type Turn = { id: number; from: 'user'; text: string; quote?: string } | { id: number; from: 'ai'; text?: string; status: string }

function Conversation() {
  const [turns, setTurns] = useState<Turn[]>([
    { id: 1, from: 'user', text: QUESTION },
    { id: 2, from: 'ai', text: REPLY, status: SOURCE },
  ])
  const [votes, setVotes] = useState<Record<number, ReplyVote | null>>({})
  const [draft, setDraft] = useState('')
  const [quote, setQuote] = useState<string | null>(QUOTED)
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
    }, WORK_MS)
  }
  const stop = () => {
    clearTimeout(timer.current)
    add({ id: turns.length + 1, from: 'ai', status: 'Stopped' })
    setBusy(false)
  }
  const last = turns.at(-1)!

  return (
    <div className="g-col" style={STAFF}>
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
                  onCopy={() => copy(turn.text!)}
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
          <AiStatus state="working">{WORKING}</AiStatus>
        </Message>
      ) : last.id === 2 ? (
        <FollowUps items={FOLLOW_UPS} onPick={send} />
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

export default function Chat() {
  const [vote, setVote] = useState<ReplyVote | null>('good')
  const [picked, setPicked] = useState<string>(WHO)
  const [quoted, setQuoted] = useState(true)
  return (
    <>
      <Section title="Message">
        <div className="g-col" style={STAFF}>
          <Message from="user">{QUESTION}</Message>
          <Message from="ai">
            <RichText text={REPLY} />
          </Message>
        </div>
      </Section>
      <Section title="AiStatus">
        <div className="g-col">
          <AiStatus state="working">{WORKING}</AiStatus>
          <AiStatus state="done">{SOURCE}</AiStatus>
        </div>
      </Section>
      <Section title="ReplyActions">
        <div className="g-col">
          <ReplyActions onCopy={() => copy(REPLY)} vote={vote} onVote={setVote}>
            <IconButton size="sm" label="Quote">
              <Icon name="quote" />
            </IconButton>
          </ReplyActions>
          <ReplyActions onCopy={() => copy(REPLY)} />
        </div>
      </Section>
      <Section title="FollowUps">
        <div className="g-col">
          <FollowUps items={[...FOLLOW_UPS, 'Group the class for Thursday by who needs to square the legs and who is ready for word problems']} onPick={setPicked} />
          <span style={{ color: 'var(--gx-color-muted)' }}>{picked}</span>
        </div>
      </Section>
      <Section title="Quote">
        <div className="g-col">
          <Quote>
            <RichText text={QUOTED} />
          </Quote>
          {quoted ? (
            <Quote onRemove={() => setQuoted(false)}>
              <RichText text={REPLY} />
            </Quote>
          ) : null}
        </div>
      </Section>
      <Section title="Conversation" of="Message">
        <Conversation />
      </Section>
    </>
  )
}
