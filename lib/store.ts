import {
  Contact, Item, Warehouse, StockAdjustment, Invoice, Quote, CustomerPayment,
  CreditNote, Bill, PurchaseOrder, Expense, BankAccount, BankTransaction,
  Account, JournalEntry, Project, TimesheetEntry, AutomationRule, AuditLog,
  OrganizationSettings
} from './types';

export const INITIAL_ORG_SETTINGS: OrganizationSettings = {
  name: 'Adcare Meds & Pharmacy Online Home Service',
  legalName: 'AD CARE Meds & Pharmacy',
  tagline: 'Online Home Delivery & Pharmacy Service',
  taxId: 'PK-984712093',
  email: 'info@adcare.pk',
  phone: '0342-3010508',
  website: 'https://adcarerxbooks.com',
  currency: 'PKR',
  fiscalYearStart: 'January',
  address: 'Peshawar, Khyber Pakhtunkhwa',
  city: 'Peshawar',
  country: 'Pakistan'
};

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c_gul',
    name: 'Gul Jana',
    companyName: 'Gul Jana (Home Patient)',
    type: 'customer',
    email: 'guljana@homepatient.pk',
    phone: '+92 342 3010508',
    address: 'Sector F-3, Phase 6',
    city: 'Peshawar',
    country: 'Pakistan',
    receivables: 0.00,
    payables: 0.00,
    status: 'active',
    createdAt: '2026-09-01'
  },
  {
    id: 'v_pharma',
    name: 'Tariq Khan',
    companyName: 'Peshawar Pharmaceutical Wholesalers & Distributors',
    type: 'vendor',
    email: 'supply@peshawarpharma.pk',
    phone: '+92 91 5841029',
    address: 'Khyber Medical Market',
    city: 'Peshawar',
    country: 'Pakistan',
    receivables: 0.00,
    payables: 0.00,
    status: 'active',
    createdAt: '2026-09-01'
  }
];

export const INITIAL_ITEMS: Item[] = [
  {
    id: 'i_meroget',
    name: 'Inj Meropenem 1g (Meroget)',
    sku: 'MED-MER-1G',
    type: 'product',
    unit: 'vial',
    salesPrice: 1600.00,
    costPrice: 1200.00,
    taxRate: 0,
    stockOnHand: 50,
    reorderPoint: 10,
    description: 'Broad-spectrum carbapenem antibiotic for intravenous administration.',
    status: 'active'
  },
  {
    id: 'i_vinjec',
    name: 'Inj Vancomycin 1g (Vinjec)',
    sku: 'MED-VAN-1G',
    type: 'product',
    unit: 'vial',
    salesPrice: 1000.00,
    costPrice: 750.00,
    taxRate: 0,
    stockOnHand: 30,
    reorderPoint: 5,
    description: 'Glycopeptide antibiotic vial for severe bacterial infections.',
    status: 'active'
  },
  {
    id: 'i_paracetamol',
    name: 'Tab Paracetamol 500mg',
    sku: 'MED-PCT-500',
    type: 'product',
    unit: 'pack',
    salesPrice: 50.00,
    costPrice: 35.00,
    taxRate: 0,
    stockOnHand: 200,
    reorderPoint: 30,
    description: 'Analgesic and antipyretic tablets for pain & fever relief.',
    status: 'active'
  }
];

export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 'w1',
    name: 'Peshawar Central Pharmacy Warehouse',
    code: 'WH-PWR-01',
    location: 'Peshawar, KP',
    isPrimary: true,
    totalStock: 280
  }
];

export const INITIAL_INVOICES: Invoice[] = [];

export const INITIAL_BILLS: Bill[] = [];

export const INITIAL_EXPENSES: Expense[] = [];

export const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'ba1',
    accountName: 'Meezan Bank - AD CARE Pharmacy Operating Account',
    accountNumber: '•••• •••• 5678',
    bankName: 'Meezan Bank Limited',
    accountType: 'checking',
    currency: 'PKR',
    balance: 250000.00,
    lastReconciledDate: '2026-09-01',
    status: 'connected'
  }
];

export const INITIAL_BANK_TRANSACTIONS: BankTransaction[] = [];

export const INITIAL_ACCOUNTS: Account[] = [
  // Assets
  { id: 'acc-1010', code: '1010', name: 'Meezan Bank Operating Account', category: 'asset', type: 'Bank', balance: 250000.00, description: 'Primary pharmacy operational account.', isSystem: true },
  { id: 'acc-1200', code: '1200', name: 'Accounts Receivable (A/R)', category: 'asset', type: 'Accounts Receivable', balance: 0.00, description: 'Uncollected customer receivables balance.', isSystem: true },
  { id: 'acc-1400', code: '1400', name: 'Pharmaceutical Inventory on Hand', category: 'asset', type: 'Inventory', balance: 0.00, description: 'Valuation of medicine inventory on hand.', isSystem: true },

  // Liabilities
  { id: 'acc-2000', code: '2000', name: 'Accounts Payable (A/P)', category: 'liability', type: 'Accounts Payable', balance: 0.00, description: 'Unpaid vendor supplier bills balance.', isSystem: true },

  // Equity
  { id: 'acc-3000', code: '3000', name: 'Owner Capital / Equity', category: 'equity', type: 'Equity', balance: 250000.00, description: 'Paid-in pharmacy capital.', isSystem: true },
  { id: 'acc-3200', code: '3200', name: 'Retained Earnings', category: 'equity', type: 'Equity', balance: 0.00, description: 'Accumulated net profit.', isSystem: true },

  // Income
  { id: 'acc-4000', code: '4000', name: 'Medicine & Pharmacy Sales Income', category: 'income', type: 'Income', balance: 0.00, description: 'Revenue from medicine home delivery sales.', isSystem: true },

  // Expenses
  { id: 'acc-6100', code: '6100', name: 'Pharmaceutical Procurement Cost', category: 'expense', type: 'Expense', balance: 0.00, description: 'Cost of goods purchased from distributors.', isSystem: true },
  { id: 'acc-6200', code: '6200', name: 'Rent & Logistics Expense', category: 'expense', type: 'Expense', balance: 0.00, description: 'Store lease & delivery vehicle fuel costs.', isSystem: true }
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [];

export const INITIAL_PROJECTS: Project[] = [];

export const INITIAL_TIMESHEETS: TimesheetEntry[] = [];

export const INITIAL_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'ar1',
    title: 'Low Medicine Stock Alert',
    trigger: 'low_stock',
    action: 'notify_admin',
    status: 'active',
    lastRun: '2026-09-15 10:00 AM',
    description: 'Sends notification when any medicine inventory falls below reorder point threshold.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'al_init',
    timestamp: '2026-09-15 09:00:00',
    userName: 'Admin',
    action: 'SYSTEM_INIT',
    module: 'System',
    details: 'AD CARE Pharmacy persistent storage initialized',
    ipAddress: '127.0.0.1'
  }
];
