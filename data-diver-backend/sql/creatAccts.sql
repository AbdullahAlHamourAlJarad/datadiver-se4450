CREATE TABLE Accounts (
    account_id VARCHAR(50), 
    customer_id INT FOREIGN KEY REFERENCES [dbo].[Customer](customer_id),
    Amount DECIMAL(10, 2), 
    Suspicious VARCHAR(255) 
);
