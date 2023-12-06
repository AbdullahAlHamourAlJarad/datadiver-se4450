CREATE TABLE Transactions (
    transaction_id INT PRIMARY KEY,
    customer_id INT FOREIGN KEY REFERENCES Customers(customer_id),
    Amount DECIMAL(10, 2), -- Adjust precision and scale as needed
    merchant VARCHAR(255), -- Adjust the length as needed
    attempts INT,
    approved VARCHAR(3) CHECK (approved IN ('Yes', 'No')),
    fraud DECIMAL(10, 2) -- Adjust precision and scale as needed
);
