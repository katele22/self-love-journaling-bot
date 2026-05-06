# Self-Love Journaling Bot

An automated journaling reminder and response system built with **n8n**, **Google Forms**, **Google Sheets**, and **Discord**, self-hosted on **Oracle Cloud**.

---

## What It Does

The form uses a **Google Apps Script trigger** that automatically updates the daily writing prompt based on **365 Days of Writing Prompts** by *The Daily Post*, which has been formatted into a Google Sheet. Each day a new prompt is pulled and set as the form's question, so friends always have something fresh to journal about.

- **Daily at 9 PM** — reminds friends who haven't journaled today via Discord
- **When a friend submits** their journal entry via Google Forms — sends them back my response in return
- **Tracks submissions** in Google Sheets so no one gets spammed

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| n8n | Workflow automation |
| Google Forms | Journal entry submission |
| Google Apps Script | Daily prompt trigger (updates form question each day) |
| Google Sheets | Store responses + track last submission date |
| Discord API | Send server messages |

---

## Workflow Overview

<img width="998" height="844" alt="image" src="https://github.com/user-attachments/assets/584201d3-7725-4321-b904-a35398bee13d" />

### Workflow 1: Daily Reminder (9 PM)
```
Daily Trigger (9 PM)
  → Get All Friends (Google Sheets)
  → Filter Who Forgot to Journal (last submission date ≠ today)
  → Send Reminder to Server (Discord HTTP Request, tagging the user)
```

### Workflow 2: Send Response (on Form Submit)
```
Google Forms Webhook
  → Get user's Discord ID (Google Sheets)
  → Get my response for that user (Google Sheets)
  → Update Last Submission Date (Google Sheets)
  → Get user's ID (Discord API)
  → Merge data (n8n Merge node)
  → Send my response and confirmation message tagging them in the server (Discord HTTP Request)
```



## Built By

Made by **Dinh** as a personal project to encourage self-love journaling among friends, family, and loved ones.
