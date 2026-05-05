import type { RouteContext } from '@/router';
import { splitReveal } from '@/motion/splitReveal';

type Member = { name: string; role: string; photo: string };

const withBase = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\/+/, '')}`;

const TEAM: Member[] = [
  { name: 'Osama Farooq', role: 'Architect / Chief Office Coordinator', photo: withBase('/assets/team/osama%20farooq.jpg') },
  { name: 'Nayana Sevella', role: 'Architect / Chief Production Coordinator', photo: withBase('/assets/team/nayana%20sevalla.jpg') },
  { name: 'Durga Venkatesh', role: 'Architect / Senior Production Coordinator', photo: withBase('/assets/team/durga%20venkatesh.jpg') },
  { name: 'Nadeem Uddin', role: 'Architect / Senior Production Coordinator', photo: withBase('/assets/team/nadeem%20uddin.jpg') },
  { name: 'Ahmed Sofiyan', role: 'Architect / Senior Production Coordinator', photo: withBase('/assets/team/ahmed%20sofiyan.jpg') },
  { name: 'Manideep Chindam', role: 'Jr. Architect / Production', photo: withBase('/assets/team/manideep%20chindam.jpg') },
  { name: 'Vaishnavi Reddy', role: 'Jr. Architect / Production', photo: withBase('/assets/team/vaishnavi%20reddy.jpg') },
  { name: 'Nikhila Piska', role: 'Jr. Architect / Design', photo: withBase('/assets/team/nikhila%20piska.jpg') },
  { name: 'Mahathi Reddy', role: 'Jr. Architect / Design', photo: withBase('/assets/team/mahati%20reddy.jpg') },
  { name: 'Sriram Ganesh', role: 'Intern Architect', photo: withBase('/assets/team/sriram%20ganesh.jpg') },
];

export const renderTeam = async ({ main }: RouteContext) => {
  main.innerHTML = `
    <section class="team-page">
      <header class="team-head">
        <h1 data-split="lines">The team.<br>Hyderabad &amp; Raleigh.</h1>
        <div class="team-head__count">${String(TEAM.length).padStart(2, '0')} architects</div>
      </header>
      <div class="team-grid">
        ${TEAM.map(
          (m) => `
          <article class="team-card" data-reveal data-magnetic>
            <img src="${m.photo}" alt="${m.name}" loading="lazy" />
            <div class="team-card__meta">
              <div class="team-card__name">${m.name}</div>
              <div class="team-card__role">${m.role}</div>
            </div>
          </article>`
        ).join('')}
      </div>
    </section>
  `;

  splitReveal(main);
};
