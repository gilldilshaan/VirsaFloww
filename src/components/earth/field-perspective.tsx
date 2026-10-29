import fieldPerspective from "@/assets/field-story/woman-orange-rice.webp";
import { TextLink } from "./site-shell";

export function FieldPerspective() {
  return (
    <section className="field-perspective">
      <img
        className="field-perspective-image"
        src={fieldPerspective}
        width={1920}
        height={1024}
        loading="lazy"
        alt="A farmer walking beside rows of rice in a green field"
      />
      <div className="earth-container field-perspective-copy">
        <span className="earth-label">ROOTED IN THE FIELD</span>
        <h2>
          Real context.
          <br />
          <em>Stronger evidence.</em>
        </h2>
        <p>
          Every field has a story. Connect its season, practices and observations — without losing
          the context behind a claim.
        </p>
        <TextLink to="/how-it-works">From observation to review</TextLink>
      </div>
      <span className="field-perspective-caption">ILLUSTRATIVE FIELD LANDSCAPE</span>
    </section>
  );
}
