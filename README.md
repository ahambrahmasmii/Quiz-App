
# Quiz Application

A simple quiz application built with React. This app allows users to take a quiz, answer questions, and view their results. The questions are fetched from an API, and the answers are submitted to the backend for evaluation. The app includes functionality for starting the quiz, navigating between questions, and retaking the quiz.

## Features

- **Start Quiz**: Begin the quiz by clicking the "Start Quiz" button.
- **Navigation**: Navigate between questions using the "Next" and "Previous" buttons.
- **Submit Quiz**: Submit the quiz to view the results.
- **View Results**: After submitting, see your score along with the correct answers and your answers.
- **Retake Quiz**: Option to retake the quiz after viewing the results.

## Technologies Used

- **React**: Frontend framework for building the user interface.
- **CSS**: Styling for the application.
- **Fetch API**: To interact with the backend and retrieve questions and submit answers.
- **Django (Backend)**: The backend API (assumed to be Django) serves quiz questions and handles submission of answers.

## Setup

### Prerequisites

- Node.js and npm installed on your system.
- Python and Django installed on your system.
- Backend API running locally or on a server that serves quiz questions and evaluates answers.

### Running the React Project

1. **Navigate to the React project directory**:
   ```bash
   cd Frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the React development server**:
   ```bash
   npm start
   ```

   This will run the React app on `http://localhost:3000` by default.

### Running the Django Project

1. **Navigate to the Django project directory**:
   ```bash
   cd Backend
   ```

2. **Apply migrations**:
   ```bash
   python manage.py migrate
   ```

3. **Run the Django development server**:
   ```bash
   python manage.py runserver
   ```

   This will run the Django app on `http://localhost:8000` by default.
