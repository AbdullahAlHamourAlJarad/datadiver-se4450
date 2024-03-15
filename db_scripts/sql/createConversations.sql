Use DataDiverDB;

CREATE TABLE Conversations (
    conversationID INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) NOT NULL,
    created DATETIME,
    chatTitle NVARCHAR(255),
    FOREIGN KEY (email) REFERENCES Users(email)
);