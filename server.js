const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://XXX.XXX.XXX.XXX:5500' /*Change this to your local IP address*/
}));

app.get('/select/eventname', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: 'SYSTEM',
            password: 'admin',
            connectString: 'localhost/XE'
        });

        const result = await connection.execute(`SELECT EventName FROM EventInfo`);

        if (result.rows.length > 0) {
            res.status(200).json(result.rows.map(row => row[0]));
        } else {
            res.status(404).json([]);
        }
    } catch (err) {
        res.status(500).send('An error occurred. Please try again later.');
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.post('/auth/signup', async (req, res) => {
    const { username, password } = req.body;
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: 'SYSTEM',
            password: 'admin',
            connectString: 'localhost/XE'
        });

        const result = await connection.execute(
            `SELECT COUNT(*) AS UsernameCount FROM UserData WHERE Username = :username`,
            [username]
        );

        if (result.rows[0][0] > 0) {
            res.status(400).send('Username already exists. Please choose a different username.');
        } else {
            await connection.execute(
                `INSERT INTO UserData (Username, Password) VALUES (:username, :password)`,
                [username, password]
            );
            await connection.commit();
            res.status(200).send('Signup successful!');
        }
    } catch (err) {
        res.status(500).send('An error occurred. Please try again later.');
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.post('/auth/signin', async (req, res) => {
    const { username, password } = req.body;
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: 'SYSTEM',
            password: 'admin',
            connectString: 'localhost/XE'
        });

        const result = await connection.execute(
            `SELECT * FROM UserData WHERE Username = :username AND Password = :password`,
            [username, password]
        );
        if (result.rows.length > 0) {
            res.status(200).send('Signin successful!');
        } else {
            res.status(401).send('Invalid username or password. Please try again.');
        }
    } catch (err) {
        res.status(500).send('An error occurred. Please try again later.');
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.post('/insert/credentials', async (req, res) => {
    const { username, givenName, lastName, program, house } = req.body;
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: 'C##CCIS_STUDENT',
            password: 'student',
            connectString: 'localhost/XE'
        });

        const result = await connection.execute(
            `INSERT INTO SYSTEM.StudInfo VALUES (:username, :givenName, :lastName, :program, :house)`,
            [username, givenName, lastName, program, house],
            { autoCommit: true }
        );

        if (result.rowsAffected && result.rowsAffected === 1) {
            res.status(200).send('Insertion successful');
        } else {
            res.status(500).send('Failed to insert data');
        }
    } catch (err) {
        res.status(500).send('An error occurred. Please try again later.');
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.post('/select/record', async (req, res) => {
    const { username, eventCode, dateAttended, participation } = req.body;
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: 'C##CCIS_ADMIN',
            password: 'admin',
            connectString: 'localhost/XE'
        });

        const result = await connection.execute(
            `SELECT * FROM SYSTEM.EventAttended WHERE StudNum = :username AND EventCode = :eventCode AND DateAttended = TO_DATE(:dateAttended, 'YYYY/MM/DD') AND Participation = :participation`,
            [username, eventCode, dateAttended, participation]
        );        

        if (result.rows.length > 0) {
            res.status(200).send('Records found');
        } else {
            res.status(404).send('No records found.');
        }
    } catch (err) {
        res.status(500).send('An error occurred. Please try again later.');
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.post('/update/record', async (req, res) => {
    const { username, eventCode, dateAttended, participation } = req.body;
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: 'C##CCIS_ADMIN',
            password: 'admin',
            connectString: 'localhost/XE'
        });

        const result = await connection.execute(
            `UPDATE SYSTEM.EventAttended SET DateAttended = TO_DATE(:dateAttended, 'YYYY/MM/DD'), Participation = :participation WHERE StudNum = :username AND EventCode = :eventCode`,
            [dateAttended, participation, username, eventCode],
            { autoCommit: true }
        );

        if (result.rowsAffected > 0) {
            res.status(200).send('Record updated successfully');
        } else {
            res.status(404).send('No matching record found to update');
        }
    } catch (err) {
        res.status(500).send('An error occurred. Please try again later.');
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.post('/insert/record', async (req, res) => {
    const { username, eventCode, dateAttended, participation } = req.body;
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: 'C##CCIS_STUDENT',
            password: 'student',
            connectString: 'localhost/XE'
        });

        const result = await connection.execute(
            `INSERT INTO SYSTEM.EventAttended VALUES (:username, :eventCode, TO_DATE(:dateAttended, 'YYYY/MM/DD'), :participation)`,
            [username, eventCode, dateAttended, participation],
            { autoCommit: true }
        );

        if (result.rowsAffected && result.rowsAffected === 1) {
            res.status(200).send('Insertion successful');
        } else {
            res.status(500).send('Failed to insert data');
        }
    } catch (err) {
        res.status(500).send('An error occurred. Please try again later.');
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
