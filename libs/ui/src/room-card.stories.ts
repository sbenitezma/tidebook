import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { fn } from 'storybook/test';
import type { RoomCardData, TbRoomCard, TbSelectEvent } from './room-card';

type Args = Pick<TbRoomCard, 'price' | 'selected'> & {
  room: RoomCardData;
  onSelect: (event: TbSelectEvent) => void;
};

const room: RoomCardData = {
  id: 'seagrass',
  name: 'Seagrass Bungalow',
  type: 'bungalow',
  description: 'A timber bungalow on the dunes with a deck facing the sea.',
  sizeM2: 42,
  beds: 2,
  bedType: 'Double',
  maxGuests: 4,
  image: 'rooms/seagrass.svg',
};

const meta: Meta<Args> = {
  title: 'Components/Room card',
  component: 'tb-room-card',
  args: { room, price: '€165.00', selected: false, onSelect: fn() },
  render: (args) =>
    html`<div style="max-width: 22rem">
      <tb-room-card
        .room=${args.room}
        price=${args.price}
        ?selected=${args.selected}
        @tb-select=${args.onSelect}
      ></tb-room-card>
    </div>`,
};
export default meta;

type Story = StoryObj<Args>;

export const Bungalow: Story = {};
export const Selected: Story = { args: { selected: true } };
export const Room: Story = {
  args: {
    price: '€95.00',
    room: {
      ...room,
      id: 'driftwood',
      name: 'Driftwood Room',
      type: 'room',
      description: 'A quiet double room with driftwood details.',
      sizeM2: 18,
      beds: 1,
      maxGuests: 2,
      image: 'rooms/driftwood.svg',
    },
  },
};
