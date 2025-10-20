/* Import a monospace font from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500&display=swap');

:root {
    --primary-color: #39ff14; /* A vibrant, neon green */
    --background-color: #1e1e1e;
    --card-background: #2a2a2a;
    --text-color: #e0e0e0;
    --border-color: rgba(57, 255, 20, 0.3);
    --success-color: #39ff14;
    --danger-color: #ff3131;
    --chart-track-color: #444;
}

body {
    font-family: 'Roboto Mono', monospace;
    background-color: var(--background-color);
    color: var(--text-color);
    margin: 0; padding: 20px;
}

/* Welcome Modal Styles */
#welcome-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: none; /* Hidden by default */
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
#welcome-modal-content {
    background-color: var(--card-background);
    padding: 30px 40px;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    max-width: 600px;
    position: relative;
    box-shadow: 0 0 25px rgba(57, 255, 20, 0.2);
}
#close-modal {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 2.5rem;
    color: #888;
    cursor: pointer;
    transition: color 0.2s;
}
#close-modal:hover {
    color: var(--danger-color);
}
#welcome-modal-content h2 {
    color: var(--primary-color);
    text-align: center;
    margin-top: 0;
}
#welcome-modal-content ul {
    list-style-type: none;
    padding-left: 0;
}
#welcome-modal-content li {
    margin-bottom: 15px;
    line-height: 1.6;
}
#welcome-modal-content li strong {
    color: var(--primary-color);
}


header { text-align: center; margin-bottom: 30px; }
header h1 { color: var(--primary-color); font-weight: 500; text-shadow: 0 0 5px var(--primary-color); }

.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 25px; max-width: 1200px; margin: 0 auto;
}

.card {
    background-color: var(--card-background);
    border-radius: 8px; padding: 25px;
    border: 1px solid var(--border-color);
    box-shadow: 0 0 15px rgba(57, 255, 20, 0.05);
}

.card h2 { margin-top: 0; font-weight: 500; border-bottom: 1px solid var(--border-color); padding-bottom: 15px; margin-bottom: 20px; }

/* Timer & Stats Styles */
.timer-display { font-size: 4rem; font-weight: 500; text-align: center; margin: 10px 0; color: var(--primary-color); }
.custom-timer-input { text-align: center; margin-bottom: 20px; }
#custom-minutes { width: 60px; padding: 5px; border-radius: 4px; border: 1px solid var(--border-color); text-align: center; font-size: 1rem; background: var(--background-color); color: var(--text-color); }
.stats-grid { display: grid; grid-template-columns: auto 1fr; gap: 15px 20px; align-items: center; }
.stats-label { font-weight: 500; color: var(--text-color); opacity: 0.8; }
.stats-value { font-size: 1.2rem; font-weight: 500; color: var(--primary-color); text-align: right; }

/* Performance Chart Styles */
.chart-container { display: flex; justify-content: center; align-items: center; position: relative; height: 150px; }
.performance-chart { width: 150px; height: 150px; border-radius: 50%; background: conic-gradient(var(--primary-color) 0deg, var(--chart-track-color) 0deg); transition: background 0.5s ease-in-out; }
.chart-label { position: absolute; font-size: 2rem; font-weight: 500; color: var(--primary-color); }

/* Button Styles */
button {
    background-color: transparent; color: var(--primary-color); border: 1px solid var(--primary-color); padding: 12px 22px;
    border-radius: 4px; cursor: pointer; font-size: 1rem; font-family: 'Roboto Mono', monospace; font-weight: 500; transition: all 0.3s ease;
}
button:hover { background-color: var(--primary-color); color: var(--background-color); box-shadow: 0 0 15px var(--primary-color); }

/* To-Do & Revision List Styles */
#todo-list, #revision-list { list-style: none; padding: 0; max-height: 250px; overflow-y: auto; }
#revision-list li { padding: 12px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
#revision-list li .subject-name { font-size: 0.9em; color: #888; margin-left: auto; padding-left: 20px; }
#todo-list li { padding: 12px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px; }
#todo-list li input[type="checkbox"] { display: none; }
#todo-list li label { cursor: pointer; position: relative; padding-left: 25px; flex-grow: 1; }
#todo-list li label::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; border: 1px solid var(--border-color); border-radius: 2px; background-color: var(--background-color); }
#todo-list li label::after { content: ''; position: absolute; display: none; left: 6px; top: 50%; width: 4px; height: 8px; border: solid var(--background-color); border-width: 0 2px 2px 0; transform: translateY(-60%) rotate(45deg); }
#todo-list li input:checked + label::before { background-color: var(--primary-color); border-color: var(--primary-color); }
#todo-list li input:checked + label::after { display: block; }
#todo-list li.completed label { text-decoration: line-through; color: #888; }
#todo-list li button { background: transparent; border: 1px solid var(--danger-color); color: var(--danger-color); padding: 5px 10px; font-size: 0.8rem; }
.todo-input { display: flex; margin-top: 15px; }
#new-task-input { flex-grow: 1; border: 1px solid var(--border-color); padding: 10px; border-radius: 4px 0 0 4px; background: var(--background-color); color: var(--text-color); }
#add-task-btn { border-radius: 0 4px 4px 0; }

