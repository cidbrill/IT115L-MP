function switchToCredentialsPage() {
    document.getElementById('signup-page').style.display = 'none';
    document.getElementById('credentials-page').style.display = 'flex';
};

function switchToPanelsPage(username) {
    if (username.substring(0, 5).toLowerCase() === 'admin') {
        document.getElementById('signin-page').style.display = 'none';
        document.getElementById('home-page').style.display = 'flex';
        document.getElementById('admin-panel').style.display = 'flex';
    }
    else {
        document.getElementById('credentials-page').style.display = 'none';
        document.getElementById('home-page').style.display = 'flex';
        document.getElementById('student-panel').style.display = 'flex';
    }
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

function returnToPanelsPage(username) {
    if (username.substring(0, 5).toLowerCase() === 'admin') {
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
    }
});

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

    document.getElementById('signup-button').addEventListener('click', async function(event) {
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
                switchToCredentialsPage();
            }
        } catch (error) {
            alert('An error occurred. Please try again later.');
        }
    });

    document.getElementById('signin-button').addEventListener('click', async function(event) {
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
                switchToPanelsPage(username);
            }
        } catch (error) {
            alert('An error occurred. Please try again later.');
        }
    });

    document.getElementById('subcred-button').addEventListener('click', async function(event) {
        event.preventDefault();
        const username = document.getElementById('signup-studnum').value;
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
                switchToPanelsPage(username);
            }
        } catch (error) {
            alert('An error occurred. Please try again later.');
        }
    });

    document.getElementById('searchrec-button').addEventListener('click', async function(event) {
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
                returnToPanelsPage(document.getElementById('signin-studnum').value);
            }
        } catch (error) {
            alert('An error occurred. Please try again later.');
        }
    });

    document.getElementById('searchRecToUp-button').addEventListener('click', async function(event) {
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
        }
    });

    document.getElementById('updaterec-button').addEventListener('click', async function(event) {
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
                returnToPanelsPage(document.getElementById('signin-studnum').value)
            }
        } catch (error) {
            alert('An error occurred. Please try again later.');
        }
    });

    document.getElementById('insrec-button').addEventListener('click', async function(event) {
        event.preventDefault();
        let username;

        if (document.getElementById('signup-studnum').value === '') {
            username = document.getElementById('signin-studnum').value
        } else if (document.getElementById('signin-studnum').value === '') {
            username = document.getElementById('signup-studnum').value
        }

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
                returnToPanelsPage(document.getElementById('signin-studnum').value)
            }
        } catch (error) {
            alert('An error occurred. Please try again later.');
        }
    });
});
