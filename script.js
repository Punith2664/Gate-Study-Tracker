document.addEventListener('DOMContentLoaded', () => {
    // --- IMPORTANT: PASTE YOUR FIREBASE CONFIG HERE ---
   // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

    // --- Global Variables ---
    let appData = {};
    let userId = null;
    const subjectNames = ["Network Theory", "Signals and Systems", "Control Systems", "Digital Circuits", "Analog Circuits", "Electronic Devices", "Electromagnetics", "Communications", "Engineering Mathematics", "General Aptitude"];
    const revisionIntervals = [1, 7, 30];

    // --- DOM Elements ---
    const loginContainer = document.getElementById('login-container');
    const appContainer = document.getElementById('app-container');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    // --- AUTHENTICATION LOGIC ---
    const provider = new firebase.auth.GoogleAuthProvider();
    loginBtn.addEventListener('click', () => auth.signInWithPopup(provider));
    logoutBtn.addEventListener('click', () => auth.signOut());

    auth.onAuthStateChanged(user => {
        if (user) {
            // User is logged in
            userId = user.uid;
            loginContainer.classList.add('hidden');
            appContainer.classList.remove('hidden');
            loadDataFromFirebase();
        } else {
            // User is logged out
            userId = null;
            appContainer.classList.add('hidden');
            loginContainer.classList.remove('hidden');
        }
    });

    // --- DATA PERSISTENCE (Now with Firebase) ---
    async function saveData() {
        if (!userId) return; // Don't save if not logged in
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

        if (doc.exists) {
            appData = doc.data();
        } else {
            // First time user, create default data
            appData = {
                todos: [], subjects: {}, customMinutes: 25,
                studySessions: [], workouts: [], loginHistory: []
            };
        }
        
        // Ensure all default structures exist
        const todayStr = new Date().toISOString().slice(0, 10);
        if (!appData.loginHistory.includes(todayStr)) {
            appData.loginHistory.push(todayStr);
        }
        subjectNames.forEach(name => {
            if (!appData.subjects[name]) {
                appData.subjects[name] = { chapters: [], revisionStage: 0, dueDate: null };
            }
        });

        // Initialize UI with loaded data
        customMinutesInput.value = appData.customMinutes || 25;
        setTimer();
        renderTodos();
        runAllRenders();
        saveData(); // Save to create doc for new user or update login history
    }
    
    // --- The rest of your app's logic (no major changes needed) ---
    const timerDisplay=document.querySelector('.timer-display'),startBtn=document.getElementById('start-timer'),pauseBtn=document.getElementById('pause-timer'),resetBtn=document.getElementById('reset-timer'),customMinutesInput=document.getElementById('custom-minutes');let countdown,timeLeft;function displayTimeLeft(s){const m=Math.floor(s/60),r=s%60;timerDisplay.textContent=`${m}:${r<10?'0':''}${r}`;document.title=`${m}:${r<10?'0':''}${r}`}
    function setTimer(){pauseTimer();appData.customMinutes=parseInt(customMinutesInput.value)||25;timeLeft=appData.customMinutes*60;displayTimeLeft(timeLeft);saveData()}
    function startTimer(){pauseTimer();const n=Date.now(),t=n+timeLeft*1000;displayTimeLeft(timeLeft);countdown=setInterval(()=>{const s=Math.round((t-Date.now())/1000);if(s<0){clearInterval(countdown);alert("Time for a break!");logStudySession(appData.customMinutes*60);setTimer();return}
    timeLeft=s;displayTimeLeft(s)},1000)}
    function pauseTimer(){clearInterval(countdown)}
    customMinutesInput.addEventListener('change',setTimer);startBtn.addEventListener('click',startTimer);pauseBtn.addEventListener('click',pauseTimer);resetBtn.addEventListener('click',resetTimer);const taskInput=document.getElementById('new-task-input'),addTaskBtn=document.getElementById('add-task-btn'),todoList=document.getElementById('todo-list');function renderTodos(){todoList.innerHTML='';(appData.todos||[]).forEach((t,i)=>{const n=document.createElement("li");t.completed&&n.classList.add("completed");const e=document.createElement("input");e.type="checkbox",e.checked=t.completed,e.id=`todo-${i}`,e.onchange=()=>{appData.todos[i].completed=e.checked,n.classList.toggle("completed",e.checked),saveData()};const o=document.createElement("label");o.htmlFor=`todo-${i}`,o.textContent=t.text;const s=document.createElement("button");s.textContent="Delete",s.onclick=()=>{appData.todos.splice(i,1),renderTodos(),saveData()},n.appendChild(e),n.appendChild(o),n.appendChild(s),todoList.appendChild(n)})}
    function addTask(){const t=taskInput.value.trim();if(t==='')return;appData.todos.push({text:t,completed:false});taskInput.value='';renderTodos();saveData()}
    addTaskBtn.addEventListener('click',addTask);taskInput.addEventListener('keypress',(e)=>{if(e.key==='Enter')addTask()});const workoutCheckbox=document.getElementById('workout-checkbox');function updateWorkoutDisplay(){const todayStr=new Date().toISOString().slice(0,10);workoutCheckbox.checked=(appData.workouts||[]).includes(todayStr)}
    workoutCheckbox.addEventListener('change',()=>{const todayStr=new Date().toISOString().slice(0,10);if(workoutCheckbox.checked){if(!(appData.workouts||[]).includes(todayStr))(appData.workouts=appData.workouts||[]).push(todayStr)}else{appData.workouts=(appData.workouts||[]).filter(date=>date!==todayStr)}
    saveData()});function updateLoginStats(){const history=(appData.loginHistory||[]).map(dString=>new Date(new Date(dString).toISOString().slice(0,10))).sort((a,b)=>a-b);const uniqueHistory=[...new Set(history.map(d=>d.getTime()))].map(t=>new Date(t));if(uniqueHistory.length===0){document.getElementById('stats-current-streak').textContent=`0 days`;document.getElementById('stats-longest-streak').textContent=`0 days`;document.getElementById('stats-total-days').textContent=`0 days`;return}
    let currentStreak=0;const today=new Date(new Date().toISOString().slice(0,10));let tempDate=new Date(today);const uniqueTimeStamps=uniqueHistory.map(d=>d.getTime());if(uniqueTimeStamps.includes(tempDate.getTime())){currentStreak=1;while(true){tempDate.setDate(tempDate.getDate()-1);if(uniqueTimeStamps.includes(tempDate.getTime())){currentStreak++}else{break}}}
    let longestStreak=0;if(uniqueHistory.length>0){longestStreak=1;let currentLongest=1;for(let i=1;i<uniqueHistory.length;i++){const dayBefore=new Date(uniqueHistory[i]);dayBefore.setDate(dayBefore.getDate()-1);if(uniqueHistory[i-1]&&dayBefore.getTime()===uniqueHistory[i-1].getTime()){currentLongest++}else{currentLongest=1}
    if(currentLongest>longestStreak)longestStreak=currentLongest}}
    document.getElementById('stats-current-streak').textContent=`${currentStreak} day${currentStreak!==1?'s':''}`;document.getElementById('stats-longest-streak').textContent=`${longestStreak} day${longestStreak!==1?'s':''}`;document.getElementById('stats-total-days').textContent=`${uniqueHistory.length} day${uniqueHistory.length!==1?'s':''}`}
    function logStudySession(durationInSeconds){if(!appData.studySessions)appData.studySessions=[];appData.studySessions.push({date:new Date().toISOString(),duration:durationInSeconds});updateStatsDisplay();saveData()}
    function formatTime(totalSeconds){const hours=Math.floor(totalSeconds/3600);const minutes=Math.floor((totalSeconds%3600)/60);return`${hours}h ${minutes}m`}
    function updateStatsDisplay(){const now=new Date();const todayStart=new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime();const sevenDaysAgo=new Date(now);sevenDaysAgo.setDate(now.getDate()-7);const sevenDaysAgoStart=sevenDaysAgo.getTime();const thirtyDaysAgo=new Date(now);thirtyDaysAgo.setDate(now.getDate()-30);const thirtyDaysAgoStart=thirtyDaysAgo.getTime();let todaySeconds=0,weekSeconds=0,monthSeconds=0,totalSeconds=0;(appData.studySessions||[]).forEach(session=>{const sessionDate=new Date(session.date).getTime();if(sessionDate>=todayStart)todaySeconds+=session.duration;if(sessionDate>=sevenDaysAgoStart)weekSeconds+=session.duration;if(sessionDate>=thirtyDaysAgoStart)monthSeconds+=session.duration;totalSeconds+=session.duration});document.getElementById('stats-today').textContent=formatTime(todaySeconds);document.getElementById('stats-week').textContent=formatTime(weekSeconds);document.getElementById('stats-month').textContent=formatTime(monthSeconds);document.getElementById('stats-total').textContent=formatTime(totalSeconds)}
    const subjectContainer=document.getElementById('subject-container'),revisionList=document.getElementById('revision-list'),overallProgressBar=document.querySelector('.overall-progress-container .progress-bar'),overallProgressText=document.getElementById('progress-text');const performanceChart=document.querySelector('.performance-chart');const chartPercentageLabel=document.getElementById('chart-percentage');function runAllRenders(){renderSubjectsAndProgress();renderRevisionsDue();updateStatsDisplay();updateWorkoutDisplay();updateLoginStats()}
    function renderRevisionsDue(){revisionList.innerHTML='';const today=new Date();today.setHours(23,59,59,999);let revisionsFound=0;Object.keys(appData.subjects||{}).forEach(name=>{const subject=appData.subjects[name];if(subject.dueDate&&new Date(subject.dueDate)<=today){const li=document.createElement('li');li.innerHTML=`<span>${name}</span> <span class="subject-name">(Revision ${subject.revisionStage})</span>`;revisionList.appendChild(li);revisionsFound++}});if(revisionsFound===0)revisionList.innerHTML='<li>No revisions due today. Well done!</li>'}
    function renderSubjectsAndProgress(){subjectContainer.innerHTML='';let totalChapters=0,completedChapters=0;Object.keys(appData.subjects).forEach(name=>{const subject=appData.subjects[name];const subjectCard=document.createElement('div');subjectCard.className='subject-card';const chapters=subject.chapters||[];const chapterTotal=chapters.length;const chapterCompleted=chapters.filter(c=>c.completed).length;totalChapters+=chapterTotal;completedChapters+=chapterCompleted;const percentage=chapterTotal===0?0:Math.round((chapterCompleted/chapterTotal)*100);const allChaptersDone=chapterTotal>0&&chapterCompleted===chapterTotal;let revisionHTML='';if(subject.revisionStage>0){const tagClass=subject.revisionStage>revisionIntervals.length?'tag-done':`tag-r${subject.revisionStage}`;const tagText=subject.revisionStage>revisionIntervals.length?'Done':`R${subject.revisionStage}`;revisionHTML=`<span class="revision-tag ${tagClass}">${tagText}</span>`}
    let actionButtonHTML='';if(allChaptersDone){if(subject.revisionStage===0)actionButtonHTML=`<div class="subject-actions"><button class="subject-revision-btn" data-subject-name="${name}">Start Revision Cycle</button></div>`;else if(subject.revisionStage<=revisionIntervals.length)actionButtonHTML=`<div class="subject-actions"><button class="subject-revision-btn" data-subject-name="${name}">Finish Revision ${subject.revisionStage}</button></div>`}
    subjectCard.innerHTML=`<div class="subject-header"><h4>${name}</h4>${revisionHTML}</div><div class="progress-bar-container"><div class="progress-bar" style="width: ${percentage}%;"></div></div><ul class="chapter-list"></ul><div class="chapter-input"><input type="text" placeholder="Add new chapter..."><button>Add</button></div>${actionButtonHTML}`;const chapterList=subjectCard.querySelector('.chapter-list');chapters.forEach((chapter,index)=>{const li=document.createElement('li');if(chapter.completed)li.classList.add('completed');const contentDiv=document.createElement('div');contentDiv.className='chapter-content';const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=chapter.completed;checkbox.id=`${name}-${index}`;checkbox.onchange=(e)=>{appData.subjects[name].chapters[index].completed=e.target.checked;runAllRenders();saveData()};const label=document.createElement('label');label.htmlFor=`${name}-${index}`;label.textContent=chapter.text;const deleteBtn=document.createElement('button');deleteBtn.className='chapter-delete-btn';deleteBtn.textContent='';deleteBtn.onclick=()=>{appData.subjects[name].chapters.splice(index,1);runAllRenders();saveData()};contentDiv.appendChild(checkbox);contentDiv.appendChild(label);li.appendChild(contentDiv);li.appendChild(deleteBtn);chapterList.appendChild(li)});subjectCard.querySelector('.chapter-input button').onclick=()=>{const input=subjectCard.querySelector('.chapter-input input');const text=input.value.trim();if(text){appData.subjects[name].chapters.push({text:text,completed:false});input.value='';runAllRenders();saveData()}};const actionButton=subjectCard.querySelector('.subject-revision-btn');if(actionButton){actionButton.onclick=(e)=>{const subjectName=e.target.getAttribute('data-subject-name');const subjectToUpdate=appData.subjects[subjectName];subjectToUpdate.revisionStage+=1;const nextInterval=revisionIntervals[subjectToUpdate.revisionStage-1];if(nextInterval){const dueDate=new Date();dueDate.setDate(dueDate.getDate()+nextInterval);subjectToUpdate.dueDate=dueDate.toISOString()}else{subjectToUpdate.dueDate=null}
    runAllRenders();saveData()}}
    subjectContainer.appendChild(subjectCard)});const overallPercentage=totalChapters===0?0:Math.round((completedChapters/totalChapters)*100);const angle=overallPercentage*3.6;performanceChart.style.background=`conic-gradient(var(--primary-color) ${angle}deg, var(--chart-track-color) ${angle}deg)`;chartPercentageLabel.textContent=`${overallPercentage}%`}
});