/**
 * @jest-environment jsdom
 */
import {
  toggleACStatus,
  changeTemperature,
  addRoom,
  savePreset,
  handleFormSubmit,
  turnOnAllACs,
} from "../js/thermostat"; // Adjust path based on your setup

describe("Smart Thermostat Functions", () => {
  let rooms;

  beforeEach(() => {
    // Set up a sample state for rooms
    rooms = [
      { id: 1, name: "Living Room", isOn: false, temperature: 22 },
      { id: 2, name: "Bedroom", isOn: true, temperature: 24 },
    ];
  });

  test("toggleACStatus should toggle the AC status of a room", () => {
    const updatedRoom = toggleACStatus(rooms, 1);
    expect(updatedRoom.isOn).toBe(true);

    const updatedAgain = toggleACStatus(rooms, 1);
    expect(updatedAgain.isOn).toBe(false);
  });

  test("changeTemperature should increase temperature by delta", () => {
    const updatedRoom = changeTemperature(rooms, 2, 2);
    expect(updatedRoom.temperature).toBe(26);
  });

  test("changeTemperature should decrease temperature by delta", () => {
    const updatedRoom = changeTemperature(rooms, 2, -3);
    expect(updatedRoom.temperature).toBe(21);
  });

  test("addRoom should add a new room", () => {
    const newRooms = addRoom(rooms, "Kitchen");
    expect(newRooms.length).toBe(3);
    expect(newRooms[2].name).toBe("Kitchen");
    expect(newRooms[2].isOn).toBe(false);
  });

  test("savePreset should store preset values", () => {
    const preset = { name: "Evening", temperature: 20, time: "18:00" };
    const saved = savePreset(preset);
    expect(saved).toMatchObject(preset);
  });
});

describe("Smart Thermostat Event Handlers", () => {
  test("handleFormSubmit should prevent default behavior", () => {
    const event = {
      preventDefault: jest.fn(),
      target: {
        elements: {
          name: { value: "Guest Room" },
          temp: { value: "21" },
        },
      },
    };

    handleFormSubmit(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  test("turnOnAllACs should set all rooms to on", () => {
    const rooms = [
      { id: 1, isOn: false },
      { id: 2, isOn: false },
    ];
    const updated = turnOnAllACs(rooms);
    expect(updated.every((r) => r.isOn)).toBe(true);
  });
});