/* Workout Tracker Styles */
.workout-tracker { display: flex; justify-content: space-between; align-items: center; font-size: 1.1rem; }
#workout-checkbox { appearance: none; -webkit-appearance: none; width: 50px; height: 26px; background-color: #555; border-radius: 13px; position: relative; cursor: pointer; transition: background-color 0.3s; }
#workout-checkbox::before { content: ''; position: absolute; width: 20px; height: 20px; border-radius: 50%; background-color: var(--text-color); top: 3px; left: 4px; transition: transform 0.3s; }
#workout-checkbox:checked { background-color: var(--primary-color); }
#workout-checkbox:checked::before { transform: translateX(24px); }

/* Subject Tracker Styles */
.full-width-card { grid-column: 1 / -1; }
.progress-bar-container { background-color: #333; border-radius: 4px; overflow: hidden; border: 1px solid var(--border-color); }
.progress-bar { width: 0%; height: 20px; background-color: var(--success-color); border-radius: 2px; transition: width 0.5s ease-in-out; }
.subject-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
.subject-card { background-color: #252525; }
.subject-card .progress-bar-container { height: 8px; }
.subject-card .progress-bar { height: 8px; }
.chapter-list { list-style: none; padding: 0; max-height: 150px; overflow-y: auto; }
.chapter-list li { display: flex; align-items: center; justify-content: space-between; padding: 8px 5px; font-size: 0.9rem; border-bottom: 1px solid var(--border-color); }
.chapter-list li .chapter-content { display: flex; align-items: center; gap: 10px; flex-grow: 1; }
.chapter-list li.completed label { text-decoration: line-through; color: #888; }
.chapter-list li input[type="checkbox"] { display: none; }
.chapter-list li label { cursor: pointer; position: relative; padding-left: 25px; }
.chapter-list li label::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; border: 1px solid var(--border-color); border-radius: 2px; background-color: var(--background-color); }
.chapter-list li label::after { content: ''; position: absolute; display: none; left: 6px; top: 50%; width: 4px; height: 8px; border: solid var(--background-color); border-width: 0 2px 2px 0; transform: translateY(-60%) rotate(45deg); }
.chapter-list li input:checked + label::before { background-color: var(--primary-color); border-color: var(--primary-color); }
.chapter-list li input:checked + label::after { display: block; }
.chapter-input { display: flex; margin-top: 10px; }
.chapter-input input { flex-grow: 1; border: 1px solid var(--border-color); padding: 8px; border-radius: 4px 0 0 4px; font-size: 0.9rem; background-color: var(--background-color); color: var(--text-color); }
.chapter-input button { font-size: 0.9rem; padding: 8px 12px; border-radius: 0 4px 4px 0; }
.subject-actions { margin-top: 15px; text-align: center; }
.subject-revision-btn { font-size: 0.9rem; padding: 8px 15px; width: 100%; }
.revision-tag { font-size: 0.75rem; font-weight: 500; padding: 3px 8px; border-radius: 4px; border: 1px solid var(--primary-color); color: var(--primary-color); }
.tag-done { background-color: var(--primary-color); color: var(--background-color); }
.chapter-delete-btn { background: transparent; border: none; cursor: pointer; width: 22px; height: 22px; padding: 0; position: relative; opacity: 0.6; transition: opacity 0.2s; flex-shrink: 0; }
.chapter-delete-btn:hover { opacity: 1; }
.chapter-delete-btn::before { content: ''; position: absolute; bottom: 0; left: 4px; width: 10px; height: 12px; border: 1px solid var(--danger-color); border-top: none; border-radius: 0 0 2px 2px; }
.chapter-delete-btn::after { content: ''; position: absolute; top: 2px; left: 2px; width: 14px; height: 2px; background-color: var(--danger-color); }
