const optList=document.querySelectorAll(".menu-option");
const desc= document.querySelector("#popup-area");
const gamearea=document.getElementById("game-area");

let sounds = {
    menuChange: new Audio('./audio/menu-change.wav'),
    menuSelect: new Audio('./audio/menu-select.wav')
};

async function loadData(){
    const response= await fetch('./data.json');
    return response.json();
}


for (let i = 0; i < optList.length; i++){
    let opt = optList[i];
    opt.addEventListener("mouseover",async()=>{
        opt.classList.add("active");
        playSound("menuChange");
        desc.textContent=opt.dataset.preview;
        desc.style.backgroundColor="rgba(255, 255, 255 ,0.7)"
        // console.log("Active"+opt.textContent);
    })

    opt.addEventListener("mouseout",async()=>{
        opt.classList.remove("active");
        desc.textContent=""; 
        desc.style.backgroundColor="rgba(255, 255, 255 ,0.4)"
        // console.log("Inactive"+opt.textContent);
    })
}

const menuToggle = document.getElementById("menu-toggle");
const menuArea = document.getElementById("menu-area");

menuToggle.addEventListener("click", () => {
    menuArea.classList.toggle("open");
});

function genTemplate(){
    playSound("menuSelect");
    const fragment=document.createDocumentFragment();
    const container= document.createElement("div");
    container.id="content";
    const spriteZone= document.createElement("div");
    spriteZone.id="sprite-area";
    const summaryZone= document.createElement("div");
    summaryZone.id="summary-area";
    const navZone= document.createElement("div");
    navZone.id="nav-area";
    container.appendChild(spriteZone);
    container.appendChild(summaryZone);
    fragment.appendChild(container);
    fragment.appendChild(navZone);
    gamearea.replaceChildren(fragment);
    gamearea.classList.add("using");
}

function playSound(soundName) {
    if (sounds[soundName]) {
        sounds[soundName].currentTime = 0;
        sounds[soundName].play().catch(e => console.log('Sound play failed'));
    }
}

function hideMenuArea() {
    if (menuArea.classList.contains('open')) {
        menuArea.classList.remove('open');
    }
}

async function about(){
    hideMenuArea();
    genTemplate();
    const spriteZone=document.getElementById("sprite-area");
    const spriteCanvas=document.createElement("img");
    spriteCanvas.src="./images/sprite.png";
    spriteZone.appendChild(spriteCanvas);
    const data= await loadData();
    const info = [
        `NAME: ${data.trainer.name}`,
        `AGE: ${data.trainer.age}`,
        `HOMETOWN: ${data.trainer.hometown}`,
        `TYPE: ${data.trainer.type}`,
        `HOBBIES: ${data.trainer.hobbies}`,
        `LANGUAGES: ${data.trainer.languages}`
    ];
    const summaryZone=document.getElementById("summary-area");
    summaryZone.innerHTML = info.map(line => 
        `<div class="trainer-info-line">${line}</div>`
    ).join('<div class="pixel-separator"></div>');
    const navZone= document.getElementById('nav-area');
    navZone.textContent=data.trainer.bio;
}

async function skills(){
    hideMenuArea();
    genTemplate();
    const data= await loadData();
    const info = [
    `LANGUAGES: ${data.badges[0].languages}`,
    `FRAMEWORKS: ${data.badges[1].frameworks}`,
    `TOOLS: ${data.badges[2].tools}`,
    `DATABASES: ${data.badges[3].databases}`,
    `CLOUD: ${data.badges[4].cloud}`
    ];

    //build left menu
    const sprite= document.getElementById('sprite-area');
    const fragment= document.createDocumentFragment();
    const spritemenu= document.createElement("ul");
    spritemenu.className="sprite-menu-list";
    for(infos of info){
        const skilltype=document.createElement("li");
        skilltype.className="menu-option";
        skilltype.classList.add("sprite-menu-options");
        skilltype.textContent= infos.substring(0, infos.indexOf(':'));
        spritemenu.appendChild(skilltype);
    }
    fragment.appendChild(spritemenu);
    sprite.appendChild(fragment);
    activateList(document.querySelectorAll(".sprite-menu-options"), data.badges);

    spritemenu.addEventListener("click",(event)=>{
        populateNav(event.target, data.badges);
        populateSummaryList(((event.target).textContent).toLowerCase(), data.badges);
    });
}

function activateList(nodelist, menu){
    const popup= document.getElementById('popup-area');
    for(let nodeIndex=0; nodeIndex<nodelist.length; nodeIndex++){
        let node=nodelist[nodeIndex];
        // Capture the current index value
        const currentIndex = nodeIndex;
        node.addEventListener("mouseover",async()=>{
        node.classList.add("active");
        playSound("menuChange");
        // console.log(data.badges[currentIndex]);
        popup.textContent= menu[currentIndex].desc;
        desc.style.backgroundColor="rgba(255, 255, 255 ,0.8)";
        });
        node.addEventListener("mouseout",async()=>{
        node.classList.remove("active");
        desc.style.backgroundColor="rgba(255, 255, 255 ,0.4)"
        desc.textContent="";});
    }
}

