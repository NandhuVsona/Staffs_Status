document.addEventListener("DOMContentLoaded", () => {
  const isdark = JSON.parse(localStorage.getItem("mode"));
  let container = document.querySelector(".container");

  if (isdark == "Dark") {
    container.classList.add("dark");
  } else {
    container.classList.remove("dark");
  }
});

//-------------------------------------------------------------------

function hideMsg() {
  setTimeout(() => {
    msgContainer.classList.add("hide");
  }, 3000);
}
let logoutLabel = document.getElementById("logout");
let msgContainer = document.querySelector(".msg-container");
let editName = document.getElementById("inputbox");
let changePassword = document.getElementById("change-password");
let wappNumber = document.getElementById("wapp-number");
let phoneNumber = document.getElementById("phone-number");
let locationBox = document.querySelector(".input-box-location");
let desigationBox = document.querySelector(".input-box-desigation");
let deptBox = document.querySelector(".input-box-dept");
let locationLabel = document.querySelector("#location");
let passwordSaveBtn = document.querySelector(".update-password");
let position = document.getElementById("position");
let genderLabel = document.getElementById("gender-label");
let inputbox = document.querySelector(".input-box-name");
let passwordbox = document.querySelector(".input-box-password");
let wappbox = document.querySelector(".input-box-wapp");
let phonebox = document.querySelector(".input-box-phone");
let genderBox = document.querySelector(".input-box-gender");
let discard = document.querySelectorAll(".discard");
const nameSaveBtn = document.querySelector(".save-name-btn");
const locationSaveBtn = document.querySelector(".save-location-btn");
const deptSaveBtn = document.querySelector(".save-dept-btn");
const genderSaveBtn = document.querySelector(".save-gender-btn");
const desigationSaveBtn = document.querySelector(".save-desigation-btn");
const deleteLabel = document.querySelector("#delete");
const dept = document.querySelector("#dept");
const deptBoxValue = document.getElementById("deptbox");
const cancelBtn = document.querySelector(".cancel-delete");
const okayDelBtn = document.querySelector(".okay-delete");
const deleteMessage = document.querySelector(".delete-conformation");
const phoneNoSaveBtn = document.querySelector(".phone-no-save-btn");
const wappNoSaveBtn = document.querySelector(".wapp-no-save-btn");
const pNoLabel = document.querySelector(".phone-number-label");
const wappNoLabel = document.querySelector(".wapp-number-label");
const body = document.querySelector("body");
editName.addEventListener("click", () => {
  inputbox.classList.add("show");
  let name = document.querySelector("#name");
  name.setSelectionRange(name.value.length, name.value.length);
  name.focus();
});
changePassword.addEventListener("click", () => {
  passwordbox.classList.add("show");
  document.querySelector("#old-password").focus();
});
wappNumber.addEventListener("click", () => {
  wappbox.classList.add("show");
});
phoneNumber.addEventListener("click", () => {
  phonebox.classList.add("show");
});
genderLabel.addEventListener("click", () => {
  genderBox.classList.add("show");
});
dept.addEventListener("click", () => {
  deptBox.classList.add("show");
  deptBoxValue.setSelectionRange(
    deptBoxValue.value.length,
    deptBoxValue.value.length
  );
  deptBoxValue.focus();
});
locationLabel.addEventListener("click", () => {
  locationBox.classList.add("show");
  let inputValue = document.querySelector("#locationbox");
  inputValue.setSelectionRange(
    inputValue.value.length,
    inputValue.value.length
  );
  inputValue.focus();
});
position.addEventListener("click", () => {
  desigationBox.classList.add("show");
  let inputValue = document.querySelector("#desigation");
  inputValue.setSelectionRange(
    inputValue.value.length,
    inputValue.value.length
  );
  inputValue.focus();
});

discard.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".box-container")[index].classList.remove("show");
  });
});

nameSaveBtn.addEventListener("click", () => {
  const name = document.querySelector("#name").value;
  const field = document.querySelector(".staff-name");
  const data = { name };
  update(data, name, nameSaveBtn, field);
});
locationSaveBtn.addEventListener("click", () => {
  const locat = document.querySelector("#locationbox").value;
  const data = { location: locat };
  let field = document.querySelector(".location-small-label");
  update(data, locat, locationSaveBtn, field);
});
desigationSaveBtn.addEventListener("click", () => {
  const desigation = document.querySelector("#desigation").value;
  const data = { position: desigation };
  const field = document.querySelector(".desigation-small-lable");
  update(data, desigation, desigationSaveBtn);
});

