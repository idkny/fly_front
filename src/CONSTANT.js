export const CONSTANT = {
  server: "https://react-fly-backend.herokuapp.com",
  client: "https://weiss-flight.herokuapp.com",
};

export const checkLoginFromLogin = () => {
  return localStorage.getItem("loggedin") &&
    JSON.parse(localStorage.getItem("loggedin")).data
    ? true
    : false;
};

export const checkLoginFromNonLogin = () => {
  return localStorage.getItem("loggedin") &&
    JSON.parse(localStorage.getItem("loggedin")).data
    ? false
    : true;
};

export const checkLoginFromNonLoginAirline = () => {
  return localStorage.getItem("loggedin") &&
    JSON.parse(localStorage.getItem("loggedin")).data.role === "airlineOwner"
    ? false
    : true;
};

export const checkLoginFromNonLoginNormal = () => {
  return localStorage.getItem("loggedin") &&
    JSON.parse(localStorage.getItem("loggedin")).data.role === "user"
    ? false
    : true;
};

export const Loader = (extra = "") => {
  return (
    <div class={`spinner-grow ${extra}`} role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  );
};

export const setMessage = (text, color) => {
  try {
    let error = document.getElementById("error");
    error.innerHTML = text;
    error.classList.add("text-" + color);
    error.style.display = "block";
  } catch (e) {}
};

export const resetMessage = () => {
  try {
    let error = document.getElementById("error");
    error.innerText = "";
    error.style.display = "none";
    error.classList.remove("text-danger");
    error.classList.remove("text-success");
  } catch (e) {}
};

export const isMessage = () => {
  let error = document.getElementById("error");
  try {
    let test = error.style.display;
    return true;
  } catch {
    return false;
  }
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Set a Cookie
export function setCookie(cName, cValue, expDays) {
  let date = new Date();
  date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}

export function getCookie(cName) {
  const name = cName + "=";
  const cDecoded = decodeURIComponent(document.cookie); //to be careful
  const cArr = cDecoded.split("; ");
  let res;
  cArr.forEach((val) => {
    if (val.indexOf(name) === 0) res = val.substring(name.length);
  });
  return res;
}
