/* =========================================
   FOCUSFLOW
   VANILLA JAVASCRIPT
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const taskForm =
    document.getElementById("taskForm");

const taskName =
    document.getElementById("taskName");

const subject =
    document.getElementById("subject");

const duration =
    document.getElementById("duration");

const tasksContainer =
    document.getElementById("tasksContainer");

const emptyState =
    document.getElementById("emptyState");

const clearBtn =
    document.getElementById("clearBtn");

const progressFill =
    document.getElementById("progressFill");

const percentage =
    document.getElementById("percentage");

const completedText =
    document.getElementById("completedText");

const totalText =
    document.getElementById("totalText");

const progressTitle =
    document.getElementById("progressTitle");

const bear =
    document.getElementById("bear");

const bearCard =
    document.getElementById("bearCard");

const speechBubble =
    document.getElementById("speechBubble");

const themeBtn =
    document.getElementById("themeBtn");

const toast =
    document.getElementById("toast");


/* =========================================
   DATA
========================================= */

let tasks =
    JSON.parse(
        localStorage.getItem("focusflowTasks")
    ) || [];


/* =========================================
   BEAR MESSAGES
========================================= */

const bearMessages = {

    welcome: [
        "Hey! Ready to focus? 🐻",
        "Let's make today productive! ✨",
        "You've got this! 💜",
        "One task at a time. 🌱"
    ],

    added: [
        "Nice! Another goal added! 🎯",
        "Let's crush this one! 💪",
        "Future you will thank you! ✨",
        "Great choice! Keep going! 🐻"
    ],

    completed: [
        "YOOO! You did it! 🎉",
        "That's what I'm talking about! 🔥",
        "One step closer! 💜",
        "Look at you go! 🚀"
    ],

    allDone: [
        "EVERYTHING DONE! 🥳",
        "You absolutely crushed it! 🔥",
        "Mission complete! 🐻✨",
        "Look at that progress! 💜"
    ],

    clicked: [
        "Hey! Stop poking me 😂",
        "Focus mode: ACTIVATED! ⚡",
        "Did you need motivation? 🐻",
        "Okay okay... let's study! 😤"
    ],

    sleepy: [
        "Zzz... still there? 😴",
        "Wake me when it's study time... 💤",
        "I need some focus energy! 🥱"
    ]
};


/* =========================================
   RANDOM MESSAGE
========================================= */

function randomMessage(type) {

    const messages =
        bearMessages[type];

    return messages[
        Math.floor(
            Math.random() * messages.length
        )
    ];
}


function updateBearMessage(message) {

    speechBubble.textContent =
        message;

}


/* =========================================
   SAVE DATA
========================================= */

function saveTasks() {

    localStorage.setItem(
        "focusflowTasks",
        JSON.stringify(tasks)
    );

}


/* =========================================
   ADD TASK
========================================= */

taskForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const name =
            taskName.value.trim();

        if (!name) return;


        const selectedPriority =
            document.querySelector(
                'input[name="priority"]:checked'
            ).value;


        const newTask = {

            id: Date.now(),

            name: name,

            subject: subject.value,

            duration: duration.value,

            priority: selectedPriority,

            completed: false

        };


        tasks.push(newTask);

        saveTasks();

        renderTasks();

        updateProgress();

        taskForm.reset();


        /* Bear reaction */

        updateBearMessage(
            randomMessage("added")
        );

        celebrateBear();


        showToast(
            "Study session added!"
        );

    }
);


/* =========================================
   RENDER TASKS
========================================= */

function renderTasks() {

    tasksContainer.innerHTML = "";


    if (tasks.length === 0) {

        tasksContainer.appendChild(
            emptyState
        );

        return;
    }


    tasks.forEach(task => {

        const card =
            document.createElement("div");

        card.className =
            "task-card";


        if (task.completed) {

            card.classList.add(
                "completed"
            );

        }


        card.innerHTML = `

            <button
                class="task-check"
                data-id="${task.id}"
                title="Complete task"
            >
                ✓
            </button>


            <div class="task-content">

                <div class="task-name">
                    ${escapeHTML(task.name)}
                </div>

                <div class="task-meta">

                    <span>
                        ${getSubjectIcon(task.subject)}
                        ${task.subject}
                    </span>

                    <span>
                        ⏱ ${task.duration} min
                    </span>

                    <span class="task-priority">
                        ${task.priority}
                    </span>

                </div>

            </div>


            <button
                class="delete-btn"
                data-id="${task.id}"
                title="Delete task"
            >
                ×
            </button>

        `;


        tasksContainer.appendChild(card);

    });

}


/* =========================================
   SUBJECT ICON
========================================= */

function getSubjectIcon(subject) {

    const icons = {

        Coding: "💻",

        DSA: "🧠",

        Database: "🗄️",

        College: "📚",

        Other: "✨"

    };


    return icons[subject] || "✨";

}


/* =========================================
   SECURITY HELPER
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================================
   TASK ACTIONS
========================================= */

tasksContainer.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest("button");

        if (!button) return;


        const id =
            Number(button.dataset.id);


        /* Complete */

        if (
            button.classList.contains(
                "task-check"
            )
        ) {

            const task =
                tasks.find(
                    task => task.id === id
                );


            if (!task) return;


            task.completed =
                !task.completed;


            saveTasks();

            renderTasks();

            updateProgress();


            if (task.completed) {

                updateBearMessage(
                    randomMessage("completed")
                );

                celebrateBear();

                showToast(
                    "Session completed! 🎉"
                );


                checkAllCompleted();

            }

        }


        /* Delete */

        if (
            button.classList.contains(
                "delete-btn"
            )
        ) {

            tasks =
                tasks.filter(
                    task => task.id !== id
                );


            saveTasks();

            renderTasks();

            updateProgress();

            updateBearMessage(
                "One less thing on the list! ✨"
            );

        }

    }
);