phoneNoSaveBtn.addEventListener("click", () => {
  const phoneNumber = document.getElementById("phone").value;
  const data = { phoneNumber };
  update(data, phoneNumber, phoneNoSaveBtn, pNoLabel);
});
wappNoSaveBtn.addEventListener("click", () => {
  const wappNumber = document.getElementById("wapp").value;
  const data = { whatsappNumber: wappNumber };
  update(data, wappNumber, wappNoSaveBtn, wappNoLabel);
});

deptSaveBtn.addEventListener("click", () => {
  const department = document.getElementById("deptbox").value;
  const data = { department };
  let field = document.querySelector(".dept-label");
  update(data, department, deptSaveBtn, field);
});

genderSaveBtn.addEventListener("click", () => {
  let gender = document.querySelector("#gender").value;
  const data = { gender };
  let field = document.querySelector(".gender-small-label");
  update(data, gender, genderSaveBtn, field);
});

async function updateToDatabase(oldPass, newPass) {
  let data = { oldPass, newPass };
  let id = passwordSaveBtn.dataset.staffId;
  let req = await fetch(`/api/v1/password/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      document.querySelector(".msg-box").innerHTML = res.message;
      msgContainer.classList.remove("hide");
      hideMsg();
    })
    .catch((err) => {
      document.querySelector(".msg-box").innerHTML = err.message;
      msgContainer.classList.remove("hide");
      hideMsg();
    });
}

passwordSaveBtn.addEventListener("click", () => {
  let oldPassword = document.querySelector("#old-password").value;
  let newPassword = document.querySelector("#new-password").value;
  let confirmPassword = document.querySelector("#confirm-password").value;

  if (!(newPassword === confirmPassword)) {
    passwordSaveBtn.parentElement.parentElement.parentElement.classList.remove(
      "show"
    );
    document.querySelector(".msg-box").innerHTML = "Password must be same.!";
    msgContainer.classList.remove("hide");
    hideMsg();
    return;
  }
  updateToDatabase(oldPassword, newPassword);
});

async function update(data, value, saveBtn, field = "") {
  let id = saveBtn.dataset.staffId;
  let req = await fetch(`/api/v1/update/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => {
      saveBtn.parentElement.parentElement.parentElement.classList.remove(
        "show"
      );
      if (field !== "") {
        field.innerHTML = value;
      }
      return res.json();
    })
    .then((res) => {
      document.querySelector(".msg-box").innerHTML = res.message;
      msgContainer.classList.remove("hide");
      hideMsg();
    })
    .catch((err) => {
      document.querySelector(".msg-box").innerHTML = err.message;
      msgContainer.classList.remove("hide");
      hideMsg();
    });
}

deleteLabel.addEventListener("click", () => {
  deleteMessage.classList.add("show");
  body.classList.add("reduceHeight");
});
cancelBtn.addEventListener("click", () => {
  deleteMessage.classList.remove("show");
  body.classList.remove("reduceHeight");
});

okayDelBtn.addEventListener("click", deleteAccount);
async function deleteAccount() {
  let staffId = okayDelBtn.dataset.staffId;
  let req = await fetch(`/account/${staffId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      window.location.reload();
      return res.json();
    })
    .catch((err) => {
      return alert(err.message);
    });
}

//-----------Logout--------//
logoutLabel.addEventListener("click", logout);
async function logout() {
  let req = await fetch("/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status === "success") {
        window.location.href = "/";
        window.location.reload();
        window.location.href = "/";
      }
    })
    .catch((err) => {
      document.querySelector(".msg-box").innerHTML = res.message;
      msgContainer.classList.remove("hide");
      hideMsg();
    });
}
//-----------Gender------//
let swithcBtn = document.querySelector(".switch");
swithcBtn.addEventListener("click", move);
function move() {
  swithcBtn.classList.toggle("move");
  document.querySelector(".male").firstElementChild.classList.toggle("move");
  document.querySelector(".female").firstElementChild.classList.toggle("round");
  if (swithcBtn.classList.contains("move")) {
    document.querySelector("#gender").setAttribute("value", "male");
  } else {
    document.querySelector("#gender").setAttribute("value", "female");
  }
}
