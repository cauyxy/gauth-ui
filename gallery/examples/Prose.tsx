import { Callout, Prose } from '../../src'
import { RichText, Tex } from '../../src/math'

/* A lesson as a student reads it: the reading size, with a formula, a term, a note and a table. */
export function Lesson() {
  return (
    <Prose size="lg">
      <h2>The Pythagorean theorem</h2>
      <p>
        In a right triangle, the two shorter sides are the <strong>legs</strong> and the side across from the right angle is the <strong>hypotenuse</strong>.
        The theorem ties the three lengths together.
      </p>
      <Tex display tex="a^2 + b^2 = c^2" />
      <p>
        <RichText text="Here $a$ and $b$ are the legs and $c$ is the hypotenuse. It works for every right triangle, and only for right triangles." />
      </p>
      <h3>Find a missing side</h3>
      <ol>
        <li>Write the theorem with the lengths you know.</li>
        <li>
          <RichText text="Square the legs and add them: $6^2 + 8^2 = 100$." />
        </li>
        <li>
          <RichText text="Take the square root: $c = 10$." />
        </li>
      </ol>
      <Callout tone="warn">The hypotenuse is always the longest side. If your answer is shorter than a leg, check the squares.</Callout>
      <h3>Words to know</h3>
      <dl>
        <dt>Leg</dt>
        <dd>One of the two sides that form the right angle.</dd>
        <dt>Hypotenuse</dt>
        <dd>The side across from the right angle. It is the longest side.</dd>
      </dl>
    </Prose>
  )
}

/* A page for a teacher: the staff size, with a quote, a table and a link. */
export function StaffNote() {
  return (
    <Prose size="sm">
      <h2>What Period 3 needs next</h2>
      <p>
        18 of 28 students are Familiar or above on HSG.SRT.B.5. The 6 students who are Attempted made the same mistake: they added the legs before squaring
        them. See <a href="#Prose">the worked answers</a>.
      </p>
      <blockquote>Reteach squaring before adding, then send 4 practice problems.</blockquote>
      <table>
        <thead>
          <tr>
            <th>Level</th>
            <th>Students</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mastered</td>
            <td>7</td>
            <td>+2</td>
          </tr>
          <tr>
            <td>Proficient</td>
            <td>11</td>
            <td>+3</td>
          </tr>
          <tr>
            <td>Attempted</td>
            <td>6</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
      <hr />
      <p>
        Scores come from <code>exit-ticket-3</code>, graded Fri, Nov 13.
      </p>
    </Prose>
  )
}

/* A reading passage: a source text a student reads for itself, in the reading face. What the product says about it stays in the face of the interface. */
export function Reading() {
  return (
    <Prose size="lg" font="reading">
      <h2>Learning to read</h2>
      <p>
        I lived in Master Hugh&rsquo;s family about seven years. During this time, I succeeded in learning to read and write. In accomplishing this, I was
        compelled to resort to various stratagems. I had no regular teacher.
      </p>
      <p>
        The plan which I adopted, and the one by which I was most successful, was that of making friends of all the little white boys whom I met in the street.
        As many of these as I could, I converted into teachers.
      </p>
      <p>With their kindly aid, obtained at different times and in different places, I finally succeeded in learning to read.</p>
      <Callout>From Narrative of the Life of Frederick Douglass (1845), chapter 7. As you read, mark each plan he makes.</Callout>
    </Prose>
  )
}
