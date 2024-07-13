function switchToCredentialsPage() {
    document.getElementById('signup-page').style.display = 'none';
    document.getElementById('credentials-page').style.display = 'flex';
};

function switchToPanelsPage() {
    if (localStorage.getItem('currentUser').substring(0, 5).toLowerCase() === 'admin') {
        document.getElementById('signin-page').style.display = 'none';
        document.getElementById('home-page').style.display = 'flex';
        document.getElementById('admin-panel').style.display = 'flex';
    }
    else {
        document.getElementById('signin-page').style.display = 'none';
        document.getElementById('credentials-page').style.display = 'none';
        document.getElementById('home-page').style.display = 'flex';
        document.getElementById('student-panel').style.display = 'flex';
    }
}

function switchToSearchStudent() {
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('search-student').style.display = 'flex';
}

function switchToDisplayStudent() {
    document.getElementById('search-student').style.display = 'none';
    document.getElementById('display-student').style.display = 'flex';
}

function switchToSearchRecord() {
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('search-record').style.display = 'flex';
}

function switchToIUpdateRecord() {
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('initial-update-record').style.display = 'flex';
}

function switchToFUpdateRecord() {
    document.getElementById('initial-update-record').style.display = 'none';
    document.getElementById('final-update-record').style.display = 'flex';
}

function returnToPanelsPage() {
    if (localStorage.getItem('currentUser').substring(0, 5).toLowerCase() === 'admin') {
        document.getElementById('search-student').style.display = 'none';
        document.getElementById('display-student').style.display = 'none';
        document.getElementById('search-record').style.display = 'none';
        document.getElementById('final-update-record').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'flex';
    }
    else {
        document.getElementById('insert-record').style.display = 'none';
        document.getElementById('student-panel').style.display = 'flex';
    }
}

function switchToAddRecord() {
    document.getElementById('student-panel').style.display = 'none';
    document.getElementById('insert-record').style.display = 'flex';
}

window.onload = function() {
    if (localStorage.getItem('currentUser')) {
        switchToPanelsPage(localStorage.getItem('currentUser'));
    }
};

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('signin-page').style.display = 'flex';

    const signupPage = document.getElementById('signup-page');
    const signinPage = document.getElementById('signin-page');
    const switchToSignIn = document.getElementById('switchToSignIn');
    const switchToSignUp = document.getElementById('switchToSignUp');

    switchToSignIn.addEventListener('click', function() {
        signupPage.style.display = 'none';
        signinPage.style.display = 'flex';
    });

    switchToSignUp.addEventListener('click', function() {
        signinPage.style.display = 'none';
        signupPage.style.display = 'flex';
    });
});

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('http://localhost:3000/select/eventname');
        const events = await response.json();

        const dropdowns = document.querySelectorAll('select[name="events"]');

        dropdowns.forEach(dropdown => {
            dropdown.innerHTML = '<option value="" disabled selected>Event</option>';

            events.forEach((eventName, index) => {
                const option = document.createElement('option');
                option.value = String(index + 1).padStart(4, '0');
                option.textContent = eventName;
                dropdown.appendChild(option);
            });
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        console.error(error);
    }
});

