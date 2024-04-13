function formatDecimal(value) {
  // Format the value to two decimal places before storing it
  if (value < 1) {
    return value;
  }
  return parseFloat(value.toFixed(2));
}


function extractFilenameFromUrl(url) {
  const parsedUrl = new URL(url);
  const pathParts = parsedUrl.pathname.split('/');
  return pathParts[pathParts.length - 1];
}

function hasObjectChanged(obj1, obj2) {
  // Check if both arguments are objects
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return false;
  }

  // Check if the number of keys is different
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return getAllChangedValues(obj1, obj2);
  }

  // Compare the values of each key
  const changedValues = {};
  for (let key in obj1) {
    if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      const nestedChanges = hasObjectChanged(obj1[key], obj2[key]);
      if (nestedChanges !== false) {
        changedValues[key] = nestedChanges;
      }
    } else if (obj1[key] !== obj2[key]) {
      changedValues[key] = obj2[key];
    }
  }

  if (Object.keys(changedValues).length === 0) {
    return false;
  }

  return changedValues;
}
function getAllChangedValues(obj1, obj2) {
  const changedValues = {};

  for (let key in obj1) {
    if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      const nestedChanges = hasObjectChanged(obj1[key], obj2[key]);
      if (nestedChanges !== false) {
        changedValues[key] = nestedChanges;
      }
    } else if (obj1[key] !== obj2[key]) {
      changedValues[key] = obj2[key];
    }
  }

  for (let key in obj2) {
    if (!obj1.hasOwnProperty(key)) {
      changedValues[key] = obj2[key];
    }
  }

  if (Object.keys(changedValues).length === 0) {
    return false;
  }

  return changedValues;
}
function convertToUpdateObject(mainKey, obj) {
  const updateObj = {};
  for (const [key, value] of Object.entries(obj)) {
    updateObj[`${mainKey}.$.${key}`] = value;
  }
  return updateObj;
}


const fs = require("fs");

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

function createFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
}

// Function to convert Date object, time string, or date string to numeric representation
function convertDateTimeToNumeric(dateOrTime) {
  let numericTime = null;

  if (typeof dateOrTime === 'object' && dateOrTime instanceof Date) {
    const hours = dateOrTime.getHours();
    const minutes = dateOrTime.getMinutes();
    numericTime = hours * 100 + minutes;
  } else if (typeof dateOrTime === 'string') {
    const timeRegex = /^(\d{2}):(\d{2})$/; // Regex to match time format HH:mm

    if (timeRegex.test(dateOrTime)) {
      const [hours, minutes] = dateOrTime.split(':').map(Number);
      if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        numericTime = hours * 100 + minutes;
      }
    } else if (/^\d{4}$/.test(dateOrTime)) {
      const hours = Math.floor(dateOrTime / 100);
      const minutes = dateOrTime % 100;
      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        numericTime = hours * 100 + minutes;
      }
    } else {
      const dateObject = new Date(dateOrTime);

      if (!isNaN(dateObject)) {
        const hours = dateObject.getHours();
        const minutes = dateObject.getMinutes();
        numericTime = hours * 100 + minutes;
      }
    }
  }

  return numericTime;
}

// // Example usage with Date object
// const currentDate = new Date();
// const timeResult = convertDateTimeToNumeric(currentDate);
// console.log(timeResult); // Output: Current time in numeric format, e.g., 1530

// // Example usage with date string "YYYY-MM-DD"
// const dateString = '2022-02-01';
// const timeResult2 = convertDateTimeToNumeric(dateString);
// console.log(timeResult2); // Output: Numeric representation of time, e.g., 0 (midnight)

// // Example usage with ISO 8601 formatted string
// const isoString = '2023-06-16T12:33:43.394Z';
// const timeResult3 = convertDateTimeToNumeric(isoString);
// console.log(timeResult3); // Output: Numeric representation of time, e.g., 1233

// // Example usage with time string "HH:mm"
// const timeString = '17:04';
// const timeResult4 = convertDateTimeToNumeric(timeString);
// console.log(timeResult4); // Output: Numeric representation of time, e.g., 1704

// // Example usage with four-digit number
// const numericTime = 1405;
// const timeResult5 = convertDateTimeToNumeric(numericTime);
// console.log(timeResult5); // Output: Numeric representation of time, e.g., 1405

const sortTimeSlot = (timeSlots) => {
  return timeSlots.sort((a, b) => {
    const startTimeA = a.start_time.toString().padStart(4, '0');
    const startTimeB = b.start_time.toString().padStart(4, '0');
    return startTimeA.localeCompare(startTimeB);
  });
};


