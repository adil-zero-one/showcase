import { useI18n, fmt } from '../i18n';
import { goTo } from '../lib/smooth';
import './footer.css';

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="container footer__row">
        <p>{fmt(t.footer.rights, { year: new Date().getFullYear() })}</p>
        <p>{t.footer.built}</p>
        <a className="tlink" href="#hero" onClick={(e) => { e.preventDefault(); goTo('hero'); }}>{t.footer.top}</a>
      </div>
    </footer>
  );
}
