const menu = document.getElementById("menu");
const tabs = document.getElementById("tabs");
const search = document.getElementById("searchInput");

/* SPECIAL NAV OPTIONS */
const navItems = [
    { name: "كل الأصناف", type: "all" },

    { name: "الشاورما", type: "single", index: 0 },
    { name: "المشاوي", type: "single", index: 1 },
    { name: "البيتزا", type: "single", index: 3 },
    { name: "الغربي", type: "single", index: 2 },
    { name: "السلطات", type: "single", index: 4 }
];
let currentNav = navItems[0];

/* CREATE TABS */

navItems.forEach((item, i) => {

    const tab = document.createElement("div");
    tab.className = "tab";
    if (i === 0) tab.classList.add("active");

    tab.innerText = item.name;

    tab.onclick = () => {

        document.querySelectorAll(".tab")
            .forEach(t => t.classList.remove("active"));

        tab.classList.add("active");

        currentNav = item;

        render();

    };

    tabs.appendChild(tab);

});

/* RENDER */

function render() {

    menu.innerHTML = "";

    let sections = [];

    if (currentNav.type === "all") {
        sections = menuData;
    } else {
        sections = [menuData[currentNav.index]];
    }

    sections.forEach(section => {

                const html = `
      <div class="section">

        <h2 class="section-title reveal">
          ${section.category}
        </h2>

        <div class="grid">

          ${section.items.map(item=>`

            

            <div class="card no-image">

            <div class="card-body">

                <div class="card-top">

                  <h3>${item.name}</h3>

                  <div class="price">${item.price}</div>

                </div>

                <p class="desc">${item.desc}</p>

              </div>

            </div>

          `).join("")}

        </div>

      </div>
    `;

    menu.innerHTML += html;

  });

  animateCards();
  revealOnScroll();

}

/* ANIMATIONS */

function animateCards(){
  document.querySelectorAll(".card").forEach((c,i)=>{
    setTimeout(()=> c.classList.add("show"), i*120);
  });
}

/* SCROLL */

function revealOnScroll(){

  const items = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add("active");
      }
    });
  },{threshold:0.2});

  items.forEach(el=>observer.observe(el));

}

/* SEARCH */

search.addEventListener("input", (e) => {
  render(e.target.value.toLowerCase());
});

/* RENDER UPDATED WITH PRIORITY SEARCH */

function render(searchValue = "") {

  menu.innerHTML = "";

  let sections = [];

  if (currentNav.type === "all") {
    sections = menuData;
  } else {
    sections = [menuData[currentNav.index]];
  }

  sections.forEach(section => {

    // FILTER ITEMS
    let items = section.items.filter(item =>
      item.name.toLowerCase().includes(searchValue)
    );

    if (items.length === 0) return;

    // 🔥 PRIORITY SORT (match exact first / strong match first)
    items.sort((a, b) => {

      const aMatch = a.name.toLowerCase().startsWith(searchValue);
      const bMatch = b.name.toLowerCase().startsWith(searchValue);

      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;

      return 0;
    });

    const html = `
      <div class="section">

        <h2 class="section-title reveal">
          ${section.category}
        </h2>

        <div class="grid">

          ${items.map(item => `

          <div class="card no-image">

          <div class="card-body">
                <div class="card-top">

                  <h3>${item.name}</h3>

                  <div class="price">${item.price}</div>

                </div>

                <p class="desc">${item.desc}</p>

              </div>

            </div>

          `).join("")}

        </div>

      </div>
    `;

    menu.innerHTML += html;

  });

  animateCards();
  revealOnScroll();
}



/* INIT */

render();