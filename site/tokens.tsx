import tokens from '../design/tokens.json'
import { Motion, TypeSpacing } from '../gallery/foundations'

type Token = { name: string; value: string; usage?: string }

/* The colors by what they are for, as the Color page of the design rules lists them. A color goes to the first family that names it. */
const FAMILIES: [title: string, names: RegExp][] = [
  ['Skill levels and answers', /^(mastered|proficient|familiar|attempted|correct)/],
  ['Text', /^(ink|muted|faint)/],
  ['Surfaces and edges', /^(white|black|canvas|surface|line|track|ring|rule|edge)/],
  ['Gauth AI and XP', /^violet/],
  ['Brand and meanings', /./],
]
const ORDER = ['Text', 'Surfaces and edges', 'Brand and meanings', 'Skill levels and answers', 'Gauth AI and XP']

function families(list: Token[]) {
  const of = (token: Token) => FAMILIES.find(([, names]) => names.test(token.name))![0]
  return ORDER.map((title) => ({ title, tokens: list.filter((token) => of(token) === title) }))
}

/** Every token, drawn with itself: a color as a swatch, a size as a line of text, a space as a bar, a movement as a tile that plays it. */
export function TokensPage() {
  return (
    <div className="s-tokens">
      <h2>Color</h2>
      {families(tokens.color.tokens).map((group) => (
        <section key={group.title} className="s-token-group">
          <h3>{group.title}</h3>
          <div className="s-swatches">
            {group.tokens.map((token) => (
              <div key={token.name} className="s-swatch">
                <span className="s-swatch__color" style={{ background: `var(--gx-color-${token.name})` }} />
                <span className="s-swatch__name">{token.name}</span>
                <span className="s-swatch__value">{token.value}</span>
              </div>
            ))}
          </div>
        </section>
      ))}

      <h2>Type</h2>
      <div className="s-rows">
        {tokens.type.scale.toReversed().map((token: Token) => (
          <div key={token.name} className="s-row">
            <span className="s-row__name">{token.name}</span>
            <span className="s-row__specimen" style={{ fontSize: `var(--gx-${token.name})` }}>
              Period 3
            </span>
            <span className="s-row__usage">{token.usage}</span>
          </div>
        ))}
        {tokens.type.weights.map((token: Token) => (
          <div key={token.name} className="s-row">
            <span className="s-row__name">{token.name}</span>
            <span className="s-row__specimen" style={{ fontWeight: `var(--gx-${token.name})` }}>
              Needs support
            </span>
            <span className="s-row__usage">
              {token.value}. {token.usage}
            </span>
          </div>
        ))}
      </div>

      <h2>Line height and letter spacing</h2>
      <TypeSpacing />

      <h2>Motion</h2>
      <Motion />

      <h2>Space</h2>
      <div className="s-rows">
        {tokens.spacing.tokens.map((token: Token) => (
          <div key={token.name} className="s-row">
            <span className="s-row__name">{token.name}</span>
            <span className="s-row__specimen">
              <span className="s-bar" style={{ width: `var(--gx-${token.name})` }} />
            </span>
            <span className="s-row__usage">{token.usage}</span>
          </div>
        ))}
      </div>

      <h2>Control heights</h2>
      <div className="s-rows">
        {tokens.height.tokens.map((token: Token) => (
          <div key={token.name} className="s-row">
            <span className="s-row__name">{token.name}</span>
            <span className="s-row__specimen">
              <span className="s-control" style={{ height: `var(--gx-${token.name})` }} />
            </span>
            <span className="s-row__usage">{token.value}</span>
          </div>
        ))}
      </div>

      <h2>Radius</h2>
      <div className="s-tiles">
        {tokens.radius.tokens.map((token: Token) => (
          <div key={token.name} className="s-tile">
            <span className="s-tile__shape" style={{ borderRadius: `var(--gx-${token.name})` }} />
            <span className="s-swatch__name">{token.name}</span>
            <span className="s-swatch__value">{token.usage}</span>
          </div>
        ))}
      </div>

      <h2>Shadow</h2>
      <div className="s-tiles">
        {tokens.shadow.tokens.map((token: Token) => (
          <div key={token.name} className="s-tile">
            <span className="s-tile__shape s-tile__shape--plain" style={{ boxShadow: `var(--gx-${token.name})` }} />
            <span className="s-swatch__name">{token.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
