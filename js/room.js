export const createRoom = (name, currTemp, coldPreset = 20, warmPreset = 32, image = '', airConditionerOn = false, startTime = '16:30', endTime = '20:00') => ({
  name,
  currTemp,
  coldPreset,
  warmPreset,
  image,
  airConditionerOn,
  startTime,
  endTime,
});

export const setCurrTemp = (room, newTemp) => ({ ...room, currTemp: newTemp });

export const setColdPreset = (room, newCold) => ({ ...room, coldPreset: newCold });

export const setWarmPreset = (room, newWarm) => ({ ...room, warmPreset: newWarm });

export const decreaseTemp = (room) => ({ ...room, currTemp: Math.max(room.currTemp - 1, 10) });

export const increaseTemp = (room) => ({ ...room, currTemp: Math.min(room.currTemp + 1, 32) });

export const toggleAircon = (room) => ({ ...room, airConditionerOn: !room.airConditionerOn });