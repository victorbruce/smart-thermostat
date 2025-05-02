/**
 * @jest-environment jsdom
 */
import fs from 'fs';
import path from 'path';

// Load the HTML and JS before tests
const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

describe('Thermostat Event Handlers', () => {
  let increaseBtn, reduceBtn, coolBtn, warmBtn, currentTemp, rooms, roomSelect;

  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
    jest.resetModules();
    require('./main.js'); // the file where your DOMContentLoaded logic exists

    increaseBtn = document.getElementById('increase');
    reduceBtn = document.getElementById('reduce');
    coolBtn = document.getElementById('cool');
    warmBtn = document.getElementById('warm');
    currentTemp = document.getElementById('temp');
    roomSelect = document.getElementById('rooms');
  });

  test('should increase temperature by 1', () => {
    const initialTemp = parseInt(currentTemp.textContent);
    increaseBtn.click();

    const updatedTemp = parseInt(currentTemp.textContent);
    expect(updatedTemp).toBe(initialTemp + 1);
  });

  test('should decrease temperature by 1', () => {
    const initialTemp = parseInt(currentTemp.textContent);
    reduceBtn.click();

    const updatedTemp = parseInt(currentTemp.textContent);
    expect(updatedTemp).toBe(initialTemp - 1);
  });

  test('should set cool preset temperature', () => {
    coolBtn.click();
    const temp = parseInt(currentTemp.textContent);
    expect(temp).toBeLessThanOrEqual(24); // coldPreset = 20
  });

  test('should set warm preset temperature', () => {
    warmBtn.click();
    const temp = parseInt(currentTemp.textContent);
    expect(temp).toBeGreaterThanOrEqual(25); // warmPreset = 32
  });

  test('should update temperature display on room change', () => {
    roomSelect.value = 'Kitchen';
    const event = new Event('change');
    roomSelect.dispatchEvent(event);

    const selectedOption = [...roomSelect.options].find(opt => opt.selected);
    expect(document.querySelector('.room-name').textContent).toContain(selectedOption.value);
    expect(currentTemp.textContent).toContain('°');
  });
});