function populateNav(listElement, option){
    playSound("menuSelect");
    const navZone= document.getElementById('nav-area');
    const selected= listElement.textContent;
    console.log("Selected value:", `'${selected}'`);
    for(let type of option){
        if(type[(listElement.textContent).toLowerCase()]){
            console.log(type.desc);
            navZone.textContent= type.desc;
        }
        else{
            console.log("no");
        }
    }
}

function populateSummaryList(propertyName, option) {
    const summaryArea = document.getElementById('summary-area');
    summaryArea.innerHTML="";
    const ul = document.createElement('ul');
    ul.className="menu-list";
    for (let badge of option) {
        const value = badge[propertyName];
        if (value && value.trim() !== '') {
            // Split by comma and create a list item for each part
            const items = value.split(',');
            for (let item of items) {
                const li = document.createElement('li');
                li.className="menu-option";
                li.textContent = item.trim(); // trim whitespace
                ul.appendChild(li);
            }
        }
    }
    
    summaryArea.appendChild(ul);
}

async function projects() {
    hideMenuArea();
    genTemplate();
    const data = await loadData();
    const projectsObj = data.projects[0];
    const projectNames = Object.keys(projectsObj);
    const sprite = document.getElementById('sprite-area');
    const fragment = document.createDocumentFragment();
    const spritemenu = document.createElement('ul');
    spritemenu.className = 'sprite-menu-list';
    
    projectNames.forEach((projectName, idx) => {
        const li = document.createElement('li');
        li.className = 'menu-option sprite-menu-options project-menu-option';
        li.textContent = projectName;
        li.dataset.project = projectName;
        spritemenu.appendChild(li);
    });
    fragment.appendChild(spritemenu);
    sprite.appendChild(fragment);

    // Activate hover/click effects
    activateList(document.querySelectorAll('.project-menu-option'), projectNames.map(name => ({desc: projectsObj[name].about.split(',')[0]})));

    // Add custom hover for popup area sample
    spritemenu.querySelectorAll('.project-menu-option').forEach((li) => {
        li.addEventListener('mouseover', (event) => {
            const project = projectsObj[li.dataset.project];
            const sample = project.sample || '';
            desc.textContent = sample;
            desc.style.backgroundColor = "rgba(255, 255, 255 ,0.8)";
        });
        li.addEventListener('mouseout', (event) => {
            desc.textContent = "";
            desc.style.backgroundColor = "rgba(255, 255, 255 ,0.4)";
        });
    });

    // Add click event to each project
    spritemenu.addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains('project-menu-option')) {
            const projectName = event.target.dataset.project;
            const project = projectsObj[projectName];
            populateProjectSummary(project);
            populateProjectNav(project);
        }
    });
}

function populateProjectSummary(project) {
    playSound("menuSelect");
    const summaryArea = document.getElementById('summary-area');
    summaryArea.innerHTML = '';
    const langDiv = document.createElement('div');
    langDiv.className = 'project-languages';
    langDiv.textContent = `LANGUAGES: ${project.languages}`;
    summaryArea.appendChild(langDiv);
    const aboutDiv = document.createElement('div');
    aboutDiv.className = 'project-about';
    const aboutLines = project.about.split(',');
    aboutDiv.innerHTML = aboutLines.map(line => `<div class=\"project-about-line\">${line.trim()}</div>`).join('');
    summaryArea.appendChild(aboutDiv);
}

function populateProjectNav(project) {
    const navZone = document.getElementById('nav-area');
    navZone.innerHTML = '';
    const githubLink = document.createElement('a');
    githubLink.href = project.github;
    githubLink.target = '_blank';
    githubLink.rel = 'noopener noreferrer';
    githubLink.className = 'project-link';
    githubLink.textContent = 'GitHub';
    const liveLink = document.createElement('a');
    liveLink.href = project.live;
    liveLink.target = '_blank';
    liveLink.rel = 'noopener noreferrer';
    liveLink.className = 'project-link';
    liveLink.textContent = 'Live Preview';
    navZone.appendChild(githubLink);
    navZone.appendChild(document.createTextNode(' | '));
    navZone.appendChild(liveLink);
}

async function experience() {
    hideMenuArea();
    genTemplate();
}

function connect(){
    hideMenuArea();
}

function settings(){
    hideMenuArea();
    genTemplate();
}

function pcLinkForm() {
    hideMenuArea();
    playSound("menuSelect");
    gamearea.innerHTML = '';
    gamearea.classList.add('using');
    const form = document.createElement('form');
    form.id = 'pc-link-form';
    form.style.backgroundColor="rgba(255, 255, 255 ,0.5)";
    form.innerHTML = `
        <label for="from-input">From:</label><br>
        <input type="email" id="from-input" name="from" required class="pc-form-input"><br><br>
        <label for="title-input">Title:</label><br>
        <input type="text" id="title-input" name="title" required class="pc-form-input"><br><br>
        <label for="content-input">Content:</label><br>
        <textarea id="content-input" name="content" rows="5" required class="pc-form-input"></textarea><br><br>
        <button type="submit" id="pc-form-send">Send</button>
    `;
    gamearea.appendChild(form);
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    gamearea.classList.remove("using");
    gamearea.innerHTML="";
    console.log('Escape key pressed!'); 
    // Example: close a modal, exit full screen, etc.
  }
});

