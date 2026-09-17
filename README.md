# AD CARE — Meds & Pharmacy Business Accounting

A modern cloud-based business accounting and financial management platform designed for **Adcare Meds & Pharmacy Online Home Service** in Peshawar, Pakistan.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI:** Tailwind CSS, Lucide React Icons, Recharts
- **Database:** PostgreSQL with Prisma ORM
- **Runtime:** Node.js 20

## Features

| Module | Description |
|---|---|
| **Dashboard** | Overview of revenue, expenses, profit, receivables, payables, and bank balance |
| **Sales** | Invoices, Payments, Credit Notes, Quotes |
| **Purchases** | Bills, Purchase Orders |
| **Expenses** | Expense tracking with categories and payment modes |
| **Banking** | Bank accounts, transactions, and reconciliation |
| **Inventory** | Items (products/services), stock management, warehouses |
| **Contacts** | Customers and vendors with receivables/payables tracking |
| **Accounting** | Chart of Accounts, Journal Entries |
| **Reports** | Profit & Loss, Balance Sheet, Trial Balance |
| **Projects** | Project management and timesheet tracking |
| **Automation** | Automated rules (low stock alerts, overdue invoice reminders) |
| **Audit Logs** | Full audit trail of all actions |
| **AI Assistant** | Natural language queries against financial data |
| **Settings** | Organization profile and configuration |

---

## Prerequisites

- **Node.js** v20 or higher
- **PostgreSQL** (local or remote)
- **npm** (comes with Node.js)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "AD CARE"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Edit `.env.local` and update the database connection string:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/adcare_db?schema=public"
```

> Replace `postgres:postgres` with your actual PostgreSQL username and password. Update host, port, and database name as needed.

### 4. Set up the database

```bash
# Create the database (if it doesn't exist)
npx prisma db push

# Generate the Prisma client
npx prisma generate
```

### 5. Run the development server

```bash
npm run dev
```

The app will be available at **http://localhost:3000**

---

## Production Build

```bash
# Build the app
npm run build

# Start the production server
npm start
```

---

## Docker

A multi-stage Dockerfile is included.

```bash
# Build the Docker image
docker build -t adcare-app .

# Run the container
docker run -p 3000:3000 adcare-app
```

Make sure your PostgreSQL instance is accessible from within the Docker container (update `DATABASE_URL` accordingly).

---

## Project Structure

```
AD CARE/
├── app/                    # Next.js App Router pages
│   ├── api/                # REST API routes (contacts, invoices, bills, etc.)
│   ├── dashboard/          # Main dashboard
│   ├── invoices/           # Sales invoices
│   ├── bills/              # Purchase bills
│   ├── expenses/           # Expense tracking
│   ├── banking/            # Bank accounts & transactions
│   ├── items/              # Product/service catalog
│   ├── inventory/          # Stock management
│   ├── customers/          # Customer contacts
│   ├── vendors/            # Vendor contacts
│   ├── payments/           # Payment recording
│   ├── quotes/             # Sales quotes
│   ├── credit-notes/       # Credit notes
│   ├── purchase-orders/    # Purchase orders
│   ├── chart-of-accounts/  # Chart of accounts
│   ├── journal-entries/    # Journal entries
│   ├── reports/            # Financial reports (P&L, Balance Sheet, Trial Balance)
│   ├── projects/           # Project management
│   ├── automation/         # Automation rules
│   ├── audit-logs/         # Audit trail
│   ├── reconciliation/     # Bank reconciliation
│   └── settings/           # Organization settings
├── components/             # Reusable UI components
│   ├── ai/                 # AI Assistant drawer
│   ├── documents/          # Document print modal
│   ├── layout/             # Sidebar, Header, MainContentLayout
│   └── ui/                 # Brand logo
├── lib/                    # Core logic
│   ├── context.tsx         # React Context (global state & business logic)
│   ├── store.ts            # Initial seed data
│   ├── types.ts            # TypeScript type definitions
│   └── prisma.ts           # Prisma client singleton
├── prisma/
│   └── schema.prisma       # Database schema (14 models)
├── public/                 # Static assets
├── .env.local              # Environment variables
├── Dockerfile              # Multi-stage Docker build
├── next.config.js          # Next.js config
├── tailwind.config.js      # Tailwind config
└── package.json
```

---

## Database Models

| Model | Description |
|---|---|
| `OrganizationSettings` | Company profile and configuration |
| `Contact` | Customers and vendors |
| `Item` | Products and services catalog |
| `Warehouse` | Storage locations |
| `Invoice` / `InvoiceItem` | Sales invoices |
| `Bill` / `BillItem` | Purchase bills |
| `Expense` | Expense records |
| `BankAccount` | Bank accounts |
| `BankTransaction` | Bank transactions |
| `Account` | Chart of accounts |
| `JournalEntry` / `JournalEntryLine` | Double-entry journal |
| `AuditLog` | Audit trail |

---

## Currency

All monetary values are in **PKR (Pakistani Rupee)**.

---

## License

Private — Internal use only.
