import { component} from 'haunted';
import App, { Props } from './element';

customElements.define('podium-sandbox', component<Props & HTMLElement>(App, { useShadowDOM: false }));