async function signUp(event) {
    event.preventDefault();

    const username = document.getElementById('signup-studnum').value;
    const password = document.getElementById('signup-password').value;

    if (username.substring(0, 5).toLowerCase() === 'admin') {
        alert('You may not register with the following username.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.text();
        alert(result);

        if (response.ok) {
            localStorage.setItem('currentUser', username);
            switchToCredentialsPage();
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
        console.error(error);
    }
}

async function signIn(event) {
    event.preventDefault();

    const username = document.getElementById('signin-studnum').value;
    const password = document.getElementById('signin-password').value;

    try {
        const response = await fetch('http://localhost:3000/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.text();
        alert(result);

        if (response.ok) {
            localStorage.setItem('currentUser', username);
            switchToPanelsPage();
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
        console.error(error);
    }
}

function signOut() {
    localStorage.clear();
    location.reload();
}

async function submitCredentials(event) {
    event.preventDefault();

    const username = localStorage.getItem('currentUser');
    const givenName = document.getElementById('given-name').value;
    const lastName = document.getElementById('last-name').value;
    const program = document.querySelector('input[name="program"]:checked').value;
    const house = document.querySelector('select[name="house"]').value;

    try {
        const response = await fetch('http://localhost:3000/insert/credentials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, givenName, lastName, program, house })
        });

        const result = await response.text();
        alert(result);

        if (response.ok) {
            switchToPanelsPage();
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
        console.error(error);
    }
}

async function searchStudent(event) {
    event.preventDefault();

    const username = document.getElementById('search-studinfo').value;
    const studentNumber = document.getElementById('studnum');
    const studentName = document.getElementById('student-name');
    const studentProgram = document.getElementById('student-program');
    const studentHouse = document.getElementById('student-house');
    const eventsWatched = document.getElementById('events-watched');
    const eventsPlayed = document.getElementById('events-played');

    try {
        const response = await fetch('http://localhost:3000/select/student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });

        const result = await response.json();
        alert(result.message);

        if (response.ok) {
            studentNumber.textContent = result.studentInfo[0][0];
            studentName.value = result.studentInfo[0][1];

            if (result.studentInfo[0][2] === 'BSCS') {
                studentProgram.value = 'BS Computer Science';
            } else {
                studentProgram.value = 'BS Information Technology';
            }
            
            studentHouse.value = result.studentInfo[0][3];
            eventsWatched.value = result.participationCounts.Audience;
            eventsPlayed.value = result.participationCounts.Player;
            switchToDisplayStudent()
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
        console.error(error);
    }
}

async function searchRecord(event) {
    event.preventDefault();

    const username = document.getElementById('search-studnum').value;
    const eventCode = document.getElementById('searchEventName').value;
    const dateAttended = document.getElementById('searchDateAttended').value;
    const participation = document.querySelector('input[name="searchParticipation"]:checked').value;

    try {
        const response = await fetch('http://localhost:3000/select/record', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, eventCode, dateAttended, participation })
        });

        const result = await response.text();
        alert(result);

        if (response.ok) {
            returnToPanelsPage();
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
        console.error(error);
    }
}

async function searchRecordToUpdate(event) {
    event.preventDefault();

    const username = document.getElementById('update-studnum').value;
    const eventCode = document.getElementById('updateEventName').value;
    const dateAttended = document.getElementById('iUpdateDateAttended').value;
    const participation = document.querySelector('input[name="iUpdateParticipation"]:checked').value;

    try {
        const response = await fetch('http://localhost:3000/select/record', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, eventCode, dateAttended, participation })
        });

        const result = await response.text();
        alert(result);

        if (response.ok) {
            switchToFUpdateRecord();
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
        console.error(error);
    }
}

async function updateRecord(event) {
    event.preventDefault();

    const username = document.getElementById('update-studnum').value;
    const eventCode = document.getElementById('updateEventName').value;
    const dateAttended = document.getElementById('fUpdateDateAttended').value;
    const participation = document.querySelector('input[name="fUpdateParticipation"]:checked').value;

    try {
        const response = await fetch('http://localhost:3000/update/record', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, eventCode, dateAttended, participation })
        });

        const result = await response.text();
        alert(result);

        if (response.ok) {
            returnToPanelsPage()
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
        console.error(error);
    }
}

async function insertRecord(event) {
    event.preventDefault();

    const username = localStorage.getItem('currentUser');
    const eventCode = document.getElementById('insertEventName').value;
    const dateAttended = document.getElementById('insertDateAttended').value;
    const participation = document.querySelector('input[name="insertParticipation"]:checked').value;

    try {
        const response = await fetch('http://localhost:3000/insert/record', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, eventCode, dateAttended, participation })
        });

        const result = await response.text();
        alert(result);

        if (response.ok) {
            returnToPanelsPage()
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
        console.error(error);
    }
}
