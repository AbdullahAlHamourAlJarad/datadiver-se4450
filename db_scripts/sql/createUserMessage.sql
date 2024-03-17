Use DataDiverDB;

CREATE TABLE UserMessage (
	messageID INT IDENTITY (1,1) PRIMARY KEY,
	chatString NVARCHAR(max) NOT NULL,
	timestamp DATETIME NOT NULL,
	conversationID INT NOT NULL,
	FOREIGN KEY (conversationID) REFERENCES Conversations(conversationID)
);