/* =========================================
   CHECK ALL COMPLETED
========================================= */

function checkAllCompleted() {

    if (
        tasks.length > 0 &&
        tasks.every(
            task => task.completed
        )
    ) {

        updateBearMessage(
            randomMessage("allDone")
        );

        celebrateBear();

        createConfetti();

    }

}


/* =========================================
   PROGRESS
========================================= */

function updateProgress() {

    const total =
        tasks.length;

    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const percent =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    progressFill.style.width =
        `${percent}%`;


    percentage.textContent =
        `${percent}%`;


    completedText.textContent =
        `${completed} completed`;


    totalText.textContent =
        `${total} ${
            total === 1
                ? "session"
                : "sessions"
        }`;


    if (total === 0) {

        progressTitle.textContent =
            "Let's get started!";

    } else if (percent === 100) {

        progressTitle.textContent =
            "Perfect day! 🎉";

    } else if (percent >= 70) {

        progressTitle.textContent =
            "You're on fire! 🔥";

    } else if (percent >= 40) {

        progressTitle.textContent =
            "Keep the momentum!";

    } else {

        progressTitle.textContent =
            "Every step counts.";

    }

}


/* =========================================
   CLEAR ALL
========================================= */

clearBtn.addEventListener(
    "click",
    function() {

        if (tasks.length === 0) return;


        const confirmed =
            confirm(
                "Clear all study sessions?"
            );


        if (!confirmed) return;


        tasks = [];

        saveTasks();

        renderTasks();

        updateProgress();


        updateBearMessage(
            "Fresh start! Let's build again 🌱"
        );


        showToast(
            "All sessions cleared"
        );

    }
);


/* =========================================
   BEAR CLICK
========================================= */

bearCard.addEventListener(
    "click",
    function() {

        updateBearMessage(
            randomMessage("clicked")
        );


        bear.style.transform =
            "scale(1.08) rotate(-3deg)";


        setTimeout(() => {

            bear.style.transform = "";

        }, 400);

    }
);


/* =========================================
   BEAR CELEBRATION
========================================= */

function celebrateBear() {

    bearCard.classList.remove(
        "celebrate"
    );


    void bearCard.offsetWidth;


    bearCard.classList.add(
        "celebrate"
    );


    setTimeout(() => {

        bearCard.classList.remove(
            "celebrate"
        );

    }, 900);

}


/* =========================================
   TOAST
========================================= */

let toastTimer;


function showToast(message) {

    toast.querySelector("p")
        .textContent = message;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2500);

}


/* =========================================
   CONFETTI
========================================= */

function createConfetti() {

    for (
        let i = 0;
        i < 30;
        i++
    ) {

        const piece =
            document.createElement("div");


        piece.style.position =
            "fixed";

        piece.style.width =
            "7px";

        piece.style.height =
            "7px";

        piece.style.background =
            i % 2 === 0
                ? "#C77DFF"
                : "#9D4EDD";

        piece.style.left =
            Math.random() * 100 + "vw";

        piece.style.top =
            "-10px";

        piece.style.borderRadius =
            "2px";

        piece.style.zIndex =
            "9999";

        piece.style.pointerEvents =
            "none";


        document.body.appendChild(
            piece
        );


        const animation =
            piece.animate(

                [
                    {
                        transform:
                            "translateY(0) rotate(0)",
                        opacity: 1
                    },

                    {
                        transform:
                            `translateY(${
                                window.innerHeight + 100
                            }px)
                             rotate(${
                                Math.random() * 720
                            }deg)`,

                        opacity: 0
                    }

                ],

                {

                    duration:
                        1800 +
                        Math.random() * 1200,

                    easing:
                        "cubic-bezier(.2,.8,.2,1)"

                }

            );


        animation.onfinish =
            () => piece.remove();

    }

}


/* =========================================
   DARK / LIGHT MODE
========================================= */

let lightMode = true;

themeBtn.addEventListener(
    "click",
    function() {

        lightMode = !lightMode;

        if (!lightMode) {

            document.body.style.background =
                "#10002B";

            document.body.style.color =
                "#FFFFFF";

            themeBtn.textContent = "☀";

            updateBearMessage(
                "Welcome to night mode! 🌙"
            );

        } else {

            document.body.style.background = "";

            document.body.style.color = "";

            themeBtn.textContent = "☾";

            updateBearMessage(
                "Back to the bright side! ☀️"
            );

        }

    }
);


/* =========================================
   IDLE DETECTION
========================================= */

let idleTimer;


function resetIdleTimer() {

    clearTimeout(idleTimer);


    idleTimer =
        setTimeout(() => {

            updateBearMessage(
                randomMessage("sleepy")
            );

        }, 20000);

}


[
    "mousemove",
    "keydown",
    "click",
    "scroll"
].forEach(event => {

    document.addEventListener(
        event,
        resetIdleTimer
    );

});


/* =========================================
   INITIAL LOAD
========================================= */

renderTasks();

updateProgress();

updateBearMessage(
    randomMessage("welcome")
);

resetIdleTimer();