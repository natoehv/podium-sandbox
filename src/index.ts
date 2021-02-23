import { component} from 'haunted';
import App, { Props } from './element';

customElements.define('my-app', component<Props & HTMLElement>(App, { useShadowDOM: false }));