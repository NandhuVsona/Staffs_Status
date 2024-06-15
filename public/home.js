document.addEventListener("DOMContentLoaded", () => {
  const isdark = JSON.parse(localStorage.getItem("mode"));
  let container = document.querySelector(".container");

  if (isdark == "Dark") {
    container.classList.add("dark");
  } else {
    container.classList.remove("dark");
  }

  let searchBar = document.querySelector(".search-input-box");

  let hampage = document.querySelector(".hampage");

  searchBar.addEventListener("input", (e) => filterData(e.target.value));

  function filterData(searchTerm) {
    let profile = document.querySelectorAll(".profile");
    profile.forEach((list) => {
      if (list.innerText.toLowerCase().includes(searchTerm.toLowerCase())) {
        list.parentElement.classList.remove("hide_list");
        list.parentElement.classList.add("show_list");
      } else {
        list.parentElement.classList.add("hide_list");
      }
    });
  }

  let menu = document.querySelector(".menu");
  let options = document.querySelector(".options");
  let closebtn = document.querySelector(".close");
  let filterOptions = document.querySelector(".filter-options");
  menu.addEventListener("click", menuClose);
  closebtn.addEventListener("click", menuClose);
  function optionController() {
    let searchBar = document.querySelector(".search-page");

    if (searchBar.classList.contains("active")) {
      searchBar.classList.remove("active");
    }
    options.classList.toggle("hide");
    menu.classList.toggle("hide");
    closebtn.classList.toggle("hide");
  }

  function menuClose() {
    optionController();
  }

  function showDept() {
    if (!options.classList.contains("hide")) {
      optionController();
    }
  }

  let isClick = document.querySelectorAll(".options ul a");
  isClick.forEach((option) => {
    option.addEventListener("click", menuClose);
  });

  //Search functionality
  let searchIcon = document.querySelector(".search-icon");
  searchIcon.addEventListener("click", () => {
    if (!options.classList.contains("hide")) {
      options.classList.add("hide");
      menu.classList.remove("hide");
      closebtn.classList.add("hide");
    }

    let searchInputBox = document.querySelector(".search-input-box");

    let searchBar = document
      .querySelector(".search-page")
      .classList.toggle("active");

    searchInputBox.focus();
  });
});

let theme = document.querySelector(".theme");
theme.addEventListener("click", changeTheme);
function changeTheme() {
  let container = document.querySelector(".container");
  container.classList.toggle("dark");
  if (container.classList.contains("dark")) {
    localStorage.setItem("mode", JSON.stringify("Dark"));
  } else {
    localStorage.setItem("mode", JSON.stringify("Light"));
  }
}

let departments = [
  "ECE",
  "CSE",
  "EEE",
  "MECH",
  "CIVIL",
  "IT",
  "AIDS",
  "AIML",
  "CSD",
  "MCT",
  "BME",
  "FT",
];
departments.forEach((dept) => {
  loadStaffs(dept);
});

async function loadStaffs(dept) {
  let req = await fetch(`/api/v1/staffs/${dept}`);
  let res = await req.json();

  if (res.message == "success" && res.result > 0) {
    let staffs = res.staffs;
    staffs.forEach((staff) => {
      let template = `
            <a href="/overview/${staff._id}">
              <div class="profile">
                <div class="dp">
                  <img loading="lazy" src="/uploads/${staff.image}" alt="${staff.name} img" />
                </div>
                <div class="details">
                  <h4 class="faculty__name">${staff.name}</h4>
                  <p class="faculty__details">
                    ${staff.position} in ${staff.department}
                  </p>
                </div>
              </div>
            </a>
            `;
      document.querySelector(`.homepage .${dept}_facultys__list`).innerHTML +=
        template;
    });
  } else {
    document.querySelector(`.homepage .${dept}_facultys__list`).innerHTML =
      '<center style="margin-top :50px"><large>Staffs not avaliable</large></center>';
  }
}
//--------------------------------------------------------------------

//---------------------------------------------------------------

let loading = document.querySelector(".skeleton-loading");
let mainContent = document.querySelector(".facultys__list");
mainContent.style.visibility = "hidden";
document.addEventListener("DOMContentLoaded", () => {
  loading.style.display = "none";
  mainContent.style.visibility = "visible";
});

//Skeleton Loading effect

let template = `
<a href="">
  <div class="profile">
    <div class="dp skeleton">
      <img  src="" alt="" class=""/>
    </div>
    <div class="details">
      <h4 class="faculty__name skeleton">Sona College</h4>
      <p class="faculty__details skeleton">Assistance professor in cse</p>
    </div>
  </div>
</a>`;

for (let i = 0; i < 21; i++) {
  loading.innerHTML += template;
}

let index = 0;
let branches = document.querySelectorAll(".tabs .tab_bar div");
let pages = document.querySelectorAll(".homepage");

branches.forEach((branch, i) => {
  branch.addEventListener("click", () => {
    index = i;
    nextDeptForClickE(index);
  });
});
function b() {
  branches.forEach((branch) => {
    nextdept(branch);
  });
}
function nextDeptForClickE(dept) {
  branches.forEach((branch) => branch.classList.remove("active"));
  showdept(dept);
  branches[index].classList.add("active");
}
function nextdept(dept) {
  branches.forEach((branch) => branch.classList.remove("active"));
  showdept(index);
  branches[index].classList.add("active");
  if (index > 3) {
    for (let i = 0; i < 3; i++) {
      branches[i].style.display = "none";
    }
  } else {
    for (let i = 0; i < 3; i++) {
      branches[i].style.display = "flex";
    }
  }
  if (index > 6) {
    for (let i = 0; i < 6; i++) {
      branches[i].style.display = "none";
    }
  }
  if (index > 3 && index < 6) {
    for (let i = 3; i < 6; i++) {
      branches[i].style.display = "flex";
    }
  }
  if (index > 9) {
    for (let i = 0; i < 9; i++) {
      branches[i].style.display = "none";
    }
  }
  if (index > 6 && index < 9) {
    for (let i = 6; i < 9; i++) {
      branches[i].style.display = "flex";
    }
  }
}

function showdept(index) {
  pages.forEach((page) => {
    page.classList.add("hide");
    pages[index].classList.remove("hide");
    pages[index].style.display = "flex !important";
  });
}

let startX, startY, moveX;
pages.forEach((page) => {
  page.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });
  page.addEventListener("touchmove", (e) => {
    moveX = e.touches[0].clientX;
  });

  page.addEventListener("touchend", () => {
    if (startX + 100 < moveX) {
      index = index > 0 ? --index : 0;
      pages[index].classList.remove("ani");
      b();
    } else if (startX - 100 > moveX) {
      index = index < 14 ? ++index : 13;
      pages[index].classList.add("ani");
      b();
    }
  });
});
//--------------------------------------------------------
