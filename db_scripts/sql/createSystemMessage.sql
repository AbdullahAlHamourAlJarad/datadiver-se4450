Use DataDiverDB;

CREATE TABLE SystemMessage (
	messageID INT IDENTITY (1,1) PRIMARY KEY,
	interpreted_question NVARCHAR(max),
	query NVARCHAR(max),
	error VARCHAR(255),
	timestamp DATETIME NOT NULL,
	rating BIT,
	conversationID INT NOT NULL,
	FOREIGN KEY (conversationID) REFERENCES Conversations(conversationID)
);