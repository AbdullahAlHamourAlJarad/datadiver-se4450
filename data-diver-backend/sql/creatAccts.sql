CREATE TABLE Accounts (
    account_id VARCHAR(50), -- Adjust the length as needed
    customer_id INT FOREIGN KEY REFERENCES [dbo].[Customer](customer_id),
    Amount DECIMAL(10, 2), -- Adjust precision and scale as needed
    Suspicious VARCHAR(255) -- Adjust the length as needed
);
