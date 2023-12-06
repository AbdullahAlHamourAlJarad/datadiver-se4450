CREATE TABLE Customer (
    customer_id INT PRIMARY KEY,
    first_name NVARCHAR(50),
    last_name NVARCHAR(50),
    email NVARCHAR(100),
    card_number NVARCHAR(16),
    card_type NVARCHAR(50),
    address NVARCHAR(255),
    city NVARCHAR(255)
)
END