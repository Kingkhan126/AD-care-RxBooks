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
    id: 'c1',
    name: 'Sarah Connor',
    companyName: 'Apex Global Systems',
    type: 'customer',
    email: 's.connor@apexglobal.com',
    phone: '+1 (415) 890-1234',
    address: '500 Tech Highway',
    city: 'San Jose, CA',
    country: 'USA',
    receivables: 18450.00,
    payables: 0,
    status: 'active',
    createdAt: '2026-01-15'
  },
  {
    id: 'c2',
    name: 'David Miller',
    companyName: 'Horizon Tech Solutions',
    type: 'customer',
    email: 'dmiller@horizontech.io',
    phone: '+1 (212) 443-9821',
    address: '120 Broadway',
    city: 'New York, NY',
    country: 'USA',
    receivables: 6200.00,
    payables: 0,
    status: 'active',
    createdAt: '2026-02-01'
  },
  {
    id: 'c3',
    name: 'Elena Rostova',
    companyName: 'Vanguard Dynamics',
    type: 'customer',
    email: 'elena@vanguarddyn.com',
    phone: '+1 (312) 554-1090',
    address: '333 Michigan Ave',
    city: 'Chicago, IL',
    country: 'USA',
    receivables: 0.00,
    payables: 0,
    status: 'active',
    createdAt: '2026-02-10'
  },
  {
    id: 'v1',
    name: 'Marcus Vance',
    companyName: 'CloudScale Infrastructure Host',
    type: 'vendor',
    email: 'billing@cloudscale.net',
    phone: '+1 (800) 998-1122',
    address: '400 Data Center Way',
    city: 'Ashburn, VA',
    country: 'USA',
    receivables: 0,
    payables: 8400.00,
    status: 'active',
    createdAt: '2026-01-10'
  },
  {
    id: 'v2',
    name: 'Rachel Adams',
    companyName: 'Northwind Logistics & Warehousing',
    type: 'vendor',
    email: 'accounts@northwindlogistics.com',
    phone: '+1 (206) 887-3400',
    address: '77 Logistics Loop',
    city: 'Seattle, WA',
    country: 'USA',
    receivables: 0,
    payables: 2150.00,
    status: 'active',
    createdAt: '2026-01-20'
  }
];

export const INITIAL_ITEMS: Item[] = [
  {
    id: 'i1',
    name: 'AD Care RxBooks Enterprise Cloud Platform License',
    sku: 'ADC-SaaS-ENT',
    type: 'service',
    unit: 'seat/month',
    salesPrice: 450.00,
    costPrice: 50.00,
    taxRate: 10,
    stockOnHand: 999,
    reorderPoint: 0,
    description: 'Enterprise Cloud Business Accounting and ERP License.',
    status: 'active'
  },
  {
    id: 'i2',
    name: 'Implementation & Managed Onboarding',
    sku: 'ADC-SRV-ONB',
    type: 'service',
    unit: 'project',
    salesPrice: 3500.00,
    costPrice: 800.00,
    taxRate: 10,
    stockOnHand: 999,
    reorderPoint: 0,
    description: 'Dedicated financial setup, data migration, and team training.',
    status: 'active'
  },
  {
    id: 'i3',
    name: 'AD Care RxBooks Smart Edge IoT Gateway Device',
    sku: 'ADC-HW-GW01',
    type: 'product',
    unit: 'unit',
    salesPrice: 1250.00,
    costPrice: 620.00,
    taxRate: 10,
    stockOnHand: 48,
    reorderPoint: 15,
    description: 'Hardware telematics & inventory sensor node device.',
    status: 'active'
  },
  {
    id: 'i4',
    name: 'High-Speed Thermal Barcode Scanner',
    sku: 'ADC-HW-SCN',
    type: 'product',
    unit: 'unit',
    salesPrice: 280.00,
    costPrice: 110.00,
    taxRate: 10,
    stockOnHand: 112,
    reorderPoint: 25,
    description: 'Warehouse barcode and QR reader for real-time inventory count.',
    status: 'active'
  }
];

