import type { RouteContext } from '@/router';
import { splitReveal } from '@/motion/splitReveal';

type Ref = {
  name: string;
  role: string;
  email?: string;
  photo: string;
  quote: string;
};

const REFERENCES: Ref[] = [
  {
    name: 'S. Baqar Hasan',
    role: 'Chairman, Olive Hospitals',
    email: 'chairman@olivehospitals.com',
    photo: '/assets/references/baqar%20hasan.jpg',
    quote:
      'Hashim Naqui has been known to me for a very long time, as a person of integrity, honesty, hard-working and very talented in the design field. He has provided us some very innovative and effective solutions for our 300 bed super-specialty corporate hospital, and we are very happy with his work, dedication and the end results. We plan to use his future services as we have a very special relationship with him at many levels and he has already done some additional work for our other operations.',
  },
  {
    name: 'Dudley Lacy',
    role: 'Former President & COO, O\u2019Brien/Atkins Associates',
    email: 'dudley.lacy@gmail.com',
    photo: '/assets/references/dudley%20lacy.png',
    quote:
      'I have known Hashim professionally since he joined O\u2019Brien/Atkins Associates, PA in 1994 until my retirement as President and COO in 2015. I worked with him both in his role as a Project Architect for O\u2019Brien/Atkins and in his role as the Director of his own firm in Hyderabad, India. During my 20-year association with Hashim, he has worked successfully on upwards of forty projects, many large and complex.',
  },
  {
    name: 'John Atkins, FAIA',
    role: 'Chairman & CEO, O\u2019Brien Atkins Associates',
    email: 'jatkins@obrienatkins.com',
    photo: '/assets/references/john%20atkins.jpg',
    quote:
      'I have known Hashim Naqui for over 20 years; as a professional colleague and as a friend. He is smart, talented and skilled at his trade. He has been keenly instrumental as a consulting architect in assisting O\u2019Brien Atkins Associates with the production of construction documents on sizable projects under our commission. Most importantly, he is honest and maintains the highest integrity in all that he does.',
  },
  {
    name: 'Taizoon Khorakiwala',
    role: 'SwitzGroup',
    photo: '/assets/references/taizoon%20khorakiwala.png',
    quote:
      'Hashim is a great architect and a wonderful human being. We&rsquo;ve worked on a 20-acre development in Hyderabad and my apartment in Mumbai. His ability to combine beauty, cost and functionality is what sets him apart from the others. His professional integrity, which is relatively standard in the western world, is not as common for someone operating in India and elsewhere. His ability to lay out a big picture as well as smaller details is valuable for quality conscious clients.',
  },
];

export const renderReferences = async ({ main }: RouteContext) => {
  main.innerHTML = `
    <section class="references-page">
      <header class="references-head">
        <h1 data-split="lines">References<br>&amp; voices.</h1>
        <p class="meta">Selected words from clients and collaborators &mdash; spanning healthcare, civic, and residential commissions across two continents.</p>
      </header>

      ${REFERENCES.map(
        (r) => `
        <article class="reference-card" data-reveal>
          <div class="reference-card__photo">
            <img src="${r.photo}" alt="${r.name}" loading="lazy" />
          </div>
          <div>
            <h2 class="reference-card__name">${r.name}</h2>
            <div class="reference-card__role">${r.role}</div>
            ${r.email ? `<div class="reference-card__email"><a href="mailto:${r.email}">${r.email}</a></div>` : ''}
            <p class="reference-card__quote">&ldquo;${r.quote}&rdquo;</p>
          </div>
        </article>
      `
      ).join('')}
    </section>
  `;

  splitReveal(main);
};
