# GraphQL Profile Page

Welcome to the **GraphQL Profile Project**!  
This project fetches and visualizes user data from [Zone 01 Kisumu](https://learn.zone01kisumu.ke) using GraphQL, with a modern, responsive UI and secure authentication.

**Live Demo:** [https://graph-ql-gray.vercel.app/](https://graph-ql-gray.vercel.app/)

---

## Objectives

- **Fetch and display user profile data** from the Zone 01 Kisumu GraphQL API.
- **Authenticate users** using JWT (JSON Web Token).
- **Visualize XP, grades, skills, and audit data** with interactive SVG graphs.
- **Host the project** as a static site for easy access and sharing.

---

## API Details

- **GraphQL Endpoint:**  
  [`https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql`](https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql)
- **Authentication:**  
  Obtain a JWT from the login endpoint:  
  [`https://learn.zone01kisumu.ke/api/auth/signin`](https://learn.zone01kisumu.ke/api/auth/signin)

---

## Features

- **User Authentication**
  - Login with either `username:password` or `email:password`.
  - JWT-based authentication (Bearer token in headers).
- **Profile Data Display**
  - User ID, login, and personal info.
  - XP earned, grades, and top skills.
  - Audit details and ratios.
- **Graphical Data Visualization**
  - XP progression over time (line chart).
  - Audit ratio (bar graph).
  - Skills (donut/pie charts).
- **Modern UI/UX**
  - Responsive, accessible, and visually appealing.
  - Themed with a "jungle green" palette.
- **Hosting**
  - Deployed on [Vercel](https://graph-ql-gray.vercel.app/).

---

## Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/Githaiga22/GraphQL

```

### 2. Open with Live Server (for local development)

- Use VSCode's Live Server extension or any static server.

### 3. Open in Browser

- Navigate to `http://localhost:PORT` or use the [hosted site](https://graph-ql-gray.vercel.app/).

---

## GraphQL Query Examples

### Fetch User ID and Login

```graphql
{
  user {
    id
    login
  }
}
```

### Fetch Skills

```graphql
{
  skills: transactions(
    where: { type: { _like: "skill_%" } }
    order_by: [{ amount: desc }]
  ) {
    type
    amount
  }
}
```

### Fetch XP Transactions

```graphql
{
  transaction(
    where: { _and: [{ eventId: { _eq: 75 } }] }
    order_by: { createdAt: desc }
  ) {
    amount
    createdAt
    eventId
    path
    type
    userId
  }
}
```

### Fetch Audit Data

```graphql
{
  audits(
    order_by: { createdAt: desc }
    where: {
      closedAt: { _is_null: true }
      group: { captain: { canAccessPlatform: { _eq: true } } }
    }
  ) {
    closedAt
    group {
      captain {
        canAccessPlatform
      }
      captainId
      captainLogin
      path
      createdAt
      updatedAt
      members {
        userId
        userLogin
      }
    }
    private {
      code
    }
  }
}
```

### Fetch Level

```graphql
{
  events(where: { eventId: { _eq: 75 } }) {
    level
  }
}
```

### Fetch Grades

```graphql
{
  progress(
    where: { _and: [{ grade: { _is_null: false } }, { eventId: { _eq: 75 } }] }
    order_by: { createdAt: desc }
  ) {
    id
    createdAt
    eventId
    grade
    path
  }
}
```

---

## Example Data Format

```json
{
  "data": {
    "transaction": [
      { "type": "xp", "amount": 500 },
      { "type": "xp", "amount": -300 },
      { "type": "xp", "amount": 200 }
    ]
  }
}
```

---

## Credits


- Created by Allan Robinson ([githaiga22](https://github.com/githaiga22) | allangithaiga5@gmail.com)

---
