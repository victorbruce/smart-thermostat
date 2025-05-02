import {
  createRoom,
  setCurrTemp as updateCurrTemp,
  setColdPreset as updateColdPreset,
  setWarmPreset as updateWarmPreset,
  decreaseTemp as reduceTemp,
  increaseTemp as raiseTemp,
  toggleAircon as switchAircon,
} from "./room.js";

// Room objects
document.addEventListener("DOMContentLoaded", () => {
  let rooms = [
    createRoom(
      "Living Room",
      32,
      20,
      32,
      "./assets/living-room.jpg",
      false,
      "16:30",
      "20:00"
    ),
    createRoom(
      "Kitchen",
      29,
      20,
      32,
      "./assets/kitchen.jpg",
      false,
      "16:30",
      "20:00"
    ),
    createRoom(
      "Bathroom",
      30,
      20,
      32,
      "./assets/bathroom.jpg",
      false,
      "16:30",
      "20:00"
    ),
    createRoom(
      "Bedroom",
      31,
      20,
      32,
      "./assets/bedroom.jpg",
      false,
      "16:30",
      "20:00"
    ),
  ];

  const coolOverlay = `linear-gradient(
    to bottom,
    rgba(141, 158, 247, 0.2),
    rgba(194, 197, 215, 0.1)
  )`;

  const warmOverlay = `linear-gradient(to bottom, rgba(236, 96, 98, 0.2), rgba(248, 210, 211, 0.13))`;

  const setInitialOverlay = () => {
    document.querySelector(
      ".room"
    ).style.backgroundImage = `url('${rooms[0].image}')`;

    document.querySelector(".room").style.backgroundImage = `${
      rooms[0].currTemp < 25 ? coolOverlay : warmOverlay
    }, url('${rooms[0].image}')`;
  };

  const setOverlay = (room) => {
    document.querySelector(".room").style.backgroundImage = `${
      room.currTemp < 25 ? coolOverlay : warmOverlay
    }, url('${room.image}')`;
  };

  // Set svg accordingly
  const svgPoint = document.querySelector(".point");
  const angleOffset = 86;
  const calculatePointPosition = (currTemp) => {
    const normalizedTemp = (currTemp - 10) / (32 - 10);
    const angle = normalizedTemp * 180 + angleOffset;

    const radians = (angle * Math.PI) / 180;
    const radius = 116;

    const translateX = radius * Math.cos(radians);
    const translateY = radius * Math.sin(radians);

    return { translateX, translateY };
  };

  const setIndicatorPoint = (currTemp) => {
    const position = calculatePointPosition(currTemp);
    svgPoint.style.transform = `translate(${position.translateX}px, ${position.translateY}px)`;
  };

  // Handle the dropdown data
  const roomSelect = document.getElementById("rooms");

  const currentTemp = document.getElementById("temp");

  let selectedRoom = rooms[0].name;

  // Set default temperature
  currentTemp.textContent = `${rooms[0].currTemp}°`;

  setInitialOverlay();

  document.querySelector(".currentTemp").innerText = `${rooms[0].currTemp}°`;

  // Add new options from rooms array
  rooms.forEach((room) => {
    const option = document.createElement("option");
    option.value = room.name;
    option.textContent = room.name;
    roomSelect.appendChild(option);
  });

  // Set current temperature to currently selected room

  const setSelectedRoom = (selectedRoom) => {
    const room = rooms.find((currRoom) => currRoom.name === selectedRoom);

    setIndicatorPoint(room.currTemp);

    //   set the current stats to current room temperature
    currentTemp.textContent = `${room.currTemp}°`;

    // Set the current room image
    setOverlay(room);

    // Set the current room name
    document.querySelector(".room-name").innerText = selectedRoom;

    document.querySelector(".currentTemp").innerText = `${room.currTemp}°`;
  };

  roomSelect.addEventListener("change", function () {
    selectedRoom = this.value;

    setSelectedRoom(selectedRoom);
  });

  // Set preset temperatures
  const defaultSettings = document.querySelector(".default-settings");

  defaultSettings.addEventListener("click", function (e) {
    // ensure that nested elements inside the button are treated as clicks on the button itself
    const clickedBtn = e.target.closest("#cool, #warm");
    if (!clickedBtn) return;

    // get the current selected room
    const room = rooms.find((room) => room.name === selectedRoom);
    if (!room) return;

    // set preset and update current temp value when button is clicked
    const preset = clickedBtn.id === "cool" ? room.coldPreset : room.warmPreset;
    room.setCurrTemp(preset);

    // update text
    const tempText = `${room.currTemp}°`;
    currentTemp.textContent = tempText;
    document.querySelector(".currentTemp").innerText = tempText;
  });

  // Increase and decrease temperature
  document.getElementById("increase").addEventListener("click", () => {
    const room = rooms.find((currRoom) => currRoom.name === selectedRoom);

    if (room.currTemp < 32) {
      room.increaseTemp();
    } else {
      room.currTemp = 32;
    }

    setIndicatorPoint(room.currTemp);
    currentTemp.textContent = `${room.currTemp}°`;

    generateRooms();

    setOverlay(room);

    warmBtn.style.backgroundColor = "#d9d9d9";
    coolBtn.style.backgroundColor = "#d9d9d9";

    document.querySelector(".currentTemp").innerText = `${room.currTemp}°`;
  });

  document.getElementById("reduce").addEventListener("click", () => {
    const room = rooms.find((currRoom) => currRoom.name === selectedRoom);

    if (room.currTemp > 10) {
      room.decreaseTemp();
    } else {
      room.currTemp = 10;
    }

    setIndicatorPoint(room.currTemp);
    currentTemp.textContent = `${room.currTemp}°`;

    generateRooms();

    setOverlay(room);

    warmBtn.style.backgroundColor = "#d9d9d9";
    coolBtn.style.backgroundColor = "#d9d9d9";

    document.querySelector(".currentTemp").innerText = `${room.currTemp}°`;
  });

  const coolBtn = document.getElementById("cool");
  const warmBtn = document.getElementById("warm");

  const inputsDiv = document.querySelector(".inputs");
  // Toggle preset inputs
  document.getElementById("newPreset").addEventListener("click", () => {
    if (inputsDiv.classList.contains("hidden")) {
      inputsDiv.classList.remove("hidden");
    }
  });

  // close inputs
  document.getElementById("close").addEventListener("click", () => {
    inputsDiv.classList.add("hidden");
  });

  // handle preset input data
  document.getElementById("save").addEventListener("click", () => {
    const coolInput = document.getElementById("coolInput");
    const warmInput = document.getElementById("warmInput");
    const errorSpan = document.querySelector(".error");

    if (coolInput.value && warmInput.value) {
      // Validate the data
      if (coolInput.value < 10 || coolInput.value > 24) {
        errorSpan.style.display = "block";
        errorSpan.innerText = "Enter valid temperatures (10° - 32°)";
      }

      if (warmInput.value < 25 || warmInput.value > 32) {
        errorSpan.style.display = "block";
        errorSpan.innerText = "Enter valid temperatures (10° - 32°)";
      }
      // Validation passed
      // Set current room's presets
      const currRoom = rooms.find((room) => room.name === selectedRoom);

      if (coolInput.value >= 10 && coolInput.value < 25) {
        currRoom.setColdPreset(+coolInput.value);

        errorSpan.innerText = "";
      } else {
        errorSpan.innerText = "Enter valid temperatures (10° - 32°)";
      }

      if (warmInput.value > 24 && warmInput.value < 32) {
        currRoom.setWarmPreset(+warmInput.value);
        errorSpan.innerText = "";
      } else {
        errorSpan.innerText = "Enter valid temperatures (10° - 32°)";
      }

      if (warmInput.value > 24 && warmInput.value < 32) {
        currRoom.setWarmPreset(+warmInput.value);
        errorSpan.innerText = "";
      } else {
        errorSpan.innerText = "Enter valid temperatures (10° - 32°)";
      }

      coolInput.value = "";
      warmInput.value = "";
    }
  });

  // Rooms Control
  // Generate rooms
  const generateRooms = () => {
    const roomsControlContainer = document.querySelector(".rooms-control");
    let roomsHTML = "";

    rooms.forEach((room) => {
      roomsHTML += `
    <div class="room-control" id="${room.name}">
          <div class="top">
            <h3 class="room-name">${room.name} - ${room.currTemp}°</h3>
            <div class="room-control__btns">
            <button class="switch">
              <ion-icon name="power-outline" class="${
                room.airConditionerOn ? "powerOn" : ""
              }"></ion-icon>
            </button>
            <button class="schedule"><ion-icon name="time" class="icon-time"></ion-icon></button>
            </div>
          </div>

          ${displayTime(room)}
         
          <span class="room-status" style="display: ${
            room.airConditionerOn ? "" : "none"
          }">${room.currTemp < 25 ? "Cooling room to: " : "Warming room to: "}${
        room.currTemp
      }°</span>
        </div>
    `;
    });

    roomsControlContainer.innerHTML = roomsHTML;
  };
  const displayTime = (room) => {
    return `
      <div class="time-display">
        <span class="time">${room.startTime}</span>
        <div class="bars">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>
        <span class="time">${room.endTime}</span>
      </div>
  `;
  };

  generateRooms();

  document.querySelector(".rooms-control").addEventListener("click", (e) => {
    if (e.target.classList.contains("switch")) {
      const room = rooms.find(
        (room) => room.name === e.target.parentNode.parentNode.id
      );
      room.toggleAircon();
      generateRooms();
    }

    if (e.target.classList.contains("room-name")) {
      setSelectedRoom(e.target.parentNode.parentNode.id);
    }
  });

  const modal = document.getElementById("modal");
  const addRoomBtn = document.getElementById("add-room");
  const closeModal = document.getElementById("closeModal");
  const saveRoomBtn = document.getElementById("saveRoomBtn");

  function populateDropdown() {
    roomSelect.innerHTML = "";
    rooms.forEach((room) => {
      const option = document.createElement("option");
      option.value = room.name;
      option.textContent = room.name;
      roomSelect.appendChild(option);
    });
  }

  addRoomBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  saveRoomBtn.addEventListener("click", () => {
    const roomNameInput = document.getElementById("roomNameInput");
    const currTempInput = document.getElementById("currTempInput");
    const imageInput = document.getElementById("imageInput");
    const acCheckbox = document.getElementById("acCheckbox");
    const acStartTime = document.getElementById("acStartTime").value;
    const acFinishTime = document.getElementById("acFinishTime").value;
    const temp = parseInt(currTempInput.value);

    if (!roomNameInput || !currTempInput || !acStartTime || !acFinishTime) {
      alert("Please fill in all required fields");
      return;
    }

    if (isNaN(temp) || temp < 10 || temp > 32) {
      alert("Please enter a temperature from 10 to 32.");
      return;
    }

    const room = {
      name: roomNameInput.value,
      currTemp: temp,
      coldPreset: 20,
      warmPreset: 32,
      image: imageInput.value,
      airConditionerOn: acCheckbox.checked,
      startTime: acStartTime,
      endTime: acFinishTime,
      setCurrTemp(temp) {
        this.currTemp = temp;
      },

      setColdPreset(newCold) {
        this.coldPreset = newCold;
      },

      setWarmPreset(newWarm) {
        this.warmPreset = newWarm;
      },

      decreaseTemp() {
        this.currTemp--;
      },

      increaseTemp() {
        this.currTemp++;
      },
      toggleAircon() {
        this.airConditionerOn
          ? (this.airConditionerOn = false)
          : (this.airConditionerOn = true);
      },
    };

    rooms.push(room);
    scheduleAC(room);
    populateDropdown();
    generateRooms();

    // ✅ Clear input fields
    roomNameInput.value = "";
    currTempInput.value = "";
    imageInput.value = "";
    acCheckbox.checked = false;
    document.getElementById("acStartTime").value = "";
    document.getElementById("acFinishTime").value = "";

    modal.classList.add("hidden");
  });

  function scheduleAC(room) {
    const [startHour, startMinute] = room.startTime.split(":").map(Number);
    const [endHour, endMinute] = room.endTime.split(":").map(Number);

    // Check current time at regular intervals
    setInterval(function () {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();

      const isStartTime =
        currentHour === startHour && currentMinute === startMinute;
      const isEndTime = currentHour === endHour && currentMinute === endMinute;

      // turn AC on if it is start time and ac is off
      if (isStartTime && !room.airConditionerOn) {
        room.toggleAircon();
        generateRooms();
        showToast(`${room.name} AC is now ON`);
      }

      // turn AC off if it is end time and ac is on
      if (isEndTime && room.airConditionerOn) {
        // Turn the AC off
        room.toggleAircon();
        generateRooms();
        showToast(`${room.name} AC is now OFF`);
      }
    }, 60000); // Check every minute
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    toast.classList.remove("hidden");

    setTimeout(() => {
      toast.classList.remove("show");
      toast.classList.add("hidden");
    }, 4000);
  }

  document.getElementById("turnOnAllACs").addEventListener("click", () => {
    rooms.forEach((room) => {
      if (!room.airConditionerOn) {
        room.toggleAircon();
      }
    });
    generateRooms(); // Refresh UI
    showToast("All ACs are now ON");
  });

  let currentScheduleRoom = null;

  document.querySelector(".rooms-control").addEventListener("click", (e) => {
    // Power toggle
    if (e.target.closest(".switch")) {
      const room = rooms.find(
        (room) => room.name === e.target.closest(".room-control").id
      );
      room.toggleAircon();
      generateRooms();
      return;
    }

    // Room select
    if (e.target.classList.contains("room-name")) {
      setSelectedRoom(e.target.closest(".room-control").id);
      return;
    }

    // Schedule button
    if (e.target.closest(".schedule")) {
      const roomId = e.target.closest(".room-control").id;
      currentScheduleRoom = rooms.find((r) => r.name === roomId);
      document.getElementById("scheduleModal").classList.remove("hidden");
    }
  });

  document
    .getElementById("closeScheduleModal")
    .addEventListener("click", () => {
      document.getElementById("scheduleModal").classList.add("hidden");
    });

  document.getElementById("saveSchedule").addEventListener("click", () => {
    const start = document.getElementById("scheduleStart").value;
    const end = document.getElementById("scheduleEnd").value;

    if (!start || !end || !currentScheduleRoom) {
      alert("Please enter both start and end times.");
      return;
    }

    currentScheduleRoom.startTime = start;
    currentScheduleRoom.endTime = end;

    scheduleAC(currentScheduleRoom);
    generateRooms(); // Refresh display
    document.getElementById("scheduleModal").classList.add("hidden");

    showToast(`${currentScheduleRoom.name} AC schedule updated`);
  });
});