function calculateMinutes(timeSlots) {
  if (Array.isArray(timeSlots)) {
    for (const slot of timeSlots) {
      const { start_time, end_time } = slot;
      const startHours = Math.floor(start_time / 100); // Extract hours from start time
      const startMinutes = start_time % 100; // Extract minutes from start time
      const endHours = Math.floor(end_time / 100); // Extract hours from end time
      const endMinutes = end_time % 100; // Extract minutes from end time

      const startTotalMinutes = startHours * 60 + startMinutes; // Convert start time to total minutes
      const endTotalMinutes = endHours * 60 + endMinutes; // Convert end time to total minutes

      const slotDuration = endTotalMinutes - startTotalMinutes; // Calculate duration in minutes for current slot
      slot.minutes = slotDuration; // Add minutes property to the current slot
    }
    return sortTimeSlot(timeSlots);
  } else if (typeof timeSlots === 'object') {
    const { start_time, end_time } = timeSlots;
    const startHours = Math.floor(start_time / 100); // Extract hours from start time
    const startMinutes = start_time % 100; // Extract minutes from start time
    const endHours = Math.floor(end_time / 100); // Extract hours from end time
    const endMinutes = end_time % 100; // Extract minutes from end time

    const startTotalMinutes = startHours * 60 + startMinutes; // Convert start time to total minutes
    const endTotalMinutes = endHours * 60 + endMinutes; // Convert end time to total minutes

    const slotDuration = endTotalMinutes - startTotalMinutes; // Calculate duration in minutes for the slot

    return { ...timeSlots, minutes: slotDuration };
  } else {
    throw new Error('Invalid input format. Please provide an array of time slots or an object with start_time and end_time.');
  }
}


