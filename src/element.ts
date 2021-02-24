import { html, useEffect, useState} from 'haunted';
import { MessageBus } from '@podium/browser';
import scss from './element.scss';

export type Props = {
  events: string;
  [key: string]: unknown;
}

function App({ events = '[]' }) {
  const [showForm, setShowForm] = useState(false);
  const [channel, setChannel] = useState('');
  const [topic, setTopic] = useState('');
  const [payload, setPayload] = useState('');
  const [buttonText, setButtonText] = useState('+');

  const handlerButton = () => {
    setShowForm(!showForm);
    setButtonText(!showForm ? '-' : '+');
  }

  const sendEvent = () => {
    const event = new CustomEvent('send-event', {
      bubbles: true, // this let's the event bubble up through the DOM
      composed: true, // this let's the event cross the Shadow DOM boundary
      detail: { channel, topic, payload } // all data you wish to pass must be in `detail`
    });
    this.dispatchEvent(event);
  }

  const publish = ( { channel, topic, payload }) => {
    const messageBus = new MessageBus();
    messageBus.publish(channel, topic, payload);
  }

  useEffect(() => {
    let parsedEvents;
    try {
      parsedEvents = JSON.parse(events);
      parsedEvents.forEach(({ channel, topic, payload }) => {
        const parsedPayload = getParsedPayload(payload);
        publish({channel, topic, payload: parsedPayload})
      })
    } catch (error) {
      console.warn('error: initial events parse error');
    }
  }, []);

  const getParsedPayload = (payload) => {
    try {
      return JSON.parse(payload);
    } catch {
      return payload;
    }
  }

  const handleSend = () => {
    const parsedPayload = getParsedPayload(payload);
    publish({channel, topic, payload: parsedPayload})
    sendEvent();
  }

  return html`
    <style>${scss}</style>
    <div class="podium-sandbox">
    <button @click=${handlerButton}>${buttonText}</button>
    ${ showForm ? html`<div id="event-form" class="podium-sandbox__form">
      <input
        class="podium-sandbox__input"
        placeholder="channel"
        @change=${event => setChannel(event.target.value)}
        value=${channel}
      />
      <input
        class="podium-sandbox__input"
        id="topic"
        placeholder="topic"
        @change=${event => setTopic(event.target.value)}
        value=${topic}
      />
      <textarea
        class="podium-sandbox__area-text"
        id="payload"
        rows="4"
        placeholder="payload"
        @change=${event => setPayload(event.target.value)}
        value=${payload}
      ></textarea>
      <button
        class="podium-sandbox__form-send"
        @click=${handleSend}
      >
        send
      </button>
    </div>` : null}
  </div>`;
}

App.observedAttributes = ['events'];

export default App;