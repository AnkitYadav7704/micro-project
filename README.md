# Student Enrollment Form using JsonPowerDB

This project is a web-based Student Enrollment Form developed using HTML, CSS, JavaScript, and JsonPowerDB.

The application stores student information in the STUDENT-TABLE relation of SCHOOL-DB and performs CRUD operations using JsonPowerDB APIs.

## Features

- Search student records using Roll Number
- Add new student records
- Update existing student records
- Reset form data
- Validation for empty fields
- Integration with JsonPowerDB

## Input Fields

- Roll No (Primary Key)
- Full Name
- Class
- Birth Date
- Address
- Enrollment Date

## Technologies Used

- HTML
- CSS
- JavaScript
- JsonPowerDB

## How It Works

1. Enter Roll Number.
2. If the Roll Number does not exist:
   - Enter student details.
   - Save the record to JsonPowerDB.
3. If the Roll Number already exists:
   - Existing data is fetched automatically.
   - Update the details if required.
4. Use Reset to clear the form.

## Learning Outcomes

- Working with JsonPowerDB APIs
- Performing CRUD operations
- Form validation using JavaScript
- Database integration in web applications

## Author

Ankit Yadav
