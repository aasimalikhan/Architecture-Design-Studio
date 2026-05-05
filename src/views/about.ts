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
            scales across domestic and international commissions.
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
              <li><time>1978</time><span>Valedictorian, Osmania University</span></li>
              <li><time>1988</time><span>Master&rsquo;s in Architecture, Kansas State University</span></li>
            </ul>

            <h3>Career path</h3>
            <p>Began overseas, then relocated to North America after work in the Gulf. Early practice included federal installations, then broad commercial typologies across several U.S. regions.</p>

            <h3>Southwest</h3>
            <p>Robotics Research Building at a flagship state university campus. High-rise office, residential, and institutional work in dense metro markets.</p>

            <h3>Metro corridor &middot; from 1986</h3>
            <p>Large mercantile and civic work: shopping centres, grocery anchors, medical facilities, office buildings, schools, and structured parking.</p>

            <h3>Southeast &middot; from 1994</h3>
            <p>Airport terminals, laboratories, bio-tech and pharmaceutical buildings, schools, community centres, and offices.</p>

            <h3>NCD International &middot; from 1998</h3>
            <p>Founded his own firm in 1998. Since then, has collaborated with larger firms including O&rsquo;Brien/Atkins and SfL+a, often pairing local design leadership with remote production support.</p>

            <h3>International</h3>
            <p>Independent work across South Asia and the Gulf, including a major linear mixed-use with European partners; housing under the Agha Khan Foundation; and large hospital campuses.</p>

            <h3>Current role &middot; 2022 onward</h3>
            <p>Continues with SfL+a on schools, residential, and institutional work. Leads a distributed architecture team on parallel commissions.</p>
          </div>
        </div>
      </section>
    </article>
  `;

  splitReveal(main);
};