export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 'w1',
    name: 'Main Distribution Center - Bay Area',
    code: 'WH-BAY-01',
    location: 'San Jose, CA',
    isPrimary: true,
    totalStock: 120
  },
  {
    id: 'w2',
    name: 'East Coast Hub - New Jersey',
    code: 'WH-NJ-02',
    location: 'Secaucus, NJ',
    isPrimary: false,
    totalStock: 40
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv1',
    invoiceNumber: 'INV-0000078',
    customerId: 'c_gul',
    customerName: 'Gul jana',
    customerEmail: 'guljana@homepatient.pk',
    issueDate: '2026-09-01',
    dueDate: '2026-09-01',
    items: [
      { id: 'li1', itemId: 'i_meroget', itemName: 'Inj Meropenem 1g (Meroget)', description: '', quantity: 6.00, unitPrice: 1600.00, taxRate: 0, amount: 9600.00 },
      { id: 'li2', itemId: 'i_vinjec', itemName: 'Inj Vancomycin 1g (Vinjec)', description: '', quantity: 1.00, unitPrice: 1000.00, taxRate: 0, amount: 1000.00 }
    ],
    subtotal: 10600.00,
    taxTotal: 0,
    discountTotal: 0,
    shippingTotal: 0,
    totalAmount: 10600.00,
    amountPaid: 10600.00,
    balanceDue: 0.00,
    status: 'paid',
    notes: 'Thanks you',
    terms: 'Due on Receipt',
    createdAt: '2026-09-01'
  },
  {
    id: 'inv2',
    invoiceNumber: 'INV-2026-002',
    customerId: 'c2',
    customerName: 'Horizon Tech Solutions',
    customerEmail: 'dmiller@horizontech.io',
    issueDate: '2026-08-15',
    dueDate: '2026-09-15',
    items: [
      { id: 'li3', itemId: 'i3', itemName: 'AD CARE Smart Edge IoT Gateway Device', description: 'Warehouse Hardware Gateway Nodes', quantity: 4, unitPrice: 1250.00, taxRate: 10, amount: 5000.00 }
    ],
    subtotal: 5000.00,
    taxTotal: 500.00,
    discountTotal: 0,
    shippingTotal: 150.00,
    totalAmount: 5650.00,
    amountPaid: 0.00,
    balanceDue: 5650.00,
    status: 'sent',
    notes: 'Shipped via Northwind Freight tracking #NW-99812.',
    terms: 'Net 30 Days.',
    createdAt: '2026-08-15'
  },
  {
    id: 'inv3',
    invoiceNumber: 'INV-2026-003',
    customerId: 'c3',
    customerName: 'Vanguard Dynamics',
    customerEmail: 'elena@vanguarddyn.com',
    issueDate: '2026-07-10',
    dueDate: '2026-08-10',
    items: [
      { id: 'li4', itemId: 'i1', itemName: 'AD CARE Enterprise Cloud Platform License', description: 'Q3 License Renewal', quantity: 15, unitPrice: 450.00, taxRate: 10, amount: 6750.00 }
    ],
    subtotal: 6750.00,
    taxTotal: 675.00,
    discountTotal: 0,
    shippingTotal: 0,
    totalAmount: 7425.00,
    amountPaid: 7425.00,
    balanceDue: 0.00,
    status: 'paid',
    notes: 'Paid in full via SVB Wire.',
    terms: 'Net 30 Days.',
    createdAt: '2026-07-10'
  }
];

