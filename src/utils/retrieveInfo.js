const checkLargest = (first, second) => {
  return first > second ? first : second;
};

const clockInfo = (param) => {
  const date = new Date(param);
  const dateString = date.toUTCString().split(" ").slice(0, 4).join(" ");
  const timeString = `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
  return { dateString, timeString, date };
};

export { checkLargest, clockInfo };
