export const addTwoDays = (dateString) => {
  if (!dateString) return "—";

  const date = new Date(dateString);
  console.log(date);
  date.setDate(date.getDate() + 2);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;

};

export const addThreeDays = (dateString) => {
  if (!dateString) return "—";

  const d = new Date(dateString);
  d.setDate(d.getDate() + 5);

  return `${String(d.getDate()).padStart(2, "0")}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}-${d.getFullYear()}`;
};

export const addFourDays = (dateString) => {
  if (!dateString) return "—";

  const d = new Date(dateString);
  d.setDate(d.getDate() + 9);

  return `${String(d.getDate()).padStart(2, "0")}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}-${d.getFullYear()}`;
};

export const addFiveDays = (dateString) => {
  if (!dateString) return "—";

  const d = new Date(dateString);
  d.setDate(d.getDate() + 14);

  return `${String(d.getDate()).padStart(2, "0")}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}-${d.getFullYear()}`;
};
