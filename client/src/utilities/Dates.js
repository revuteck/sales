const normalize = (d) => {
  const x = new Date(d);
  x.setHours(0,0,0,0);
  return x;
};

export const isTomorrow = (dateString) => {
  if (!dateString) return false;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return normalize(dateString).getTime() === normalize(tomorrow).getTime();
};