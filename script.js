document.addEventListener('DOMContentLoaded', () => {
    // --- APP-WIDE DATA & CONFIG ---
    const subjectNames = ["Network Theory", "Signals and Systems", "Control Systems", "Digital Circuits", "Analog Circuits", "Electronic Devices", "Electromagnetics", "Communications", "Engineering Mathematics", "General Aptitude"];
    const revisionIntervals = [1, 7, 30];
    let appData = {};

    // --- TIMER LOGIC ---
    const timerDisplay = document.querySelector('.timer-display'), startBtn = document.getElementById('start-timer'), pauseBtn = document.getElementById('pause-timer'), resetBtn = document.getElementById('reset-timer'), customMinutesInput = document.getElementById('custom-minutes');
    let countdown, timeLeft;
    function displayTimeLeft(s) { const m = Math.floor(s / 60), r = s % 60; timerDisplay.textContent = `${m}:${r<10?'0':''}${r}`; document.title = `${m}:${r<10?'0':''}${r}`; }
    function setTimer() { pauseTimer(); appData.customMinutes = parseInt(customMinutesInput.value) || 25; timeLeft = appData.customMinutes * 60; displayTimeLeft(timeLeft); saveData(); }
    function startTimer() { pauseTimer(); const n = Date.now(), t = n + timeLeft * 1000; displayTimeLeft(timeLeft); countdown = setInterval(() => { const s = Math.round((t - Date.now()) / 1000); if (s < 0) { clearInterval(countdown); alert("Time for a break!"); return; } timeLeft = s; displayTimeLeft(timeLeft); }, 1000); }
    function pauseTimer() { clearInterval(countdown); }
    customMinutesInput.addEventListener('change', setTimer); startBtn.addEventListener('click', startTimer); pauseBtn.addEventListener('click', pauseTimer); resetBtn.addEventListener('click', setTimer);
    
    // --- TO-DO LIST LOGIC ---
    const taskInput = document.getElementById('new-task-input'), addTaskBtn = document.getElementById('add-task-btn'), todoList = document.getElementById('todo-list');
    function renderTodos() {
        todoList.innerHTML = '';
        (appData.todos || []).forEach((task, index) => {
            const li = document.createElement('li'); if (task.completed) li.classList.add('completed');
            const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.checked = task.completed; checkbox.id = `todo-${index}`;
            checkbox.onchange = () => { appData.todos[index].completed = checkbox.checked; li.classList.toggle('completed', checkbox.checked); saveData(); };
            const label = document.createElement('label'); label.htmlFor = `todo-${index}`; label.textContent = task.text;
            const deleteBtn = document.createElement('button'); deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => { appData.todos.splice(index, 1); renderTodos(); saveData(); };
            li.appendChild(checkbox); li.appendChild(label); li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });
    }
    function addTask() { const t = taskInput.value.trim(); if (t === '') return; appData.todos.push({ text: t, completed: false }); taskInput.value = ''; renderTodos(); saveData(); }
    addTaskBtn.addEventListener('click', addTask); taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });

    // --- REVISION AND SUBJECT LOGIC ---
    const subjectContainer = document.getElementById('subject-container'), revisionList = document.getElementById('revision-list'), overallProgressBar = document.querySelector('.overall-progress-container .progress-bar'), overallProgressText = document.getElementById('progress-text');
    function runAllRenders() { renderSubjectsAndProgress(); renderRevisionsDue(); }
    function renderRevisionsDue() {
        revisionList.innerHTML = ''; const today = new Date(); today.setHours(23, 59, 59, 999); let revisionsFound = 0;
        Object.keys(appData.subjects || {}).forEach(name => {
            const subject = appData.subjects[name];
            if (subject.dueDate && new Date(subject.dueDate) <= today) {
                const li = document.createElement('li'); li.innerHTML = `<span>${name}</span> <span class="subject-name">(Revision ${subject.revisionStage})</span>`;
                revisionList.appendChild(li); revisionsFound++;
            }
        });
        if (revisionsFound === 0) revisionList.innerHTML = '<li>No revisions due today. Well done!</li>';
    }
    function renderSubjectsAndProgress() {
        subjectContainer.innerHTML = ''; let totalChapters = 0, completedChapters = 0;
        Object.keys(appData.subjects).forEach(name => {
            const subject = appData.subjects[name]; const subjectCard = document.createElement('div'); subjectCard.className = 'subject-card';
            const chapters = subject.chapters || []; const chapterTotal = chapters.length; const chapterCompleted = chapters.filter(c => c.completed).length;
            totalChapters += chapterTotal; completedChapters += chapterCompleted;
            const percentage = chapterTotal === 0 ? 0 : Math.round((chapterCompleted / chapterTotal) * 100);
            const allChaptersDone = chapterTotal > 0 && chapterCompleted === chapterTotal;
            let revisionHTML = '';
            if (subject.revisionStage > 0) { const tagClass = subject.revisionStage > revisionIntervals.length ? 'tag-done' : `tag-r${subject.revisionStage}`; const tagText = subject.revisionStage > revisionIntervals.length ? 'Done' : `R${subject.revisionStage}`; revisionHTML = `<span class="revision-tag ${tagClass}">${tagText}</span>`; }
            let actionButtonHTML = '';
            if (allChaptersDone) { if (subject.revisionStage === 0) actionButtonHTML = `<div class="subject-actions"><button class="subject-revision-btn" data-subject-name="${name}">Start Revision Cycle</button></div>`; else if (subject.revisionStage <= revisionIntervals.length) actionButtonHTML = `<div class="subject-actions"><button class="subject-revision-btn" data-subject-name="${name}">Finish Revision ${subject.revisionStage}</button></div>`; }
            subjectCard.innerHTML = `<div class="subject-header"><h4>${name}</h4>${revisionHTML}</div><div class="progress-bar-container"><div class="progress-bar" style="width: ${percentage}%;"></div></div><ul class="chapter-list"></ul><div class="chapter-input"><input type="text" placeholder="Add new chapter..."><button>Add</button></div>${actionButtonHTML}`;
            const chapterList = subjectCard.querySelector('.chapter-list');
            chapters.forEach((chapter, index) => {
                const li = document.createElement('li'); if (chapter.completed) li.classList.add('completed');
                const contentDiv = document.createElement('div'); contentDiv.className = 'chapter-content';
                const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.checked = chapter.completed; checkbox.id = `${name}-${index}`;
                checkbox.onchange = (e) => { appData.subjects[name].chapters[index].completed = e.target.checked; runAllRenders(); saveData(); };
                const label = document.createElement('label'); label.htmlFor = `${name}-${index}`; label.textContent = chapter.text;
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'chapter-delete-btn';
                
                // --- THE FIX IS HERE: Button is now empty for the CSS icon ---
                deleteBtn.textContent = ''; 
                
                deleteBtn.onclick = () => {
                    appData.subjects[name].chapters.splice(index, 1);
                    runAllRenders();
                    saveData();
                };
                contentDiv.appendChild(checkbox); contentDiv.appendChild(label); li.appendChild(contentDiv); li.appendChild(deleteBtn); chapterList.appendChild(li);
            });
            subjectCard.querySelector('.chapter-input button').onclick = () => { const input = subjectCard.querySelector('.chapter-input input'); const text = input.value.trim(); if (text) { appData.subjects[name].chapters.push({ text: text, completed: false }); input.value = ''; runAllRenders(); saveData(); } };
            const actionButton = subjectCard.querySelector('.subject-revision-btn');
            if (actionButton) {
                actionButton.onclick = (e) => {
                    const subjectName = e.target.getAttribute('data-subject-name'); const subjectToUpdate = appData.subjects[subjectName];
                    subjectToUpdate.revisionStage += 1; const nextInterval = revisionIntervals[subjectToUpdate.revisionStage - 1];
                    if (nextInterval) { const dueDate = new Date(); dueDate.setDate(dueDate.getDate() + nextInterval); subjectToUpdate.dueDate = dueDate.toISOString(); } else { subjectToUpdate.dueDate = null; }
                    runAllRenders(); saveData();
                };
            }
            subjectContainer.appendChild(subjectCard);
        });
        const overallPercentage = totalChapters === 0 ? 0 : Math.round((completedChapters / totalChapters) * 100);
        overallProgressBar.style.width = `${overallPercentage}%`; overallProgressText.textContent = `${overallPercentage}%`;
    }

    // --- DATA PERSISTENCE ---
    function saveData() { localStorage.setItem('gateTrackerData', JSON.stringify(appData)); }
    function loadData() {
        const savedData = localStorage.getItem('gateTrackerData'); appData = savedData ? JSON.parse(savedData) : {};
        if (!appData.todos) appData.todos = []; if (!appData.subjects) appData.subjects = {}; if (!appData.customMinutes) appData.customMinutes = 25;
        subjectNames.forEach(name => { if (appData.subjects[name]) { if (!Array.isArray(appData.subjects[name].chapters)) appData.subjects[name].chapters = []; } else { appData.subjects[name] = { chapters: [], revisionStage: 0, dueDate: null }; } });
        customMinutesInput.value = appData.customMinutes; setTimer(); renderTodos(); runAllRenders();
    }
    loadData();
});