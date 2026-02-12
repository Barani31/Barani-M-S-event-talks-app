const fs = require('fs');

const talksData = [
    {
        id: 'talk1',
        title: 'The Future of AI in Web Development',
        speakers: ['Dr. Alice Smith'],
        categories: ['AI', 'Web Development', 'Future'],
        duration: 60,
        description: 'Explore how artificial intelligence is shaping the next generation of web applications, from intelligent UIs to backend optimizations.'
    },
    {
        id: 'talk2',
        title: 'Mastering Modern JavaScript Frameworks',
        speakers: ['Bob Johnson', 'Carol White'],
        categories: ['JavaScript', 'Front-end', 'Frameworks'],
        duration: 60,
        description: 'A deep dive into the latest features and best practices in popular JavaScript frameworks like React, Vue, and Angular.'
    },
    {
        id: 'talk3',
        title: 'DevOps for Startups: Building Scalable Systems',
        speakers: ['David Green'],
        categories: ['DevOps', 'Cloud', 'Architecture'],
        duration: 60,
        description: 'Learn essential DevOps strategies and tools for building robust, scalable infrastructure on a startup budget.'
    },
    {
        id: 'talk4',
        title: 'Cybersecurity Essentials for Developers',
        speakers: ['Security', 'Best Practices'],
        categories: ['Cybersecurity', 'Web Development'],
        duration: 60,
        description: 'Understanding common vulnerabilities and how to write secure code from the ground up.'
    },
    {
        id: 'talk5',
        title: 'Data Science with Node.js',
        speakers: ['Frank Blue'],
        categories: ['Data Science', 'Node.js', 'Machine Learning'],
        duration: 60,
        description: 'Discover how Node.js can be a powerful platform for data manipulation, analysis, and even machine learning.'
    },
    {
        id: 'talk6',
        title: 'UI/UX Design Principles for Developers',
        speakers: ['Grace Purple', 'Henry Yellow'],
        categories: ['UI/UX', 'Design', 'Front-end'],
        duration: 60,
        description: 'A practical guide to fundamental UI/UX principles that every developer should know to build user-friendly interfaces.'
    }
];

function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
}

function calculateSchedule(talks) {
    let currentDateTime = new Date();
    currentDateTime.setHours(10, 0, 0, 0); // Start at 10:00 AM

    const scheduledItems = [];
    const talkDuration = 60; // minutes
    const transitionDuration = 10; // minutes
    const lunchDuration = 60; // minutes

    for (let i = 0; i < talks.length; i++) {
        const talk = talks[i];

        // Add transition before the current talk, except for the very first one
        if (i > 0 && i !== 3) { // No transition before 1st talk, and special handling for after lunch
            currentDateTime.setMinutes(currentDateTime.getMinutes() + transitionDuration);
            scheduledItems.push({
                type: 'transition',
                startTime: formatTime(new Date(currentDateTime.getTime() - transitionDuration * 60 * 1000)), // Start of transition
                endTime: formatTime(currentDateTime),
                description: 'Transition Break'
            });
        }

        // Check for lunch break after the 3rd talk
        if (i === 3) {
            currentDateTime.setMinutes(currentDateTime.getMinutes() + transitionDuration);
             scheduledItems.push({
                type: 'transition',
                startTime: formatTime(new Date(currentDateTime.getTime() - transitionDuration * 60 * 1000)), // Start of transition
                endTime: formatTime(currentDateTime),
                description: 'Transition Break'
            });
            let lunchStartTime = new Date(currentDateTime);
            currentDateTime.setMinutes(currentDateTime.getMinutes() + lunchDuration);
            scheduledItems.push({
                type: 'lunch',
                title: 'Lunch Break',
                startTime: formatTime(lunchStartTime),
                endTime: formatTime(currentDateTime),
                duration: lunchDuration,
                description: 'Enjoy your lunch!'
            });
            currentDateTime.setMinutes(currentDateTime.getMinutes() + transitionDuration); // Transition after lunch
            scheduledItems.push({
                type: 'transition',
                startTime: formatTime(new Date(currentDateTime.getTime() - transitionDuration * 60 * 1000)), // Start of transition
                endTime: formatTime(currentDateTime),
                description: 'Transition Break'
            });
        }

        const talkStartTime = new Date(currentDateTime);
        currentDateTime.setMinutes(currentDateTime.getMinutes() + talkDuration);
        const talkEndTime = new Date(currentDateTime);

        scheduledItems.push({
            type: 'talk',
            ...talk,
            startTime: formatTime(talkStartTime),
            endTime: formatTime(talkEndTime)
        });
    }

    return scheduledItems;
}

