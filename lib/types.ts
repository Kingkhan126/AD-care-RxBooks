export type EntityType = 'customer' | 'vendor';

export interface Contact {
  id: string;
  name: string;
  companyName: string;
  type: EntityType;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  receivables: number; // For customers
  payables: number;    // For vendors
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Item {
  id: string;
  name: string;
  sku: string;
  type: 'product' | 'service';
  unit: string;
  salesPrice: number;
  costPrice: number;
  taxRate: number;
  stockOnHand: number;
  reorderPoint: number;
  description: string;
  status: 'active' | 'inactive';
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  location: string;
  isPrimary: boolean;
  totalStock: number;
}

export interface StockAdjustment {
  id: string;
  itemId: string;
  itemName: string;
  warehouseId: string;
  warehouseName: string;
  type: 'increase' | 'decrease';
  quantity: number;
  reason: 'damage' | 'revaluation' | 'count_adjustment' | 'transfer';
  date: string;
  notes: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'void';

export interface LineItem {
  id: string;
  itemId: string;
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  issueDate: string;
  dueDate: string;
  items: LineItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  shippingTotal: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  status: InvoiceStatus;
  notes: string;
  terms: string;
  createdAt: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  issueDate: string;
  expiryDate: string;
  items: LineItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  shippingTotal: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'converted';
  notes: string;
}

export interface CustomerPayment {
  id: string;
  paymentNumber: string;
  customerId: string;
  customerName: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  paymentDate: string;
  paymentMode: 'bank_transfer' | 'credit_card' | 'check' | 'cash';
  reference: string;
  notes: string;
}

export interface CreditNote {
  id: string;
  creditNoteNumber: string;
  customerId: string;
  customerName: string;
  invoiceId?: string;
  amount: number;
  date: string;
  reason: string;
  status: 'open' | 'applied' | 'refunded';
}

export type BillStatus = 'draft' | 'received' | 'partially_paid' | 'paid' | 'overdue';

export interface Bill {
  id: string;
  billNumber: string;
  vendorId: string;
  vendorName: string;
  issueDate: string;
  dueDate: string;
  items: LineItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  shippingTotal: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  status: BillStatus;
  notes: string;
  terms?: string;
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  issueDate: string;
  expectedDate: string;
  items: LineItem[];
  totalAmount: number;
  status: 'draft' | 'issued' | 'received' | 'billed' | 'cancelled';
}

export interface Expense {
  id: string;
  expenseNumber: string;
  category: string;
  amount: number;
  taxAmount: number;
  date: string;
  vendorId?: string;
  vendorName?: string;
  paymentMode: string;
  account: string;
  description: string;
  receiptUrl?: string;
}

export interface BankAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  accountType: 'checking' | 'savings' | 'credit_card';
  currency: string;
  balance: number;
  lastReconciledDate: string;
  status: 'connected' | 'disconnected';
}

export interface BankTransaction {
  id: string;
  bankAccountId: string;
  date: string;
  description: string;
  amount: number; // positive = credit (deposit), negative = debit (withdrawal)
  category: string;
  reference: string;
  isMatched: boolean;
  matchedId?: string;
  matchedType?: 'invoice' | 'bill' | 'expense' | 'journal';
}

export type AccountCategory = 'asset' | 'liability' | 'equity' | 'income' | 'expense';

export interface Account {
  id: string;
  code: string;
  name: string;
  category: AccountCategory;
  type: string;
  balance: number;
  description: string;
  isSystem: boolean;
}

export interface JournalLine {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  memo: string;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  reference: string;
  narration: string;
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  status: 'posted' | 'draft';
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  customerId: string;
  customerName: string;
  budget: number;
  spent: number;
  billingType: 'hourly' | 'fixed';
  hourlyRate: number;
  status: 'active' | 'completed' | 'on_hold';
  startDate: string;
  dueDate: string;
}

export interface TimesheetEntry {
  id: string;
  projectId: string;
  projectName: string;
  userId: string;
  userName: string;
  date: string;
  hours: number;
  description: string;
  isBillable: boolean;
  isBilled: boolean;
}

export interface AutomationRule {
  id: string;
  title: string;
  trigger: 'invoice_overdue' | 'low_stock' | 'recurring_bill' | 'bank_feed_import';
  action: 'send_email_reminder' | 'create_purchase_order' | 'post_journal_entry' | 'notify_admin';
  status: 'active' | 'paused';
  lastRun?: string;
  description: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
}

export interface OrganizationSettings {
  name: string;
  legalName: string;
  tagline: string;
  taxId: string;
  email: string;
  phone: string;
  website: string;
  currency: string;
  fiscalYearStart: string;
  address: string;
  city: string;
  country: string;
  logoUrl?: string;
}
