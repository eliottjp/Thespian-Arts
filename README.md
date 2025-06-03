# 🎭 Thespian Arts App

A cross-platform app for members, parents, staff, and admins of Thespian Arts. Features include register tracking, resource sharing, member progress, reward systems, and more.

---

## ✅ Pages Overview

Below is the current app structure and progress across all roles.

---

### 🔐 AUTH
| Page               | Status | Path               | Notes                                          |
|--------------------|--------|--------------------|------------------------------------------------|
| Create Account     | ✅     | `login/create-account` |                                                |
| Login Selection    | ✅     | `login`            | Select account type: parent or member          |
| Member Login       | ✅     | `login/member`     |                                                |
| Parent/Staff Login | ✅     | `login/parent`     |                                                |
| Member Setup       | ✅     | `login/setup`      | Account setup via code                         |

---

### 🚀 ONBOARDING
| Page     | Status | Path               |
|----------|--------|--------------------|
| Step 1   | ✅     | `onboarding/step1` |
| Step 2   | ✅     | `onboarding/step2` |
| Step 3   | ✅     | `onboarding/step3` |
| Step 4   | ✅     | `onboarding/step4` |

---

### 👤 MEMBER
| Page               | Status | Path                                 | Notes                                       |
|--------------------|--------|--------------------------------------|---------------------------------------------|
| Dashboard          | ✅     | `member/`                            | Profile overview, progress, rewards         |
| Events List        | ✅     | `member/events`                      |                                              |
| Groups List        | ✅     | `member/group`                       |                                              |
| Group Details      | ✅     | `member/group/{group}`               | Includes group resources                    |
| Group Resources    | ✅     | `member/group/resources/view?{resource}` | View videos, PDFs, images etc.        |
| Profile            | ✅     | `member/profile`                     |                                              |
| Update Profile     | ✅     | `member/profile/update`              | Headshot required                           |
| Link Parent        | ✅     | `member/profile/link`                | Show code for linking                       |
| View Linked Parents| ✅     | `member/profile/connections`         |                                              |
| View Rewards       | ✅     | `member/rewards`                     | Spend points                                 |
| Redeem Reward      | ✅     | `member/rewards/redeem`              | Shows QR or 4-digit code                    |

---

### 👪 PARENT
| Page                | Status | Path                                       | Notes                                        |
|---------------------|--------|--------------------------------------------|----------------------------------------------|
| Dashboard           | ✅     | `parent/`                                  | Profile, updates, payments                   |
| Events              | ✅     | `parent/events`                            |                                              |
| Event Details       | ✅     | `parent/events/{event}`                    | RSVP, add to calendar                        |
| Groups List         | ✅     | `parent/group?{member}`                    |                                              |
| Group Details       | ✅     | `parent/group/{group}?{member}`           |                                              |
| Group Resources     | ✅     | `parent/resources/{member}`               |                                              |
| Resource Viewer     | ✅     | `parent/resources/view?{resource}`        |                                              |
| Member Timetable    | ✅     | `parent/timetable/{member}`               |                                              |
| Profile             | ✅     | `parent/profile`                          |                                              |
| Update Profile      | ✅     | `parent/profile/update`                   | Headshot required                            |
| Link Member         | ✅     | `parent/link-child`                       | Link via code                                |
| View Members        | ✅     | `parent/members`                          |                                              |
| Member Details      | ✅     | `parent/members/{member}`                |                                              |
| Edit Child Details  | ✅     | `parent/edit-child`                      | Emergency contacts, DOB, etc.                |
| Enroll Groups       | ✅     | `parent/payments/enroll`                 |                                              |
| Payment Dashboard   | ❌     | `parent/payments`                        |                                              |
| Payment History     | ❌     | `parent/payments/history`                |                                              |
| Payment Checkout    | ❌     | `parent/payments/checkout?{member}?{groups}` | Checkout for group enrollment           |
| Submit Absence      | ❌     | `parent/members/{member}/absence`         | Optional refund/skip if within time          |
| Shop                | ✅     | `parent/store`                           | Buy merch, DVDs, etc.                         |

---

### 🧑‍🏫 STAFF
| Page                | Status | Path                                 | Notes                                       |
|---------------------|--------|--------------------------------------|---------------------------------------------|
| Dashboard           | ✅     | `staff/`                              | Profile + event updates                     |
| Events List         | ✅     | `staff/events`                        |                                              |
| Groups List         | ✅     | `staff/group`                         |                                              |
| Group Details       | ✅     | `staff/group/{group}`                | Includes quick links                        |
| Group Resources     | ✅     | `staff/group/resources/view/{resource}`| View media                                  |
| Add Resources       | ✅     | `staff/group/resources/add`          |                                              |
| Take Register       | ✅     | `staff/group/{group}/register`       |                                              |
| Group Members       | ✅     | `staff/group/{group}/members`        |                                              |
| Profile             | ✅     | `staff/profile`                       |                                              |
| Update Profile      | ✅     | `staff/profile/update`               | Headshot required                            |
| Reports             | ✅     | `staff/reports`                      | Create incident or safeguarding reports     |
| Award Points        | ✅     | `staff/reward/award`                 |                                              |
| Reward Collection   | ✅     | `staff/reward/collect`               | QR code scanner                              |
| Search              | ✅     | `staff/search`                       | Search all members                          |
| Member Details      | ✅     | `staff/search/{member}`              |                                              |
| Tools               | ✅     | `staff/tools`                        | Shortcuts to common features                |
| Cover Planner       | ✅     | `staff/cover-planner`                | Lesson Planner for cover                    |
| Request Access      | ✅     | `staff/request-`                        | Shortcuts to common features                |



---

### 🛠️ STAFF ADMIN
| Page                 | Status | Path                    | Notes                          |
|----------------------|--------|-------------------------|---------------------------------|
| Groups List          | ✅     | `staff/admin/`          |                                 |
| Edit Groups          | ✅     | `staff/admin/`          |                                 |
| Add Group Members    | ✅     | `staff/admin/`          |                                 |
| Add Members          | ✅     | `staff/admin/`          |                                 |
| Edit Members         | ✅     | `staff/admin/`          |                                 |
| Manage Users         | ✅     | `staff/admin/`          |                                 |
| Payments Overview    | ❌     | `staff/admin/`          |                                 |
| Register Overview    | ❌     | `staff/admin/`          |                                 |
| Reports List         | ✅     | `staff/admin/reports`   |                                 |

---

## 🛠 Tech Stack

- **React** (Vite)
- **React Navigation** for navigation
- **Firebase Firestore** for backend
- **Firebase Storage** for media
- **Verce/ Firebase Hostingl** for web deployment
- **GitHub** for version control & collaboration

---

## 🧠 Next Steps

- [ ] Add message/chat system
- [ ] Register history & analytics
- [ ] Notification system
- [ ] Payment integration using Stripe
- [ ] Admin dashboard polish

---
