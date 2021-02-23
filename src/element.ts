import { html, component} from 'haunted';

export type Props = {
  name: string;
}

function App({ name }) {
  return html`Hello ${name}`;
}

export default App;