export const INITIAL_BILLS: Bill[] = [
  {
    id: 'b1',
    billNumber: 'BILL-2026-101',
    vendorId: 'v1',
    vendorName: 'CloudScale Infrastructure Host',
    issueDate: '2026-08-01',
    dueDate: '2026-09-01',
    items: [
      { id: 'bli1', itemId: 'v1-item', itemName: 'Dedicated Bare-Metal Kubernetes Cluster', description: 'August Hosting Infrastructure', quantity: 1, unitPrice: 8400.00, taxRate: 0, amount: 8400.00 }
    ],
    subtotal: 8400.00,
    taxTotal: 0,
    discountTotal: 0,
    shippingTotal: 0,
    totalAmount: 8400.00,
    amountPaid: 0,
    balanceDue: 8400.00,
    status: 'received',
    notes: 'Monthly infrastructure cluster bill.',
    createdAt: '2026-08-01'
  },
  {
    id: 'b2',
    billNumber: 'BILL-2026-102',
    vendorId: 'v2',
    vendorName: 'Northwind Logistics & Warehousing',
    issueDate: '2026-08-12',
    dueDate: '2026-09-12',
    items: [
      { id: 'bli2', itemId: 'v2-item', itemName: 'Freight & Express Parcel Dispatch', description: 'Q3 Warehouse Storage & Freight Services', quantity: 1, unitPrice: 2150.00, taxRate: 0, amount: 2150.00 }
    ],
    subtotal: 2150.00,
    taxTotal: 0,
    discountTotal: 0,
    shippingTotal: 0,
    totalAmount: 2150.00,
    amountPaid: 0,
    balanceDue: 2150.00,
    status: 'received',
    notes: 'Logistics handling.',
    createdAt: '2026-08-12'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'e1',
    expenseNumber: 'EXP-2026-001',
    category: 'Software & Subscriptions',
    amount: 1290.00,
    taxAmount: 0,
    date: '2026-08-05',
    vendorName: 'GitHub & Cloud Services',
    paymentMode: 'Credit Card',
    account: '6100 - Software & Subscriptions',
    description: 'CI/CD pipeline and GitHub Enterprise license for development team.'
  },
  {
    id: 'e2',
    expenseNumber: 'EXP-2026-002',
    category: 'Rent & Lease',
    amount: 4500.00,
    taxAmount: 0,
    date: '2026-08-01',
    vendorName: 'San Francisco Financial Center Leasing',
    paymentMode: 'Bank Transfer',
    account: '6200 - Rent Expense',
    description: 'Monthly headquarter office suite rent.'
  },
  {
    id: 'e3',
    expenseNumber: 'EXP-2026-003',
    category: 'Marketing & Sales',
    amount: 3200.00,
    taxAmount: 0,
    date: '2026-08-18',
    vendorName: 'Google Ads & LinkedIn Campaigns',
    paymentMode: 'Credit Card',
    account: '6300 - Marketing & Advertising',
    description: 'Q3 Enterprise SaaS lead acquisition campaign.'
  }
];

export const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'ba1',
    accountName: 'Silicon Valley Bank - Primary Operating',
    accountNumber: '•••• •••• 4910',
    bankName: 'Silicon Valley Bank',
    accountType: 'checking',
    currency: 'USD',
    balance: 142850.40,
    lastReconciledDate: '2026-08-25',
    status: 'connected'
  },
  {
    id: 'ba2',
    accountName: 'JPMorgan Chase - Payroll Reserve',
    accountNumber: '•••• •••• 8821',
    bankName: 'JPMorgan Chase',
    accountType: 'savings',
    currency: 'USD',
    balance: 85000.00,
    lastReconciledDate: '2026-08-20',
    status: 'connected'
  },
  {
    id: 'ba3',
    accountName: 'Stripe Merchant Account',
    accountNumber: '•••• •••• STRPE',
    bankName: 'Stripe Payments',
    accountType: 'credit_card',
    currency: 'USD',
    balance: 12400.00,
    lastReconciledDate: '2026-08-30',
    status: 'connected'
  }
];

export const INITIAL_BANK_TRANSACTIONS: BankTransaction[] = [
  {
    id: 'bt1',
    bankAccountId: 'ba1',
    date: '2026-08-10',
    description: 'Wire Transfer Inward - Vanguard Dynamics (INV-2026-003)',
    amount: 7425.00,
    category: 'Customer Payment',
    reference: 'WIRE-VD-9921',
    isMatched: true,
    matchedId: 'inv3',
    matchedType: 'invoice'
  },
  {
    id: 'bt2',
    bankAccountId: 'ba1',
    date: '2026-08-05',
    description: 'Card Charge - GitHub Enterprise Subscriptions',
    amount: -1290.00,
    category: 'Software & Subscriptions',
    reference: 'GH-OCTO-8821',
    isMatched: true,
    matchedId: 'e1',
    matchedType: 'expense'
  },
  {
    id: 'bt3',
    bankAccountId: 'ba1',
    date: '2026-08-28',
    description: 'ACH Deposit - Stripe Settlement Clearing',
    amount: 14500.00,
    category: 'Sales Income',
    reference: 'STRPE-CLR-0828',
    isMatched: false
  },
  {
    id: 'bt4',
    bankAccountId: 'ba1',
    date: '2026-08-29',
    description: 'Withdrawal - CloudScale Infrastructure Payout',
    amount: -4200.00,
    category: 'Hosting & Infrastructure',
    reference: 'CLOUD-PYMT-0829',
    isMatched: false
  }
];

