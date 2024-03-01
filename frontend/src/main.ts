import { safeFetch } from "./http";
import { z } from "zod";

const UserSchema = z.object({
  address: z.string(),
  password: z.string(),
  password2: z.string(),
});

const appElement = document.getElementById("app") as HTMLDivElement;
const formElement = document.getElementById("form") as HTMLDivElement;
const addressElement = document.getElementById(
  "email-input"
) as HTMLInputElement;
const passwordElement = document.getElementById(
  "password-input"
) as HTMLInputElement;
const password2Element = document.getElementById(
  "password2-input"
) as HTMLInputElement;
const signupButton = document.getElementById(
  "signup-button"
) as HTMLButtonElement;
signupButton.disabled = true;

const postNewUser = async (user: {
  address: string;
  password: string;
  password2: string;
}) =>
  safeFetch({
    method: "POST",
    url: `http://localhost:4200/signup`,
    schema: UserSchema,
    payload: user,
  });

let checker = 0;
addressElement.addEventListener("input", () => {
  const input = addressElement.value;
  if (
    input.indexOf("@") === -1 ||
    input.indexOf(".") < input.indexOf("@") + 2 ||
    input.indexOf(".") > input.length - 2
  ) {
    addressElement.style.borderColor = "red";
  } else {
    addressElement.style.borderColor = "green";
    checker++;
    if (checker === 3) signupButton.disabled = false;
  }
});

passwordElement.addEventListener("input", () => {
  if (passwordElement.value.length < 5)
    passwordElement.style.borderColor = "red";
  else {
    passwordElement.style.borderColor = "green";
    checker++;
    if (checker === 3) signupButton.disabled = false;
  }
});

password2Element.addEventListener("input", () => {
  if (password2Element.value !== passwordElement.value)
    password2Element.style.borderColor = "red";
  else {
    password2Element.style.borderColor = "green";
    checker++;
    if (checker === 3) signupButton.disabled = false;
  }
});

const successWindow = () => {
  formElement.style.display = "none";
  appElement.insertAdjacentHTML(
    "beforeend",
    `<div><p>Sikeres regisztáció</p><button id="home-button"> Vissza a főoldalra</button></div>`
  );
};
signupButton.addEventListener("click", () => {
  let user = {
    address: addressElement.value,
    password: passwordElement.value,
    password2: password2Element.value,
  };

  postNewUser(user);
  successWindow();
});

const homeButton = document.getElementById("home-button") as HTMLButtonElement;
homeButton.addEventListener("click", () => {
  formElement.style.display = "block";
  homeButton.remove();
});
