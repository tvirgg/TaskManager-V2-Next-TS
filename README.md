# Gerus Task Manager

![Gerus Task Manager](./public/gerus-task-manager-screenshot.png)

**Gerus Task Manager** is a powerful and user-friendly web application designed to help users manage their tasks efficiently within a calendar interface. Built with **Next.js 15.0.1**, **TypeScript**, and **Tailwind CSS**, this application offers a seamless experience for adding, editing, and tracking tasks, while also integrating with external APIs to highlight holidays.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Components](#components)
- [Contexts](#contexts)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Demo

![Gerus Task Manager Demo](./public/gerus-task-manager-demo.gif)

*(Include a GIF or series of screenshots demonstrating the application's functionality)*

## Features

- **User Management**: Add multiple user profiles to manage tasks individually.
- **Calendar Integration**: Visualize tasks on a monthly calendar with holiday highlights.
- **Task Management**: Create, edit, mark as done, and delete tasks effortlessly.
- **Common Tasks**: Manage a list of common tasks that can be assigned to specific dates.
- **Persistent Storage**: All data is stored in `localStorage` for persistence across sessions.
- **Responsive Design**: Optimized for both desktop and mobile devices using Tailwind CSS.
- **Holiday Integration**: Fetches and displays holidays using the [isdayoff.ru API](https://isdayoff.ru/).

## Technologies Used

- **Next.js 15.0.1**: React framework for server-side rendering and generating static websites.
- **TypeScript**: Typed superset of JavaScript for better code quality and maintainability.
- **React**: JavaScript library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Context API**: For state management across the application.
- **isdayoff.ru API**: External API to fetch holiday data.

## Installation

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. You can download it from [here](https://nodejs.org/).
- **npm**: Comes bundled with Node.js.

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/gerus-task-manager.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd gerus-task-manager
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Configure Environment Variables**

   *(If any environment variables are required, specify them here. For this project, no additional configuration is necessary.)*

## Usage

### Running the Development Server

Start the development server with the following command:

```bash
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

To build the application for production, run:

```bash
npm run build
```

After building, you can start the production server with:

```bash
npm start
```

### Adding Users

1. On the home page, enter a username in the input field.
2. Click the "Add User" button to create a new user profile.
3. The user will appear in the list below. Click on the username to access the calendar and manage tasks.

### Managing Tasks

1. **Adding a Task**:
   - Click on a specific date in the calendar.
   - In the modal that appears, enter the task description and click "Add Task".
2. **Editing a Task**:
   - In the task list, click the "Edit" button next to the task you want to modify.
   - Update the task description and click "Update Task".
3. **Marking as Done**:
   - Click the "Done" button to move the task from "Todo" to "Done".
4. **Deleting a Task**:
   - Click the "Remove" button to delete the task.
5. **Moving a Task to the Next Day**:
   - Click the "Move" button to transfer the task to the next day.

### Managing Common Tasks

1. In the left panel, navigate to "Common Tasks".
2. Add new common tasks that can be assigned to any date.
3. Assign common tasks to specific dates directly from the task modal.

### Importing Tasks via JSON

1. Click the "Import Tasks via JSON" button in the task modal.
2. Enter a JSON array of tasks, e.g., `["Task 1", "Task 2"]`.
3. Click "Submit JSON" to add the tasks to the selected date.

## Project Structure

```
gerus-task-manager/
├── app/
│   ├── api/
│   │   └── isDayOff.ts
│   ├── calendar/
│   │   └── [username]/
│   │       └── page.tsx
│   ├── components/
│   │   ├── Calendar.tsx
│   │   ├── CommonTasks.tsx
│   │   ├── Day.tsx
│   │   ├── TaskModal.tsx
│   │   └── UserList.tsx
│   ├── contexts/
│   │   ├── TaskContext.tsx
│   │   └── UserContext.tsx
│   ├── globals.css
│   └── layout.tsx
├── node_modules/
├── public/
│   ├── gerus-task-manager-screenshot.png
│   └── gerus-task-manager-demo.gif
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
├── tsconfig.json
└── generate_app.py
```

## Components

### 1. `app/components/UserList.tsx`

Displays a list of users and allows adding new users.

- **Features**:
  - Add new users.
  - Select a user to manage their tasks.
- **Key Functions**:
  - `handleAddUser`: Adds a new user to the list.
  - `handleUserClick`: Navigates to the selected user's calendar.

### 2. `app/components/Calendar.tsx`

Renders the calendar interface for the selected user.

- **Features**:
  - Navigate between months.
  - Display holidays and weekends.
  - Click on dates to manage tasks.
- **Key Functions**:
  - `fetchHolidays`: Fetches holiday data for the current month.
  - `handleDayClick`: Opens the task modal for the selected day.
  - `handlePrevMonth` & `handleNextMonth`: Navigate between months.

### 3. `app/components/Day.tsx`

Represents an individual day in the calendar.

- **Props**:
  - `day`: The day number.
  - `isHoliday`: Indicates if the day is a holiday.
  - `hasTasks`: Indicates if there are tasks on the day.
  - `isCurrentDay`: Highlights the current day.
  - `onClick`: Handles click events to open the task modal.

### 4. `app/components/TaskModal.tsx`

Modal window for adding, editing, and managing tasks on a specific day.

- **Features**:
  - Add, edit, mark as done, and remove tasks.
  - Assign common tasks.
  - Import tasks via JSON.
- **Key Functions**:
  - `handleAddTask`: Adds a new task.
  - `handleEditTask`: Edits an existing task.
  - `handleToggleTaskStatus`: Marks a task as done.
  - `handleMoveTaskToNextDay`: Moves a task to the next day.
  - `handleAssignCommonTask`: Assigns a common task to the day.
  - `handleJsonSubmit`: Imports tasks from JSON.

### 5. `app/components/CommonTasks.tsx`

Manages common tasks that can be assigned to any date.

- **Features**:
  - Add new common tasks.
  - Remove existing common tasks.
- **Key Functions**:
  - `handleAddCommonTask`: Adds a new common task.
  - `handleRemoveCommonTask`: Removes a common task.

## Contexts

### 1. `app/contexts/UserContext.tsx`

Manages the current user state across the application.

- **State**:
  - `currentUser`: The currently selected user.
- **Functions**:
  - `setCurrentUser`: Sets the current user and updates `localStorage`.

### 2. `app/contexts/TaskContext.tsx`

Handles task-related state and operations.

- **State**:
  - `tasks`: All tasks categorized by user and date.
  - `commonTasks`: Common tasks for each user.
- **Functions**:
  - `addTask`, `removeTask`, `updateTask`: CRUD operations for tasks.
  - `toggleTaskStatus`: Marks tasks as done or todo.
  - `moveTaskToNextDay`: Moves tasks to the next day.
  - `addCommonTask`, `removeCommonTask`: Manage common tasks.
  - `assignCommonTaskToDate`: Assigns common tasks to specific dates.

## API Integration

### `app/api/isDayOff.ts`

Integrates with the [isdayoff.ru API](https://isdayoff.ru/) to fetch holiday data.

- **Function**: `getMonthlyHolidays`
  - **Parameters**:
    - `year`: The year for which to fetch holidays.
    - `month`: The month for which to fetch holidays.
    - `countryCode`: (Optional) The country code, default is `'ru'`.
  - **Returns**: An array of day numbers that are holidays.
- **Usage**:
  - Used in the `Calendar` component to highlight holidays on the calendar.

```typescript
const API_URL = 'https://isdayoff.ru/api/getdata';

export const getMonthlyHolidays = async (
  year: number,
  month: number,
  countryCode = 'ru'
): Promise<number[]> => {
  const response = await fetch(
    `${API_URL}?year=${year}&month=${month}&cc=${countryCode}&delimeter=%0A`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch holidays');
  }
  const data = await response.text();
  return data
    .split('\n')
    .map((day, index) => (day === '1' ? index + 1 : null))
    .filter((day) => day !== null) as number[];
};
```

## Contributing

Contributions are welcome! Follow the steps below to contribute to the project.

### Steps

1. **Fork the Repository**

   Click the "Fork" button at the top-right corner of the repository page to create a copy of the repository under your GitHub account.

2. **Clone the Forked Repository**

   ```bash
   git clone https://github.com/your-username/gerus-task-manager.git
   ```

3. **Navigate to the Project Directory**

   ```bash
   cd gerus-task-manager
   ```

4. **Create a New Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Make Changes**

   Implement your feature or bug fix.

6. **Commit Your Changes**

   ```bash
   git add .
   git commit -m "Add feature: your feature description"
   ```

7. **Push to the Branch**

   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**

   Go to the original repository and click "Compare & pull request". Provide a clear description of your changes and submit the pull request.

*This project was developed with ❤️ by [Gerus](https://github.com/tvirgg).*

# Gerus-tasks