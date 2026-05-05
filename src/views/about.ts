import type { RouteContext } from '@/router';
import { splitReveal } from '@/motion/splitReveal';

export const renderAbout = async ({ main }: RouteContext) => {
  main.innerHTML = `
    <article class="about-page">
      <section class="about-hero">
        <div class="about-hero__media">
          <img src="/assets/about/HashimNaqui.jpg" alt="Hashim Naqui" />
        </div>
        <div class="about-hero__intro">
          <div class="eyebrow">About &middot; Hashim Naqui</div>
          <h1 class="about-hero__title" data-split="lines">A practice<br>of restraint,<br>across forty years.</h1>
          <p class="about-hero__lede" data-reveal>
            Hashim Naqui is a registered architect in the United States since
            1986. His work spans civic, cultural, residential and master-plan
            scales across the United States, India, and the Middle East.
          </p>
        </div>
      </section>

      <section class="about-bio">
        <div class="about-bio__grid">
          <aside class="about-bio__aside">
            <div class="eyebrow">Credentials</div>
            <ul class="about-bio__credentials">
              <li><b>1978</b><span>Council of Architects, India</span></li>
              <li><b>1986</b><span>NCARB &middot; US registration</span></li>
              <li><b>FIIA</b><span>Fellow, Indian Institute of Architects</span></li>
              <li><b>OCI</b><span>Citizen of the United States &middot; Overseas Citizen of India</span></li>
            </ul>
          </aside>

          <div class="about-bio__main">
            <h3>Education</h3>
            <ul>
              <li><time>1978</time><span>Valedictorian, Osmania University, Hyderabad, India</span></li>
              <li><time>1988</time><span>Master&rsquo;s in Architecture, Kansas State University</span></li>
            </ul>

            <h3>Career path</h3>
            <p>Hashim began his career on projects in India, then moved to Dammam, Saudi Arabia in 1979, and to the United States in 1982. Early work in Kansas with the U.S. Army Corps of Engineers led to projects in Texas, the Washington, D.C. metro, and North Carolina.</p>

            <h3>Texas</h3>
            <p>Robotics Research Building, University of Texas. High-rise office, residential, and institutional projects in and around Dallas.</p>

            <h3>Washington metro &middot; from 1986</h3>
            <p>Large mercantile and civic work: shopping centres, large grocery stores, medical facilities, office buildings, schools, and parking structures.</p>

            <h3>North Carolina &middot; from 1994</h3>
            <p>Broad project types including RDU International Airport, Terminal 2; laboratories, bio-tech, pharmaceutical buildings, schools, community centres, and offices.</p>

            <h3>NCD International &middot; from 1998</h3>
            <p>Founded his own firm in 1998. Since then, has collaborated with larger firms including O&rsquo;Brien/Atkins and SfL+a in the Raleigh area to provide production work from India.</p>

            <h3>India, Middle East &middot; international</h3>
            <p>Independent projects across India and the Middle East, including the longest building in Doha (BARWA Development) with German architects and contractors; the Garden Housing apartment complex under the Agha Khan Foundation, India; and large hospital projects in India.</p>

            <h3>Current role &middot; 2022 onward</h3>
            <p>Associated with SfL+a (Raleigh and Fayetteville) on state-of-the-art school projects in North Carolina, residential developments, and other facilities. Works with a team of architects based in Hyderabad, India since 2022.</p>
          </div>
        </div>
      </section>
    </article>
  `;

  splitReveal(main);
};
