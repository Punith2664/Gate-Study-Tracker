document.addEventListener('DOMContentLoaded', () => {
    // --- IMPORTANT: PASTE YOUR FIREBASE CONFIG HERE ---
    const firebaseConfig = {
  apiKey: "AIzaSyDgcAaDL5tPTRb0D0WH08CbjB7HsgL7udw",
  authDomain: "gate-study-tracker-9a588.firebaseapp.com",
  projectId: "gate-study-tracker-9a588",
  storageBucket: "gate-study-tracker-9a588.firebasestorage.app",
  messagingSenderId: "259844602783",
  appId: "1:259844602783:web:5a7b502a0bcfa8b8f19baa",
  measurementId: "G-LD1NMTVL0C"
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
    const welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
    const alertSound = document.getElementById('timer-alert-sound'); // NEW: Get the audio element

    // --- AUTHENTICATION ---
    // ... (unchanged)

    // --- DATA HANDLING ---
    // ... (unchanged)

    // --- UI & RENDER FUNCTIONS ---
    function runAllRenders() { /* ... unchanged ... */ }
    
    // Timer
    const timerDisplay = document.getElementById('timer-display'), startBtn = document.getElementById('start-timer'), pauseBtn = document.getElementById('pause-timer'), resetBtn = document.getElementById('reset-timer'), customMinutesInput = document.getElementById('custom-minutes');
    let countdown, timeLeft;
    function displayTimeLeft(s) { const m = Math.floor(s / 60), r = s % 60; timerDisplay.textContent = `${m}:${r < 10 ? '0' : ''}${r}`; document.title = `${m}:${r < 10 ? '0' : ''}${r}` }
    function setTimer() { pauseTimer(); appData.customMinutes = parseInt(customMinutesInput.value) || 25; timeLeft = appData.customMinutes * 60; displayTimeLeft(timeLeft); saveData(); }
    
    // UPDATED: startTimer function
    function startTimer() { 
        pauseTimer(); 
        const n = Date.now(), t = n + timeLeft * 1000; 
        displayTimeLeft(timeLeft); 
        countdown = setInterval(() => { 
            const s = Math.round((t - Date.now()) / 1000); 
            if (s < 0) { 
                clearInterval(countdown);
                alertSound.play(); // NEW: Play the sound
                alert("Time for a break!"); 
                logStudySession(appData.customMinutes * 60); 
                setTimer(); 
                return 
            } 
            timeLeft = s; 
            displayTimeLeft(s) 
        }, 1000) 
    }
    
    function pauseTimer() { clearInterval(countdown) }
    customMinutesInput.addEventListener('change', setTimer); startBtn.addEventListener('click', startTimer); pauseBtn.addEventListener('click', pauseTimer); resetBtn.addEventListener('click', setTimer);

    // --- All other functions (pasted for completeness) ---
    function pasteUnchangedCode() {
        const provider = new firebase.auth.GoogleAuthProvider();
        loginBtn.addEventListener('click', () => auth.signInWithPopup(provider));
        logoutBtn.addEventListener('click', () => auth.signOut());
        auth.onAuthStateChanged(user => {
            if (user) { userId = user.uid; loginContainer.classList.add('hidden'); appContainer.classList.remove('hidden'); loadDataFromFirebase(); } 
            else { userId = null; appContainer.classList.add('hidden'); loginContainer.classList.remove('hidden'); }
        });
        async function saveData() { if (!userId || !appData) return; try { await db.collection('users').doc(userId).set(appData); } catch (error) { console.error("Error saving data: ", error); } }
        async function loadDataFromFirebase() {
            if (!userId) return;
            const docRef = db.collection('users').doc(userId);
            const doc = await docRef.get();
            appData = doc.exists ? doc.data() : { todos: [], subjects: {}, customMinutes: 25, studySessions: [], workouts: [], loginHistory: [] };
            const todayStr = new Date().toISOString().slice(0, 10);
            if (localStorage.getItem('lastVisited') !== todayStr) { welcomeModal.show(); localStorage.setItem('lastVisited', todayStr); }
            if (!(appData.loginHistory || []).includes(todayStr)) { (appData.loginHistory = appData.loginHistory || []).push(todayStr); }
            subjectNames.forEach(name => { if (!appData.subjects || !appData.subjects[name]) { if (!appData.subjects) appData.subjects = {}; appData.subjects[name] = { chapters: [], revisionStage: 0, dueDate: null }; } });
            customMinutesInput.value = appData.customMinutes || 25;
            setTimer(); renderTodos(); runAllRenders(); saveData();
        }
        function runAllRenders() { renderSubjectsAndProgress(); renderRevisionsDue(); updateStatsDisplay(); updateWorkoutDisplay(); updateLoginStats(); updateWorkoutStats(); }
        const taskInput = document.getElementById('new-task-input'), addTaskBtn = document.getElementById('add-task-btn'), todoList = document.getElementById('todo-list');
        function renderTodos() { todoList.innerHTML = ''; (appData.todos || []).forEach((task, index) => { const li = document.createElement('li'); li.className = 'list-group-item d-flex justify-content-between align-items-center'; li.innerHTML = `<div class="form-check"><input class="form-check-input" type="checkbox" id="todo-${index}" ${task.completed ? 'checked' : ''}><label class="form-check-label ${task.completed ? 'text-decoration-line-through text-muted' : ''}" for="todo-${index}">${task.text}</label></div><button class="btn-close ms-2"></button>`; li.querySelector('.form-check-input').onchange = () => { appData.todos[index].completed = !appData.todos[index].completed; renderTodos(); saveData(); }; li.querySelector('.btn-close').onclick = () => { appData.todos.splice(index, 1); renderTodos(); saveData(); }; todoList.appendChild(li) }) }
        function addTask() { const t = taskInput.value.trim(); if (t === '') return; (appData.todos = appData.todos || []).push({ text: t, completed: false }); taskInput.value = ''; renderTodos(); saveData(); }
        addTaskBtn.addEventListener('click', addTask); taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask() });
        const workoutCheckbox = document.getElementById('workout-checkbox');
        function updateWorkoutDisplay() { const t = new Date().toISOString().slice(0, 10); workoutCheckbox.checked = (appData.workouts || []).includes(t) }
        workoutCheckbox.addEventListener('change', () => { const t = new Date().toISOString().slice(0, 10); if (workoutCheckbox.checked) { if (!(appData.workouts || []).includes(t)) (appData.workouts = appData.workouts || []).push(t) } else { appData.workouts = (appData.workouts || []).filter(e => e !== t) } runAllRenders(); saveData(); });
        function updateWorkoutStats() { const history = [...new Set((appData.workouts || []))].map(d => new Date(d)).sort((a, b) => a - b); const uniqueDays = history.length; if (uniqueDays === 0) { ["stats-workout-current", "stats-workout-longest", "stats-workout-total"].forEach(id => { if (document.getElementById(id)) document.getElementById(id).textContent = "0 days" }); return } let longestStreak = 0, currentStreak = 0, tempStreak = 1; if (uniqueDays > 0) longestStreak = 1; for (let i = 1; i < uniqueDays; i++) { const diff = (history[i] - history[i - 1]) / (1000 * 3600 * 24); if (diff === 1) { tempStreak++ } else if (diff > 1) { tempStreak = 1 } if (tempStreak > longestStreak) longestStreak = tempStreak } const today = new Date(new Date().toISOString().slice(0, 10)); const lastWorkout = history[uniqueDays - 1]; if ((today - lastWorkout) / (1000 * 3600 * 24) < 2) { currentStreak = tempStreak } document.getElementById('stats-workout-current').textContent = `${currentStreak} day${currentStreak !== 1 ? 's' : ''}`; document.getElementById('stats-workout-longest').textContent = `${longestStreak} day${longestStreak !== 1 ? 's' : ''}`; document.getElementById('stats-workout-total').textContent = `${uniqueDays} day${uniqueDays !== 1 ? 's' : ''}` }
        function updateLoginStats() { const history = [...new Set((appData.loginHistory || []))].map(d => new Date(d)).sort((a, b) => a - b); const uniqueDays = history.length; if (uniqueDays === 0) { ["stats-current-streak", "stats-longest-streak", "stats-total-days"].forEach(id => document.getElementById(id).textContent = "0 days"); return } let longestStreak = 0, currentStreak = 0, tempStreak = 1; if (uniqueDays > 0) longestStreak = 1; for (let i = 1; i < uniqueDays; i++) { const diff = (history[i] - history[i - 1]) / (1000 * 3600 * 24); if (diff === 1) { tempStreak++ } else if (diff > 1) { tempStreak = 1 } if (tempStreak > longestStreak) longestStreak = tempStreak } const today = new Date(new Date().toISOString().slice(0, 10)); const lastLogin = history[uniqueDays - 1]; if ((today - lastLogin) / (1000 * 3600 * 24) < 2) { currentStreak = tempStreak } document.getElementById('stats-current-streak').textContent = `${currentStreak} day${currentStreak !== 1 ? 's' : ''}`; document.getElementById('stats-longest-streak').textContent = `${longestStreak} day${longestStreak !== 1 ? 's' : ''}`; document.getElementById('stats-total-days').textContent = `${uniqueDays} day${uniqueDays !== 1 ? 's' : ''}` }
        function logStudySession(e) { (appData.studySessions = appData.studySessions || []).push({ date: new Date().toISOString(), duration: e }); updateStatsDisplay(); saveData(); }
        function formatTime(e) { const t = Math.floor(e / 3600), a = Math.floor(e % 3600 / 60); return `${t}h ${a}m` }
        function updateStatsDisplay() { const e = new Date, t = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime(), a = new Date(e); a.setDate(e.getDate() - 7); const s = a.getTime(), n = new Date(e); n.setDate(e.getDate() - 30); const d = n.getTime(); let l = 0, c = 0, r = 0, o = 0; (appData.studySessions || []).forEach(e => { const a = new Date(e.date).getTime(); a >= t && (l += e.duration), a >= s && (c += e.duration), a >= d && (r += e.duration), o += e.duration }); document.getElementById("stats-today").textContent = formatTime(l); document.getElementById("stats-week").textContent = formatTime(c); document.getElementById("stats-month").textContent = formatTime(r); document.getElementById("stats-total").textContent = formatTime(o) }
        const subjectContainer = document.getElementById('subject-container'), revisionList = document.getElementById('revision-list'), performanceChart = document.querySelector('.performance-chart'), chartPercentageLabel = document.getElementById('chart-percentage'); function renderRevisionsDue() { revisionList.innerHTML = ''; const e = new Date; e.setHours(23, 59, 59, 999); let t = 0; Object.keys(appData.subjects || {}).forEach(a => { const s = appData.subjects[a]; if (s.dueDate && new Date(s.dueDate) <= e) { const e = document.createElement("li"); e.className = "list-group-item d-flex justify-content-between", e.innerHTML = `<span>${a}</span> <span class="text-muted small">(Revision ${s.revisionStage})</span>`, revisionList.appendChild(e), t++ } }), 0 === t && (revisionList.innerHTML = '<li class="list-group-item text-muted">No revisions due today. Well done!</li>') }
        function renderSubjectsAndProgress() { subjectContainer.innerHTML = ''; let totalChapters = 0, completedChapters = 0; subjectNames.forEach(name => { const subject = appData.subjects[name]; const subjectCol = document.createElement('div'); subjectCol.className = 'col-lg-4 col-md-6'; const chapters = subject.chapters || []; completedChapters += chapters.filter(c => c.completed).length; totalChapters += chapters.length; let revisionHTML = (subject.revisionStage > 0) ? `<span class="badge rounded-pill bg-primary">${subject.revisionStage > revisionIntervals.length ? 'Done' : `R${subject.revisionStage}`}</span>` : ''; subjectCol.innerHTML = `<div class="card h-100"><div class="card-body d-flex flex-column"><div class="d-flex justify-content-between align-items-center mb-3"><h4 class="h5 card-title mb-0">${name}</h4>${revisionHTML}</div><ul class="list-group list-group-flush flex-grow-1 chapter-list" style="max-height: 200px; overflow-y: auto;"></ul><div class="input-group mt-3"><input type="text" class="form-control form-control-sm" placeholder="Add new chapter..."><button class="btn btn-sm btn-outline-primary">Add</button></div></div></div>`; const chapterList = subjectCol.querySelector('.chapter-list'); chapters.forEach((chapter, index) => { const li = document.createElement('li'); li.className = 'list-group-item d-flex justify-content-between align-items-center px-0'; li.innerHTML = `<div class="form-check"><input class="form-check-input" type="checkbox" id="${name.replace(/\s+/g, '-')}-${index}" ${chapter.completed ? 'checked' : ''}><label class="form-check-label ${chapter.completed ? 'text-decoration-line-through text-muted' : ''}" for="${name.replace(/\s+/g, '-')}-${index}">${chapter.text}</label></div><button class="btn-close btn-sm delete-chapter-btn"></button>`; li.querySelector('.form-check-input').onchange = () => { appData.subjects[name].chapters[index].completed = !appData.subjects[name].chapters[index].completed; runAllRenders(); saveData(); }; li.querySelector('.delete-chapter-btn').onclick = () => { appData.subjects[name].chapters.splice(index, 1); runAllRenders(); saveData(); }; chapterList.appendChild(li) }); subjectCol.querySelector('.input-group button').onclick = () => { const input = subjectCol.querySelector('.input-group input'); if (input.value.trim()) { (appData.subjects[name].chapters = appData.subjects[name].chapters || []).push({ text: input.value.trim(), completed: false }); input.value = ''; runAllRenders(); saveData(); } }; const allChaptersDone = chapters.length > 0 && chapters.every(c => c.completed); if (allChaptersDone) { let btnHTML = ''; if (subject.revisionStage === 0) btnHTML = `<button class="btn btn-primary w-100 mt-3 subject-revision-btn" data-subject-name="${name}">Start Revision Cycle</button>`; else if (subject.revisionStage <= revisionIntervals.length) btnHTML = `<button class="btn btn-primary w-100 mt-3 subject-revision-btn" data-subject-name="${name}">Finish Revision ${subject.revisionStage}</button>`; if (btnHTML) { const actionsDiv = document.createElement('div'); actionsDiv.innerHTML = btnHTML; actionsDiv.querySelector('.subject-revision-btn').onclick = (e) => { const subjectName = e.target.getAttribute('data-subject-name'); appData.subjects[subjectName].revisionStage++; const nextInterval = revisionIntervals[appData.subjects[subjectName].revisionStage - 1]; if (nextInterval) { const d = new Date(); d.setDate(d.getDate() + nextInterval); appData.subjects[subjectName].dueDate = d.toISOString() } else { appData.subjects[subjectName].dueDate = null } runAllRenders(); saveData(); }; subjectCol.querySelector('.card-body').appendChild(actionsDiv) } }
        subjectContainer.appendChild(subjectCol) }); const overallPercentage = totalChapters === 0 ? 0 : Math.round((completedChapters / totalChapters) * 100); const angle = overallPercentage * 3.6; performanceChart.style.background = `conic-gradient(#39ff14 ${angle}deg, #444 ${angle}deg)`; chartPercentageLabel.textContent = `${overallPercentage}%` }
        pasteUnchangedCode();
    }
    pasteUnchangedCode();
});
