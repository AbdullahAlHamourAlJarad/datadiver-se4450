CREATE TABLE Transactions (
    transaction_id INT PRIMARY KEY,
    customer_id INT FOREIGN KEY REFERENCES Customers(customer_id),
    Amount DECIMAL(10, 2), 
    merchant VARCHAR(255), 
    attempts INT,
    approved VARCHAR(3) CHECK (approved IN ('Yes', 'No')),
    fraud DECIMAL(10, 2) 
);
