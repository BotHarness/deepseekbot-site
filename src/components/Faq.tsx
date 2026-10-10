import type { Copy } from '../content';

export function Faq({ copy }: { copy: Copy }) {
  return (
    <section className="section faq-section" id="faq" aria-labelledby="faq-title">
      <p className="kicker">{copy.faq.kicker}</p>
      <h2 id="faq-title">{copy.faq.title}</h2>
      <div className="faq-list frame">
        {copy.faq.items.map((item, index) => (
          <details className="faq-item" key={item.id} open={index === 0}>
            <summary className="faq-question">
              <span>{item.question}</span>
              <span className="faq-toggle" aria-hidden="true" />
            </summary>
            <div className="faq-answer">
              <p>{item.answer}</p>
              {item.links ? (
                <ul className="faq-links">
                  {item.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href}>{link.label} →</a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
