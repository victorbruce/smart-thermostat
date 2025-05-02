import {
  createRoom,
  setCurrTemp,
  setColdPreset,
  setWarmPreset,
  decreaseTemp,
  increaseTemp,
  toggleAircon,
} from '../js/room';

describe('Room Functions', () => {
  let room;

  beforeEach(() => {
    room = createRoom('Test Room', 25);
  });

  test('createRoom initializes properties correctly', () => {
    expect(room.name).toBe('Test Room');
    expect(room.currTemp).toBe(25);
    expect(room.coldPreset).toBe(20);
    expect(room.warmPreset).toBe(32);
    expect(room.airConditionerOn).toBe(false);
    expect(room.startTime).toBe('16:30');
    expect(room.endTime).toBe('20:00');
  });

  test('setCurrTemp returns a new room with updated current temperature', () => {
    const updatedRoom = setCurrTemp(room, 22);
    expect(updatedRoom.currTemp).toBe(22);
    expect(room.currTemp).toBe(25); // Original room should not be mutated
  });

  test('setColdPreset returns a new room with updated cold preset', () => {
    const updatedRoom = setColdPreset(room, 18);
    expect(updatedRoom.coldPreset).toBe(18);
    expect(room.coldPreset).toBe(20);
  });

  test('setWarmPreset returns a new room with updated warm preset', () => {
    const updatedRoom = setWarmPreset(room, 28);
    expect(updatedRoom.warmPreset).toBe(28);
    expect(room.warmPreset).toBe(32);
  });

  test('decreaseTemp returns a new room with decremented temperature (min 10)', () => {
    const room1 = createRoom('Test', 15);
    const updatedRoom1 = decreaseTemp(room1);
    expect(updatedRoom1.currTemp).toBe(14);
    expect(room1.currTemp).toBe(15);

    const room2 = createRoom('Test', 10);
    const updatedRoom2 = decreaseTemp(room2);
    expect(updatedRoom2.currTemp).toBe(10);
    expect(room2.currTemp).toBe(10);
  });

  test('increaseTemp returns a new room with incremented temperature (max 32)', () => {
    const room1 = createRoom('Test', 30);
    const updatedRoom1 = increaseTemp(room1);
    expect(updatedRoom1.currTemp).toBe(31);
    expect(room1.currTemp).toBe(30);

    const room2 = createRoom('Test', 32);
    const updatedRoom2 = increaseTemp(room2);
    expect(updatedRoom2.currTemp).toBe(32);
    expect(room2.currTemp).toBe(32);
  });

  test('toggleAircon returns a new room with toggled airConditionerOn state', () => {
    const updatedRoom1 = toggleAircon(room);
    expect(updatedRoom1.airConditionerOn).toBe(true);
    expect(room.airConditionerOn).toBe(false);

    const updatedRoom2 = toggleAircon(updatedRoom1);
    expect(updatedRoom2.airConditionerOn).toBe(false);
    expect(updatedRoom1.airConditionerOn).toBe(true);
  });
});