const fullSchedule = calculateSchedule(talksData);

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tech Event Schedule</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f7f6;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 900px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
        }
        .search-container {
            margin-bottom: 30px;
            text-align: center;
        }
        .search-container input[type="text"] {
            width: 70%;
            padding: 12px 15px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 1em;
            transition: border-color 0.3s ease;
        }
        .search-container input[type="text"]:focus {
            border-color: #3498db;
            outline: none;
        }
        .talk-list {
            display: grid;
            gap: 25px;
        }
        .talk-card {
            background-color: #e8f4f8;
            border-left: 5px solid #3498db;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            transition: transform 0.2s ease-in-out;
        }
        .talk-card:hover {
            transform: translateY(-5px);
        }
        .talk-card.lunch-break {
            border-left: 5px solid #f39c12;
            background-color: #fef5e7;
        }
        .talk-card.transition-break {
            border-left: 5px solid #bdc3c7;
            background-color: #f0f3f5;
            color: #666;
            font-style: italic;
            text-align: center;
            padding: 10px 20px;
        }
        .talk-card h2 {
            color: #2c3e50;
            margin-top: 0;
            font-size: 1.5em;
        }
        .talk-card .time {
            font-weight: bold;
            color: #e67e22;
            margin-bottom: 10px;
            display: block;
        }
        .talk-card .speakers {
            font-style: italic;
            color: #555;
            margin-bottom: 10px;
        }
        .talk-card .categories {
            margin-top: 10px;
        }
        .talk-card .category-tag {
            display: inline-block;
            background-color: #3498db;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 0.8em;
            margin-right: 5px;
            margin-bottom: 5px;
        }
        .talk-card p {
            margin-bottom: 0;
            color: #444;
        }
        .no-results {
            text-align: center;
            color: #888;
            font-size: 1.2em;
            margin-top: 50px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Tech Event Schedule</h1>
        <div class="search-container">
            <input type="text" id="categorySearch" placeholder="Search by category (e.g., AI, Front-end, Node.js)">
        </div>
        <div class="talk-list" id="talkList">
            <!-- Talks will be rendered here by JavaScript -->
        </div>
    </div>

    <script>
        const scheduledItems = JSON.parse(`
${JSON.stringify(fullSchedule, null, 2)}
        `);

        function renderSchedule(filterText = '') {
            const talkListDiv = document.getElementById('talkList');
            talkListDiv.innerHTML = ''; // Clear previous results

            const filteredItems = scheduledItems.filter(item => {
                if (!filterText) return true; // Show all if no filter
                if (item.type === 'talk') {
                    return item.categories.some(cat => cat.toLowerCase().includes(filterText.toLowerCase()));
                }
                return true; // Always show breaks regardless of filter
            });

            if (filteredItems.length === 0) {
                talkListDiv.innerHTML = '<p class="no-results">No talks found matching your search criteria.</p>';
                return;
            }

            filteredItems.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('talk-card');

                if (item.type === 'lunch') {
                    card.classList.add('lunch-break');
                    card.innerHTML = `
                        <span class="time">
${item.startTime} - ${item.endTime}</span>
                        <h2>${item.title}</h2>
                        <p>${item.description}</p>
                    `;
                } else if (item.type === 'transition') {
                    card.classList.add('transition-break');
                    card.innerHTML = `
                        <span class="time">
${item.startTime} - ${item.endTime}</span>
                        <p>${item.description}</p>
                    `;
                }
                 else {
                    card.innerHTML = `
                        <span class="time">
${item.startTime} - ${item.endTime}</span>
                        <h2>${item.title}</h2>
                        <p class="speakers">Speaker(s): ${item.speakers.join(', ')}</p>
                        <p>${item.description}</p>
                        <div class="categories">
                            ${item.categories.map(cat => `<span class="category-tag">${cat}</span>`).join('')}
                        </div>
                    `;
                }
                talkListDiv.appendChild(card);
            });
        }

        // Initial render
        renderSchedule();

        // Event listener for search
        document.getElementById('categorySearch').addEventListener('keyup', (event) => {
            renderSchedule(event.target.value);
        });
    </script>
</body>
</html>
