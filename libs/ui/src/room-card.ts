import { LitElement, css, html, nothing } from 'lit';
import { base, define, emit, t } from './shared';
import './badge';
import './button';

/** What the card needs to show a room; structurally compatible with the core `Room` type. */
export interface RoomCardData {
  id: string;
  name: string;
  type: 'room' | 'bungalow';
  description: string;
  sizeM2: number;
  beds: number;
  bedType: string;
  maxGuests: number;
  image: string;
}

export type TbSelectEvent = CustomEvent<{ id: string }>;

/**
 * Room or bungalow card with a select button.
 * @fires tb-select - When the guest chooses this room, with `{ id }`.
 */
export class TbRoomCard extends LitElement {
  static override properties = {
    room: { attribute: false },
    price: {},
    selected: { type: Boolean, reflect: true },
  };

  declare room: RoomCardData | undefined;
  /** Formatted price per night, e.g. `€120.00`. */
  declare price: string;
  declare selected: boolean;

  constructor() {
    super();
    this.room = undefined;
    this.price = '';
    this.selected = false;
  }

  static override styles = [
    base,
    css`
      :host {
        display: block;
      }
      article {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
        background: ${t.color.surface};
        border: 2px solid transparent;
        border-radius: ${t.radius.md};
        box-shadow: ${t.shadow.sm};
      }
      :host([selected]) article {
        border-color: ${t.color.primary};
        box-shadow: ${t.shadow.md};
      }
      img {
        display: block;
        width: 100%;
        aspect-ratio: 16 / 10;
        object-fit: cover;
        background: ${t.color.surfaceMuted};
      }
      .body {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: ${t.space.sm};
        padding: ${t.space.md};
      }
      h3 {
        margin: 0;
        font-size: ${t.font.sizeLg};
      }
      p {
        margin: 0;
        color: ${t.color.textMuted};
      }
      dl {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: ${t.space.sm};
        margin: 0;
      }
      dt {
        font-size: ${t.font.sizeSm};
        color: ${t.color.textMuted};
      }
      dd {
        margin: 0;
        font-weight: ${t.font.weightBold};
      }
      .footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: ${t.space.sm};
        margin-top: auto;
        padding-top: ${t.space.sm};
      }
      .price {
        font-size: ${t.font.sizeLg};
        font-weight: ${t.font.weightBold};
        color: ${t.color.text};
      }
      .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
      }
      .price small {
        font-size: ${t.font.sizeSm};
        font-weight: ${t.font.weightRegular};
        color: ${t.color.textMuted};
      }
    `,
  ];

  private onSelect() {
    if (this.room) emit(this, 'tb-select', { id: this.room.id });
  }

  override render() {
    const room = this.room;
    if (!room) return nothing;
    return html`
      <article aria-labelledby="name">
        <img src=${room.image} alt="" loading="lazy" width="640" height="400" />
        <div class="body">
          <tb-badge variant=${room.type === 'bungalow' ? 'accent' : 'neutral'}>
            ${room.type === 'bungalow' ? 'Bungalow' : 'Room'}
          </tb-badge>
          <h3 id="name">${room.name}</h3>
          <p>${room.description}</p>
          <dl>
            <div>
              <dt>Size</dt>
              <dd>${room.sizeM2} m²</dd>
            </div>
            <div>
              <dt>Beds</dt>
              <dd>${room.beds} · ${room.bedType}</dd>
            </div>
            <div>
              <dt>Sleeps</dt>
              <dd>Up to ${room.maxGuests}</dd>
            </div>
          </dl>
          <div class="footer">
            <span class="price">${this.price} <small>/ night</small></span>
            <tb-button variant=${this.selected ? 'primary' : 'secondary'} @click=${this.onSelect}>
              ${this.selected ? 'Selected' : 'Select'}
              <span class="visually-hidden">${room.name}</span>
            </tb-button>
          </div>
        </div>
      </article>
    `;
  }
}

define('tb-room-card', TbRoomCard);

declare global {
  interface HTMLElementTagNameMap {
    'tb-room-card': TbRoomCard;
  }
  interface HTMLElementEventMap {
    'tb-select': TbSelectEvent;
  }
}
