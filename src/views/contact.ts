import type { RouteContext } from '@/router';
import { splitReveal } from '@/motion/splitReveal';

export const renderContact = async ({ main }: RouteContext) => {
  main.innerHTML = `
    <section class="contact-page">
      <header class="contact-head">
        <h1 data-split="lines">Let&rsquo;s build<br>something good.</h1>
        <a href="mailto:hnaqui@ncdinternational.com" class="contact-head__email" data-magnetic>
          hnaqui@ncdinternational.com
        </a>
      </header>

      <div class="contact-grid">
        <section class="contact-office" data-reveal>
          <div class="contact-office__country">United States</div>
          <h2 class="contact-office__name">NCD International PLLC</h2>
          <address class="contact-office__addr">
            6588 Glenwood Avenue, #125<br>
            Raleigh, NC 27612, USA
          </address>
          <a class="contact-office__phone" href="tel:+19194008271" data-magnetic>+1 919 400 8271</a>
        </section>

        <section class="contact-office" data-reveal>
          <div class="contact-office__country">India</div>
          <h2 class="contact-office__name">NCD International</h2>
          <address class="contact-office__addr">
            Plot No. 14, Road No. 12<br>
            Banjara Hills, Hyderabad 500034, TG, India
          </address>
          <a class="contact-office__phone" href="tel:+918897729690" data-magnetic>+91 889 772 9690</a>
        </section>
      </div>
    </section>
  `;

  splitReveal(main);
};