export const INITIAL_ACCOUNTS: Account[] = [
  // Assets
  { id: 'acc-1010', code: '1010', name: 'SVB Operating Account', category: 'asset', type: 'Bank', balance: 142850.40, description: 'Primary corporate checking bank account.', isSystem: true },
  { id: 'acc-1020', code: '1020', name: 'Chase Payroll Reserve', category: 'asset', type: 'Bank', balance: 85000.00, description: 'Payroll and emergency cash reserve.', isSystem: true },
  { id: 'acc-1200', code: '1200', name: 'Accounts Receivable (A/R)', category: 'asset', type: 'Accounts Receivable', balance: 24650.00, description: 'Uncollected customer invoices balance.', isSystem: true },
  { id: 'acc-1400', code: '1400', name: 'Finished Goods Inventory', category: 'asset', type: 'Inventory', balance: 91360.00, description: 'Valuation of hardware inventory on hand.', isSystem: true },
  { id: 'acc-1500', code: '1500', name: 'Computer Equipment & Hardware', category: 'asset', type: 'Fixed Asset', balance: 35000.00, description: 'Servers and computer equipment.', isSystem: true },

  // Liabilities
  { id: 'acc-2000', code: '2000', name: 'Accounts Payable (A/P)', category: 'liability', type: 'Accounts Payable', balance: 10550.00, description: 'Unpaid vendor bills balance.', isSystem: true },
  { id: 'acc-2200', code: '2200', name: 'Sales Tax Payable', category: 'liability', type: 'Other Current Liability', balance: 2425.00, description: 'Collected sales tax owed to state tax authority.', isSystem: true },
  { id: 'acc-2300', code: '2300', name: 'Corporate Credit Card Payable', category: 'liability', type: 'Credit Card', balance: 4490.00, description: 'Outstanding company credit card charges.', isSystem: true },

  // Equity
  { id: 'acc-3000', code: '3000', name: 'Owner / Investor Equity', category: 'equity', type: 'Equity', balance: 250000.00, description: 'Initial paid-in capital.', isSystem: true },
  { id: 'acc-3200', code: '3200', name: 'Retained Earnings', category: 'equity', type: 'Equity', balance: 98395.40, description: 'Accumulated net profit carried forward.', isSystem: true },

  // Income
  { id: 'acc-4000', code: '4000', name: 'SaaS Platform Subscription Income', category: 'income', type: 'Income', balance: 15750.00, description: 'Recurring software revenue.', isSystem: true },
  { id: 'acc-4100', code: '4100', name: 'Hardware & IoT Sales Income', category: 'income', type: 'Income', balance: 5000.00, description: 'Hardware sale revenue.', isSystem: true },
  { id: 'acc-4200', code: '4200', name: 'Professional Services & Consulting', category: 'income', type: 'Income', balance: 3500.00, description: 'Implementation and custom services revenue.', isSystem: true },

  // Expenses
  { id: 'acc-6100', code: '6100', name: 'Software & Cloud Subscriptions', category: 'expense', type: 'Expense', balance: 1290.00, description: 'Tools and developer infrastructure software.', isSystem: true },
  { id: 'acc-6200', code: '6200', name: 'Rent & Facility Expense', category: 'expense', type: 'Expense', balance: 4500.00, description: 'Office lease and building operations.', isSystem: true },
  { id: 'acc-6300', code: '6300', name: 'Marketing & Digital Campaigns', category: 'expense', type: 'Expense', balance: 3200.00, description: 'Sales lead generation and brand ads.', isSystem: true },
  { id: 'acc-6400', code: '6400', name: 'Hosting & Server Infrastructure', category: 'expense', type: 'Expense', balance: 8400.00, description: 'Data center hosting and bandwidth.', isSystem: true }
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'je1',
    entryNumber: 'JE-2026-001',
    date: '2026-08-01',
    reference: 'EQUIP-DEP-Q3',
    narration: 'Monthly depreciation posting for computer hardware & server equipment.',
    lines: [
      { id: 'jel1', accountId: 'acc-6100', accountCode: '6100', accountName: 'Software & Cloud Subscriptions', debit: 750.00, credit: 0, memo: 'Hardware depreciation allocation' },
      { id: 'jel2', accountId: 'acc-1500', accountCode: '1500', accountName: 'Computer Equipment & Hardware', debit: 0, credit: 750.00, memo: 'Accumulated equipment write-down' }
    ],
    totalDebit: 750.00,
    totalCredit: 750.00,
    status: 'posted',
    createdAt: '2026-08-01'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Apex ERP Migration & Custom API Integration',
    code: 'PRJ-APX-01',
    customerId: 'c1',
    customerName: 'Apex Global Systems',
    budget: 25000.00,
    spent: 14200.00,
    billingType: 'hourly',
    hourlyRate: 175.00,
    status: 'active',
    startDate: '2026-07-01',
    dueDate: '2026-10-31'
  },
  {
    id: 'p2',
    name: 'Horizon Smart Warehouse Telematics Deployment',
    code: 'PRJ-HRZ-02',
    customerId: 'c2',
    customerName: 'Horizon Tech Solutions',
    budget: 15000.00,
    spent: 6500.00,
    billingType: 'fixed',
    hourlyRate: 150.00,
    status: 'active',
    startDate: '2026-08-01',
    dueDate: '2026-09-30'
  }
];

