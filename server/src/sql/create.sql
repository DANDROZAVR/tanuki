
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(200) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS scripts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    source TEXT NOT NULL,
    path VARCHAR(200),
    user INTEGER REFERENCES users,
    UNIQUE(title, user)
);

CREATE TABLE IF NOT EXISTS schedule (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    options JSON, -- information about how often smth should be executed
    scriptID INTEGER REFERENCES scripts
);

CREATE TABLE IF NOT EXISTS calendar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scheduleID INTEGER REFERENCES schedule,
    datetime timestamp -- the time of scheduled execution of some script
)
