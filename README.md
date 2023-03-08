# Preference-Based Course Allocation

This is a web application that allows students to submit their course preferences and helps allocate courses to them based on their preferences. The application is built using Python FastAPI on the backend and Next.js on the frontend.

The application allows users to submit a list of students along with their course preferences, and a list of courses with the maximum number of students that can be enrolled in each course. The application then uses an algorithm to allocate courses to students based on their preferences and the availability of seats in the courses.

The algorithm used for allocation is designed to maximize the number of students who are allocated their preferred courses while also ensuring that the maximum capacity of each course is not exceeded. The algorithm is written

## Getting Started

Clone the repository to your local machine:

```bash
git clone https://github.com/iammatthi/pbc.git
```

Move into the project directory:

```bash
cd pbc
```

### Backend

Install the backend dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

The API should now be accessible at http://localhost:8000.

### Frontend

Install the frontend dependencies:

```bash
cd frontend
yarn
```

Start the frontend:

```bash
yarn dev
```

The web application should now be accessible at http://localhost:3000.

## Features

- [x] Submit a list of students with their preferences.
- [x] Submit a list of courses with max allocation.
- [ ] Students can indicate if they want to stay in the same course.
- [ ] Provide an option for users to enforce that the number of students assigned to each course is a multiple of a given number (e.g. even number).

## Contributing

We welcome contributions from anyone who is interested in improving this project! Here are some ways you can contribute:

- Report Bugs: If you encounter any bugs or issues while using the application, please [open an issue](https://github.com/iammatthi/pbc/issues/new) on our GitHub repository. Please be as detailed as possible when reporting issues so that we can reproduce and fix them quickly.

- Add Features: If you would like to add new features or improve existing ones, please [fork the repository](https://github.com/iammatthi/pbc/fork) and submit a pull request with your changes. Before submitting a pull request, please make sure that your changes are consistent with the project's goals and coding standards.

- Improve Documentation: If you notice any errors or omissions in the project documentation, please submit a pull request with your changes or open an issue to let us know.

Thank you for your interest in contributing to this project!
