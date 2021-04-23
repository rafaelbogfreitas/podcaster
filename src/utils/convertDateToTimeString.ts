const convertDateToTimeString = (duration: number): string => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration / 60);

  const result = [hours, minutes, seconds];

  const time = result.map((item) => String(item).padStart(2, '0')).join(':');

  return time;
};

export default convertDateToTimeString;
