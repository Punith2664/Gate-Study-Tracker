document.addEventListener('DOMContentLoaded', () => {
    // --- IMPORTANT: PASTE YOUR FIREBASE CONFIG HERE ---
    const firebaseConfig = {
  apiKey: "AIzaSyDgcAaDL5tPTRb0D0WH08CbjB7HsgL7udw",
  authDomain: "gate-study-tracker-9a588.firebaseapp.com",
  projectId: "gate-study-tracker-9a588",
  storageBucket: "gate-study-tracker-9a588.firebasestorage.app",
  messagingSenderId: "259844602783",
  appId: "1:259844602783:web:1ee661008b810445f19baa",
  measurementId: "G-WGSPK78XB2"
};

    // --- Initialize Firebase ---
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // --- Global Variables & Constants ---
    let appData = {};
    let userId = null;
    const subjectNames = ["Network Theory", "Signals and Systems", "Control Systems", "Digital Circuits", "Analog Circuits", "Electronic Devices", "Electromagnetics", "Communications", "Engineering Mathematics", "General Aptitude"];
    const revisionIntervals = [1, 7, 30];

    // --- DOM Elements ---
    const loginContainer = document.getElementById('login-container');
    const appContainer = document.getElementById('app-container');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    // --- AUTHENTICATION ---
    const provider = new firebase.auth.GoogleAuthProvider();
    loginBtn.addEventListener('click', () => auth.signInWithPopup(provider));
    logoutBtn.addEventListener('click', () => auth.signOut());

    auth.onAuthStateChanged(user => {
        if (user) {
            userId = user.uid;
            loginContainer.classList.add('hidden');
            appContainer.classList.remove('hidden');
            loadDataFromFirebase();
        } else {
            userId = null;
            appContainer.classList.add('hidden');
            loginContainer.classList.remove('hidden');
        }
    });

    // --- DATA HANDLING ---
    async function saveData() {
        if (!userId) return;
        try {
            await db.collection('users').doc(userId).set(appData);
        } catch (error) {
            console.error("Error saving data: ", error);
        }
    }

    async function loadDataFromFirebase() {
        if (!userId) return;
        const docRef = db.collection('users').doc(userId);
        const doc = await docRef.get();
        appData = doc.exists ? doc.data() : { todos: [], subjects: {}, customMinutes: 25, studySessions: [], workouts: [], loginHistory: [] };
        
        const todayStr = new Date().toISOString().slice(0, 10);
        if (!(appData.loginHistory || []).includes(todayStr)) {
            (appData.loginHistory = appData.loginHistory || []).push(todayStr);
        }
        subjectNames.forEach(name => {
            if (!appData.subjects[name]) {
                appData.subjects[name] = { chapters: [], revisionStage: 0, dueDate: null };
            }
        });

        customMinutesInput.value = appData.customMinutes || 25;
        setTimer();
        renderTodos();
        runAllRenders();
        saveData();
    }
    
    // --- RENDER & LOGIC FUNCTIONS ---
    // Timer
    const timerDisplay=document.getElementById('timer-display'),startBtn=document.getElementById('start-timer'),pauseBtn=document.getElementById('pause-timer'),resetBtn=document.getElementById('reset-timer'),customMinutesInput=document.getElementById('custom-minutes');let countdown,timeLeft;function displayTimeLeft(s){const m=Math.floor(s/60),r=s%60;timerDisplay.textContent=`${m}:${r<10?'0':''}${r}`;document.title=`${m}:${r<10?'0':''}${r}`}
    function setTimer(){pauseTimer();appData.customMinutes=parseInt(customMinutesInput.value)||25;timeLeft=appData.customMinutes*60;displayTimeLeft(timeLeft);saveData()}
    function startTimer(){pauseTimer();const n=Date.now(),t=n+timeLeft*1000;displayTimeLeft(timeLeft);countdown=setInterval(()=>{const s=Math.round((t-Date.now())/1000);if(s<0){clearInterval(countdown);alert("Time for a break!");logStudySession(appData.customMinutes*60);setTimer();return}
    timeLeft=s;displayTimeLeft(s)},1000)}
    function pauseTimer(){clearInterval(countdown)}
    customMinutesInput.addEventListener('change',setTimer);startBtn.addEventListener('click',startTimer);pauseBtn.addEventListener('click',pauseTimer);resetBtn.addEventListener('click',setTimer);
    
    // To-Do List
    const taskInput=document.getElementById('new-task-input'),addTaskBtn=document.getElementById('add-task-btn'),todoList=document.getElementById('todo-list');
    function renderTodos() {
        todoList.innerHTML = '';
        (appData.todos || []).forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `py-3 border-b border-border-color flex items-center gap-4`;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox'; checkbox.checked = task.completed; checkbox.id = `todo-${index}`;
            checkbox.className = 'chapter-checkbox'; // Using same style as chapter checkbox
            checkbox.onchange = () => { appData.todos[index].completed = checkbox.checked; renderTodos(); saveData(); };
            
            const label = document.createElement('label');
            label.htmlFor = `todo-${index}`; label.textContent = task.text;
            label.className = `flex-grow ${task.completed ? 'line-through text-gray-500' : ''}`;

            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = `&times;`;
            deleteBtn.className = 'bg-transparent border border-danger text-danger text-xs px-2 py-0.5 rounded-md hover:bg-danger hover:text-dark transition-colors';
            deleteBtn.onclick = () => { appData.todos.splice(index, 1); renderTodos(); saveData(); };
            
            li.appendChild(checkbox); li.appendChild(label); li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });
    }
    function addTask(){const t=taskInput.value.trim();if(t==='')return;(appData.todos=appData.todos||[]).push({text:t,completed:false});taskInput.value='';renderTodos();saveData()}
    addTaskBtn.addEventListener('click',addTask);taskInput.addEventListener('keypress',(e)=>{if(e.key==='Enter')addTask()});
    
    // Workout & Stats
    const workoutCheckbox=document.getElementById('workout-checkbox');
    function updateWorkoutDisplay(){const t=new Date().toISOString().slice(0,10);workoutCheckbox.checked=(appData.workouts||[]).includes(t)}
    workoutCheckbox.addEventListener('change',()=>{const t=new Date().toISOString().slice(0,10);if(workoutCheckbox.checked){if(!(appData.workouts||[]).includes(t))(appData.workouts=appData.workouts||[]).push(t)}else{appData.workouts=(appData.workouts||[]).filter(e=>e!==t)}saveData()});
    function updateLoginStats(){const e=(appData.loginHistory||[]).map(e=>new Date(new Date(e).toISOString().slice(0,10))).sort((e,t)=>e-t),t=[...new Set(e.map(e=>e.getTime()))].map(e=>new Date(e));if(0===t.length)return document.getElementById("stats-current-streak").textContent="0 days",document.getElementById("stats-longest-streak").textContent="0 days",void(document.getElementById("stats-total-days").textContent="0 days");let a=0;const s=new Date(new Date().toISOString().slice(0,10));let n=new Date(s);const d=t.map(e=>e.getTime());if(d.includes(n.getTime())){a=1;for(;;){if(n.setDate(n.getDate()-1),d.includes(n.getTime()))a++;else break}}let l=0;if(t.length>0){l=1;let e=1;for(let a=1;a<t.length;a++){const s=new Date(t[a]);s.setDate(s.getDate()-1),t[a-1]&&s.getTime()===t[a-1].getTime()?e++:e=1,e>l&&(l=e)}}document.getElementById("stats-current-streak").textContent=`${a} day${1!==a?"s":""}`,document.getElementById("stats-longest-streak").textContent=`${l} day${1!==l?"s":""}`,document.getElementById("stats-total-days").textContent=`${t.length} day${1!==t.length?"s":""}`}
    function logStudySession(e){(appData.studySessions=appData.studySessions||[]).push({date:new Date().toISOString(),duration:e}),updateStatsDisplay(),saveData()}
    function formatTime(e){const t=Math.floor(e/3600),a=Math.floor(e%3600/60);return`${t}h ${a}m`}
    function updateStatsDisplay(){const e=new Date,t=new Date(e.getFullYear(),e.getMonth(),e.getDate()).getTime(),a=new Date(e);a.setDate(e.getDate()-7);const s=a.getTime(),n=new Date(e);n.setDate(e.getDate()-30);const d=n.getTime();let l=0,c=0,r=0,o=0;(appData.studySessions||[]).forEach(e=>{const a=new Date(e.date).getTime();a>=t&&(l+=e.duration),a>=s&&(c+=e.duration),a>=d&&(r+=e.duration),o+=e.duration}),document.getElementById("stats-today").textContent=formatTime(l),document.getElementById("stats-week").textContent=formatTime(c),document.getElementById("stats-month").textContent=formatTime(r),document.getElementById("stats-total").textContent=formatTime(o)}
    
    // Subject & Revision Logic
    const subjectContainer=document.getElementById('subject-container'),revisionList=document.getElementById('revision-list'),performanceChart=document.querySelector('.performance-chart'),chartPercentageLabel=document.getElementById('chart-percentage');
    function runAllRenders(){renderSubjectsAndProgress();renderRevisionsDue();updateStatsDisplay();updateWorkoutDisplay();updateLoginStats()}
    function renderRevisionsDue(){revisionList.innerHTML='';const e=new Date;e.setHours(23,59,59,999);let t=0;Object.keys(appData.subjects||{}).forEach(a=>{const s=appData.subjects[a];if(s.dueDate&&new Date(s.dueDate)<=e){const e=document.createElement("li");e.className="py-2 border-b border-border-color flex justify-between",e.innerHTML=`<span>${a}</span> <span class="text-gray-400 text-sm">(Revision ${s.revisionStage})</span>`,revisionList.appendChild(e),t++}}),0===t&&(revisionList.innerHTML='<li class="py-2 text-gray-400">No revisions due today. Well done!</li>')}
    
    // --- THIS IS THE CORRECTED FUNCTION ---
    function renderSubjectsAndProgress() {
        subjectContainer.innerHTML = '';
        let totalChapters = 0, completedChapters = 0;

        subjectNames.forEach(name => {
            const subject = appData.subjects[name];
            const subjectCard = document.createElement('div');
            subjectCard.className = 'bg-card border border-border-color rounded-lg p-4 flex flex-col';

            const chapters = subject.chapters || [];
            completedChapters += chapters.filter(c => c.completed).length;
            totalChapters += chapters.length;

            let revisionHTML = '';
            if (subject.revisionStage > 0) {
                const tagText = subject.revisionStage > revisionIntervals.length ? 'Done' : `R${subject.revisionStage}`;
                revisionHTML = `<span class="text-xs font-bold border border-primary text-primary px-2 py-1 rounded-full">${tagText}</span>`;
            }
            
            subjectCard.innerHTML = `
                <div class="flex justify-between items-center mb-4">
                    <h4 class="text-lg font-bold">${name}</h4>
                    ${revisionHTML}
                </div>
                <ul class="chapter-list flex-grow list-none p-0 max-h-40 overflow-y-auto"></ul>
                <div class="flex mt-4">
                    <input type="text" placeholder="Add new chapter..." class="flex-grow bg-dark border border-border-color p-2 rounded-l-md focus:outline-none focus:border-primary text-sm">
                    <button class="card-btn text-sm rounded-l-none">Add</button>
                </div>
            `;

            const chapterList = subjectCard.querySelector('.chapter-list');
            chapters.forEach((chapter, index) => {
                const li = document.createElement('li');
                li.className = 'flex items-center justify-between py-2 text-sm';
                const contentDiv = document.createElement('div');
                contentDiv.className = 'flex items-center gap-3';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox'; checkbox.checked = chapter.completed; checkbox.id = `${name.replace(/\s+/g, '-')}-${index}`;
                checkbox.className = 'chapter-checkbox';
                checkbox.onchange = () => { appData.subjects[name].chapters[index].completed = checkbox.checked; runAllRenders(); saveData(); };
                const label = document.createElement('label');
                label.htmlFor = `${name.replace(/\s+/g, '-')}-${index}`; label.textContent = chapter.text;
                if(chapter.completed) label.classList.add('line-through', 'text-gray-500');
                
                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = `&times;`;
                deleteBtn.className = 'bg-transparent text-danger text-xl font-bold hover:text-red-400 transition-colors p-0 leading-none';
                deleteBtn.onclick = () => { appData.subjects[name].chapters.splice(index, 1); runAllRenders(); saveData(); };
                
                contentDiv.appendChild(checkbox); contentDiv.appendChild(label);
                li.appendChild(contentDiv); li.appendChild(deleteBtn);
                chapterList.appendChild(li);
            });

            subjectCard.querySelector('.chapter-input button').onclick = () => {
                const input = subjectCard.querySelector('.chapter-input input');
                if (input.value.trim()) { (appData.subjects[name].chapters = appData.subjects[name].chapters || []).push({ text: input.value.trim(), completed: false }); input.value = ''; runAllRenders(); saveData(); }
            };
            
            const allChaptersDone = chapters.length > 0 && chapters.filter(c => c.completed).length === chapters.length;
            if (allChaptersDone) {
                let actionButtonHTML = '';
                if (subject.revisionStage === 0) actionButtonHTML = `<button class="card-btn w-full mt-4 subject-revision-btn" data-subject-name="${name}">Start Revision Cycle</button>`;
                else if (subject.revisionStage <= revisionIntervals.length) actionButtonHTML = `<button class="card-btn w-full mt-4 subject-revision-btn" data-subject-name="${name}">Finish Revision ${subject.revisionStage}</button>`;
                
                const actionsDiv = document.createElement('div');
                actionsDiv.innerHTML = actionButtonHTML;
                const actionButton = actionsDiv.querySelector('.subject-revision-btn');
                if(actionButton){
                    actionButton.onclick = (e) => {
                        const subjectName = e.target.getAttribute('data-subject-name');
                        appData.subjects[subjectName].revisionStage++;
                        const nextInterval = revisionIntervals[appData.subjects[subjectName].revisionStage - 1];
                        if (nextInterval) { const d = new Date(); d.setDate(d.getDate() + nextInterval); appData.subjects[subjectName].dueDate = d.toISOString(); } else { appData.subjects[subjectName].dueDate = null; }
                        runAllRenders(); saveData();
                    };
                    subjectCard.appendChild(actionButton);
                }
            }

            subjectContainer.appendChild(subjectCard);
        });

        const overallPercentage = totalChapters === 0 ? 0 : Math.round((completedChapters / totalChapters) * 100);
        const angle = overallPercentage * 3.6;
        performanceChart.style.background = `conic-gradient(#39ff14 ${angle}deg, #444 ${angle}deg)`;
        chartPercentageLabel.textContent = `${overallPercentage}%`;
    }
});