export const INITIAL_TIMESHEETS: TimesheetEntry[] = [
  {
    id: 'ts1',
    projectId: 'p1',
    projectName: 'Apex ERP Migration & Custom API Integration',
    userId: 'u1',
    userName: 'Alex Morgan (Senior Architect)',
    date: '2026-08-28',
    hours: 6.5,
    description: 'Configured automated chart-of-accounts mapping script.',
    isBillable: true,
    isBilled: false
  },
  {
    id: 'ts2',
    projectId: 'p2',
    projectName: 'Horizon Smart Warehouse Telematics Deployment',
    userId: 'u2',
    userName: 'Jordan Lee (Lead Engineer)',
    date: '2026-08-29',
    hours: 4.0,
    description: 'Tested IoT hardware gateway sensor sync.',
    isBillable: true,
    isBilled: true
  }
];

export const INITIAL_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'ar1',
    title: 'Automated Overdue Invoice Reminders',
    trigger: 'invoice_overdue',
    action: 'send_email_reminder',
    status: 'active',
    lastRun: '2026-09-01 08:00 AM',
    description: 'Sends automated polite payment reminder email when invoice passes due date by 3 days.'
  },
  {
    id: 'ar2',
    title: 'Low Stock Auto Reorder Notice',
    trigger: 'low_stock',
    action: 'notify_admin',
    status: 'active',
    lastRun: '2026-08-30 14:15 PM',
    description: 'Generates draft purchase order when item quantity falls below reorder point threshold.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'al1',
    timestamp: '2026-09-02 09:12:44',
    userName: 'Alex Morgan (Admin)',
    action: 'POST_JOURNAL_ENTRY',
    module: 'Accounting',
    details: 'Posted Journal Entry JE-2026-001 (Equipment Depreciation $750.00)',
    ipAddress: '192.168.1.104'
  },
  {
    id: 'al2',
    timestamp: '2026-09-01 16:45:10',
    userName: 'Alex Morgan (Admin)',
    action: 'CREATE_INVOICE',
    module: 'Sales Operations',
    details: 'Generated Invoice INV-2026-002 for Horizon Tech Solutions ($5,500.00)',
    ipAddress: '192.168.1.104'
  },
  {
    id: 'al3',
    timestamp: '2026-08-28 11:30:00',
    userName: 'System Automation',
    action: 'BANK_FEED_SYNC',
    module: 'Banking',
    details: 'Synced 4 transaction records from Silicon Valley Bank API',
    ipAddress: 'System Daemon'
  }
];
