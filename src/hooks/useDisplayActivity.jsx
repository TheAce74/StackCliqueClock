import { checkLargest, clockInfo } from "../utils/retrieveInfo";

function useDisplayActivity() {
  const displayInfo = (checkIn, checkOut) => {
    const length = checkLargest(checkIn.length, checkOut.length);
    const activities = [];
    for (let i = 0; i < length; i++) {
      if (checkIn[i] && checkOut[i]) {
        activities.push({
          action: "Checked In",
          ...clockInfo(checkIn[i]),
        });
        activities.push({
          action: "Checked Out",
          ...clockInfo(checkOut[i]),
        });
      } else if (checkIn[i]) {
        activities.push({
          action: "Checked In",
          ...clockInfo(checkIn[i]),
        });
      } else {
        activities.push({
          action: "Checked Out",
          ...clockInfo(checkOut[i]),
        });
      }
    }
    return activities.sort((a, b) => b.date - a.date);
  };

  return { displayInfo };
}

export { useDisplayActivity };