function formatDate(date) {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

function formatTime(time) {
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return ` ${formattedHours}:${formattedMinutes} ${period}`;
}

const availabilitySort = (data, teamMemberLength) => {
  const sortedDates = Object.keys(data)
    .filter(date => {
      return data[date].length == teamMemberLength;
    })
    .sort((a, b) => {
      const dateA = new Date(a.split('-').reverse().join('-'));
      const dateB = new Date(b.split('-').reverse().join('-'));
      return dateA - dateB;
    })


  const sortedResponse = {};
  sortedDates.forEach(date => {
    sortedResponse[date] = data[date];
  })

  return sortedResponse;
};

function getTimeRange(array) {
  let startTime = Infinity;
  let endTime = -Infinity;
  let totalMinutes = 0;


  array.forEach(obj => {
    if (obj.start_time < startTime) {
      startTime = obj.start_time;
    }
    if (obj.end_time > endTime) {
      endTime = obj.end_time;
    }
    if(obj.minutes){
    totalMinutes += obj.minutes;
    }
  });

  return { start_time_range: startTime, end_time_range: endTime, minutes: totalMinutes };
}





function generateTimeSlots(start_time_range, end_time_range, exclusions, min_req) {
  if (typeof min_req === 'undefined') {
    return generateTimeSlotsWithoutMinReq(start_time_range, end_time_range, exclusions);
  } else {
    return generateTimeSlotsWithMinReq(start_time_range, end_time_range, exclusions, min_req);
  }
}

function generateTimeSlotsWithoutMinReq(start_time_range, end_time_range, exclusions) {
  let currentTime = start_time_range;
  let availTime = [];

  let sort_exc = sortTimeSlot(exclusions);

  for (const exclusion of sort_exc) {
    const { start_time, end_time } = exclusion;

    if (currentTime < start_time) {
      availTime.push({
        start_time: currentTime,
        end_time: start_time,
        minutes: Math.floor(start_time / 100) * 60 + (start_time % 100) - Math.floor(currentTime / 100) * 60 - (currentTime % 100),
        isAvailable: true
      });
    }

    availTime.push({
      ...exclusion,
      start_time: start_time,
      end_time: end_time,
      minutes: Math.floor(end_time / 100) * 60 + (end_time % 100) - Math.floor(start_time / 100) * 60 - (start_time % 100),
      isAvailable: false,
    });

    currentTime = end_time;
  }

  if (currentTime < end_time_range) {
    availTime.push({
      start_time: currentTime,
      end_time: end_time_range,
      minutes: Math.floor(end_time_range / 100) * 60 + (end_time_range % 100) - Math.floor(currentTime / 100) * 60 - (currentTime % 100),
      isAvailable: true
    });
  }

  return availTime;
}

function generateTimeSlotsWithMinReq(start_time_range, end_time_range, exclusions, min_req) {
  const startTime = timeToNumber(start_time_range);
  const endTime = timeToNumber(end_time_range);

  const slots = [];
  let currentTime = startTime;

  for (const exclusion of exclusions) {
    const { start_time, end_time } = exclusion;
    const exclusionStart = timeToNumber(start_time);
    const exclusionEnd = timeToNumber(end_time);

    if (exclusionStart > currentTime) {
      while (currentTime + min_req <= exclusionStart) {
        slots.push({
          ...exclusion,
          start_time: numberToTime(currentTime),
          end_time: numberToTime(currentTime + min_req),
          minutes: min_req,
          isAvailable: true
        });
        currentTime += min_req;
      }
    }

    slots.push({
      ...exclusion,
      start_time: start_time,
      end_time: end_time,
      minutes: exclusionEnd - exclusionStart,
      isAvailable: false
    });

    currentTime = exclusionEnd;
  }

  while (currentTime + min_req <= endTime) {
    slots.push({
      start_time: numberToTime(currentTime),
      end_time: numberToTime(currentTime + min_req),
      minutes: min_req,
      isAvailable: true
    });
    currentTime += min_req;
  }

  return slots;
}

const timeToNumber = (time) => {
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  return hours * 60 + minutes;
};

const numberToTime = (number) => {
  const hours = Math.floor(number / 60);
  const minutes = number % 60;
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  return Number(`${formattedHours}${formattedMinutes}`);
};

let exclusions = [
  {
    start_time: 1200,
    end_time: 1230,
    name: "sameer"
  }
];

// console.log(timeToNumber(1230))
// console.log(numberToTime(750))
// 750
// 1230


// let minutes_requirement = 30;
// let data = generateTimeSlots(1200, 1400, exclusions,minutes_requirement);
// console.log(data);

// [
//   {
//     start_time: 1200,
//     end_time: 1230,
//     name: 'sameer',
//     minutes: 30,
//     isAvailable: false
//   },
//   { start_time: 1230, end_time: 1300, minutes: 30, isAvailable: true },
//   { start_time: 1300, end_time: 1330, minutes: 30, isAvailable: true },
//   { start_time: 1330, end_time: 1400, minutes: 30, isAvailable: true }
// ]


function addTimeInTime(initialTime, secondsToAdd) {
  const totalSeconds = Math.floor(initialTime / 100) * 60 + (initialTime % 100) + secondsToAdd;
  const resultTime = (Math.floor(totalSeconds / 60) * 100) + (totalSeconds % 60);
  return resultTime;
}

// Examples
// console.log(addTimeInTime(1200, 30));  // Output: 1230
// console.log(addTimeInTime(1200, 60));  // Output: 1300
// console.log(addTimeInTime(1300, 120)); // Output: 1430








// -----------------------------------------------------------------------------------------------------------------



const moment = require('moment');

function createDateQuery(id) {
  const currentDate = moment();
  const startOfToday = currentDate.startOf('day');
  const endOfToday = currentDate.endOf('day');

  const dateQueries = {
    past: { date: { $lt: startOfToday.toISOString() } },
    today: {
      date: {
        $gte: startOfToday.toISOString(),
        $lt: endOfToday.toISOString()
      }
    },
    this_week: {
      date: {
        $gte: moment().startOf('week').toISOString(),
        $lt: moment().endOf('week').toISOString()
      }
    },
    this_month: {
      date: {
        $gte: moment().startOf('month').toISOString(),
        $lt: moment().endOf('month').toISOString()
      }
    },
    upcoming: { date: { $gte: moment().endOf('month').toISOString() } } // Upcoming dates are greater than the end of the current month
  };

  return dateQueries[id] || null; // Return the corresponding query or null if the id is unknown
}


const statusMap = {
  rejected: "REJECTED",
  unapproved: "UNAPPROVED",
  cancelled: "CANCELLED",
  change_request: "CHANGE REQUEST",
  completed: "COMPLETED",


  past: "PAST",
  today: "TODAY",
  confirmed: "CONFIRMED",
  this_week: "THIS WEEK",
  this_month: "THIS MONTH",
  upcoming: "UPCOMING",
};


const convertCurrency = (amount, type) => {
  if (type == 'cents') {
    return Math.round(amount * 100);
  } else if (type === 'dollars') {
    return amount / 100;
  } else {
    throw new Error('Invalid conversion type. Use "dollarsToCents" or "centsToDollars".');
  }
};

module.exports = {
  formatDecimal,
  
  extractFilenameFromUrl,
  hasObjectChanged,
  convertToUpdateObject,
  deleteFolderRecursive,
  createFolder,

  convertDateTimeToNumeric,
  calculateMinutes,
  sortTimeSlot,

  formatDate,formatTime,
  availabilitySort,
  getTimeRange,

  generateTimeSlots,

  createDateQuery,
  addTimeInTime,
  convertCurrency
}