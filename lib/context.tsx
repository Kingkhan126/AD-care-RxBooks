'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Contact, Item, Warehouse, Invoice, Bill, Expense, BankAccount, BankTransaction,
  Account, JournalEntry, Project, TimesheetEntry, AutomationRule, AuditLog,
  OrganizationSettings, InvoiceStatus, BillStatus
} from './types';
import {
  INITIAL_ORG_SETTINGS, INITIAL_CONTACTS, INITIAL_ITEMS, INITIAL_WAREHOUSES,
  INITIAL_INVOICES, INITIAL_BILLS, INITIAL_EXPENSES, INITIAL_BANK_ACCOUNTS,
  INITIAL_BANK_TRANSACTIONS, INITIAL_ACCOUNTS, INITIAL_JOURNAL_ENTRIES,
  INITIAL_PROJECTS, INITIAL_TIMESHEETS, INITIAL_AUTOMATION_RULES, INITIAL_AUDIT_LOGS
} from './store';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  dataRef?: any;
}

interface ADCareContextType {
  orgSettings: OrganizationSettings;
  updateOrgSettings: (settings: Partial<OrganizationSettings>) => void;

  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;

  items: Item[];
  addItem: (item: Omit<Item, 'id'>) => void;
  updateItem: (id: string, item: Partial<Item>) => void;

  warehouses: Warehouse[];
  addWarehouse: (wh: Omit<Warehouse, 'id'>) => void;

  invoices: Invoice[];
  addInvoice: (inv: Omit<Invoice, 'id' | 'createdAt' | 'invoiceNumber' | 'status'>) => Invoice;
  updateInvoice: (id: string, updatedData: Partial<Invoice>, reason?: string) => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  deleteInvoice: (id: string) => void;
  recordInvoicePayment: (invoiceId: string, amount: number, mode: string) => void;

  bills: Bill[];
  addBill: (bill: Omit<Bill, 'id' | 'createdAt' | 'billNumber' | 'status'>) => Bill;
  updateBill: (id: string, updatedData: Partial<Bill>, reason?: string) => void;
  updateBillStatus: (id: string, status: BillStatus) => void;
  deleteBill: (id: string) => void;

  expenses: Expense[];
  addExpense: (exp: Omit<Expense, 'id' | 'expenseNumber'>) => void;

  bankAccounts: BankAccount[];
  bankTransactions: BankTransaction[];
  reconcileTransaction: (txId: string) => void;

  accounts: Account[];
  addAccount: (acc: Omit<Account, 'id'>) => void;

  journalEntries: JournalEntry[];
  addJournalEntry: (je: Omit<JournalEntry, 'id' | 'entryNumber' | 'createdAt'>) => { success: boolean; error?: string };

  projects: Project[];
  addProject: (prj: Omit<Project, 'id'>) => void;

  timesheets: TimesheetEntry[];
  addTimesheet: (ts: Omit<TimesheetEntry, 'id'>) => void;

  automationRules: AutomationRule[];
  toggleAutomationRule: (id: string) => void;

  auditLogs: AuditLog[];
  logAction: (action: string, module: string, details: string) => void;

  // Calculators & Financial Metrics
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalBankBalance: number;
  totalReceivables: number;
  totalPayables: number;
  overdueInvoicesCount: number;
  pendingBillsCount: number;

  getProfitAndLoss: () => {
    revenueAccounts: { code: string; name: string; balance: number }[];
    expenseAccounts: { code: string; name: string; balance: number }[];
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
  };

  getBalanceSheet: () => {
    assets: { code: string; name: string; balance: number }[];
    liabilities: { code: string; name: string; balance: number }[];
    equity: { code: string; name: string; balance: number }[];
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    isBalanced: boolean;
  };

  getTrialBalance: () => {
    rows: { code: string; name: string; category: string; debit: number; credit: number }[];
    totalDebit: number;
    totalCredit: number;
    isBalanced: boolean;
  };

  resetToDefaultData: () => void;

  // AI Assistant State
  isAIOpen: boolean;
  setIsAIOpen: (open: boolean) => void;
  aiMessages: AIMessage[];
  sendAIMessage: (text: string) => void;
}

const ADCareContext = createContext<ADCareContextType | undefined>(undefined);

export const ADCareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const [orgSettings, setOrgSettings] = useState<OrganizationSettings>(INITIAL_ORG_SETTINGS);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(INITIAL_WAREHOUSES);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [bills, setBills] = useState<Bill[]>(INITIAL_BILLS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(INITIAL_BANK_ACCOUNTS);
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>(INITIAL_BANK_TRANSACTIONS);
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(INITIAL_JOURNAL_ENTRIES);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>(INITIAL_TIMESHEETS);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(INITIAL_AUTOMATION_RULES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // AI Assistant
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: 'm-init',
      role: 'assistant',
      text: "Hello! I'm **AD Care RxBooks AI**, your intelligent financial co-pilot. I am synced directly with your ledger, invoices, bank feeds, and expenses. Ask me anything about your current net profit, cash flow, overdue balances, or natural language reporting!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Load from localStorage on mount (preserves updated user data)
  useEffect(() => {
    try {
      const savedInvoices = localStorage.getItem('adcare_v4_invoices');
      if (savedInvoices) setInvoices(JSON.parse(savedInvoices));

      const savedContacts = localStorage.getItem('adcare_v4_contacts');
      if (savedContacts) setContacts(JSON.parse(savedContacts));

      const savedItems = localStorage.getItem('adcare_v4_items');
      if (savedItems) setItems(JSON.parse(savedItems));

      const savedBills = localStorage.getItem('adcare_v4_bills');
      if (savedBills) setBills(JSON.parse(savedBills));

      const savedExpenses = localStorage.getItem('adcare_v4_expenses');
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));

      const savedOrgSettings = localStorage.getItem('adcare_v4_org_settings');
      if (savedOrgSettings) setOrgSettings(JSON.parse(savedOrgSettings));

      const savedWarehouses = localStorage.getItem('adcare_v4_warehouses');
      if (savedWarehouses) setWarehouses(JSON.parse(savedWarehouses));

      const savedBankAccounts = localStorage.getItem('adcare_v4_bank_accounts');
      if (savedBankAccounts) setBankAccounts(JSON.parse(savedBankAccounts));

      const savedBankTransactions = localStorage.getItem('adcare_v4_bank_transactions');
      if (savedBankTransactions) setBankTransactions(JSON.parse(savedBankTransactions));

      const savedAccounts = localStorage.getItem('adcare_v4_accounts');
      if (savedAccounts) setAccounts(JSON.parse(savedAccounts));

      const savedJournalEntries = localStorage.getItem('adcare_v4_journal_entries');
      if (savedJournalEntries) setJournalEntries(JSON.parse(savedJournalEntries));

      const savedProjects = localStorage.getItem('adcare_v4_projects');
      if (savedProjects) setProjects(JSON.parse(savedProjects));

      const savedTimesheets = localStorage.getItem('adcare_v4_timesheets');
      if (savedTimesheets) setTimesheets(JSON.parse(savedTimesheets));

      const savedAutomationRules = localStorage.getItem('adcare_v4_automation_rules');
      if (savedAutomationRules) setAutomationRules(JSON.parse(savedAutomationRules));

      const savedAuditLogs = localStorage.getItem('adcare_v4_audit_logs');
      if (savedAuditLogs) setAuditLogs(JSON.parse(savedAuditLogs));
    } catch (e) {
      console.warn('LocalStorage restoration error:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage ONLY after initial load completes (prevents overwriting saved data on mount)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('adcare_v4_invoices', JSON.stringify(invoices));
      localStorage.setItem('adcare_v4_contacts', JSON.stringify(contacts));
      localStorage.setItem('adcare_v4_items', JSON.stringify(items));
      localStorage.setItem('adcare_v4_bills', JSON.stringify(bills));
      localStorage.setItem('adcare_v4_expenses', JSON.stringify(expenses));
      localStorage.setItem('adcare_v4_org_settings', JSON.stringify(orgSettings));
      localStorage.setItem('adcare_v4_warehouses', JSON.stringify(warehouses));
      localStorage.setItem('adcare_v4_bank_accounts', JSON.stringify(bankAccounts));
      localStorage.setItem('adcare_v4_bank_transactions', JSON.stringify(bankTransactions));
      localStorage.setItem('adcare_v4_accounts', JSON.stringify(accounts));
      localStorage.setItem('adcare_v4_journal_entries', JSON.stringify(journalEntries));
      localStorage.setItem('adcare_v4_projects', JSON.stringify(projects));
      localStorage.setItem('adcare_v4_timesheets', JSON.stringify(timesheets));
      localStorage.setItem('adcare_v4_automation_rules', JSON.stringify(automationRules));
      localStorage.setItem('adcare_v4_audit_logs', JSON.stringify(auditLogs));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [
    isLoaded, invoices, contacts, items, bills, expenses, orgSettings,
    warehouses, bankAccounts, bankTransactions, accounts, journalEntries,
    projects, timesheets, automationRules, auditLogs
  ]);

  const resetToDefaultData = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('LocalStorage clear error:', e);
    }
    setOrgSettings(INITIAL_ORG_SETTINGS);
    setContacts(INITIAL_CONTACTS);
    setItems(INITIAL_ITEMS);
    setWarehouses(INITIAL_WAREHOUSES);
    setInvoices(INITIAL_INVOICES);
    setBills(INITIAL_BILLS);
    setExpenses(INITIAL_EXPENSES);
    setBankAccounts(INITIAL_BANK_ACCOUNTS);
    setBankTransactions(INITIAL_BANK_TRANSACTIONS);
    setAccounts(INITIAL_ACCOUNTS);
    setJournalEntries(INITIAL_JOURNAL_ENTRIES);
    setProjects(INITIAL_PROJECTS);
    setTimesheets(INITIAL_TIMESHEETS);
    setAutomationRules(INITIAL_AUTOMATION_RULES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
  };

  const updateOrgSettings = (settings: Partial<OrganizationSettings>) => {
    setOrgSettings(prev => ({ ...prev, ...settings }));
    logAction('UPDATE_ORG_SETTINGS', 'Settings', 'Updated company profile details');
  };

  const addContact = (contact: Omit<Contact, 'id' | 'createdAt'>) => {
    const newContact: Contact = {
      ...contact,
      id: `c_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setContacts(prev => [newContact, ...prev]);
    logAction('ADD_CONTACT', 'Contacts', `Added new ${contact.type}: ${contact.companyName}`);
  };

  const updateContact = (id: string, contactData: Partial<Contact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...contactData } : c));
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const addItem = (item: Omit<Item, 'id'>) => {
    const newItem: Item = { ...item, id: `i_${Date.now()}` };
    setItems(prev => [newItem, ...prev]);
    logAction('ADD_ITEM', 'Inventory', `Added new item: ${item.name} (${item.sku})`);
  };

  const updateItem = (id: string, itemData: Partial<Item>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...itemData } : i));
  };

  const addWarehouse = (wh: Omit<Warehouse, 'id'>) => {
    const newWh: Warehouse = { ...wh, id: `w_${Date.now()}` };
    setWarehouses(prev => [...prev, newWh]);
  };

  const addInvoice = (invData: Omit<Invoice, 'id' | 'createdAt' | 'invoiceNumber' | 'status'>) => {
    const nextNum = invoices.length + 1;
    const invNum = `INV-2026-${String(nextNum).padStart(3, '0')}`;
    const newInv: Invoice = {
      ...invData,
      id: `inv_${Date.now()}`,
      invoiceNumber: invNum,
      status: 'sent',
      amountPaid: 0,
      balanceDue: invData.totalAmount,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setInvoices(prev => [newInv, ...prev]);

    // Update customer receivables
    setContacts(prev => prev.map(c => c.id === invData.customerId ? { ...c, receivables: c.receivables + invData.totalAmount } : c));

    // Update inventory stock on hand (decrease for sold items)
    setItems(prevItems => prevItems.map(item => {
      const line = invData.items.find(it => it.itemId === item.id);
      if (line && item.type === 'product') {
        return { ...item, stockOnHand: Math.max(0, item.stockOnHand - line.quantity) };
      }
      return item;
    }));

    logAction('CREATE_INVOICE', 'Sales', `Created Invoice ${invNum} for ${invData.customerName} (PKR ${invData.totalAmount.toLocaleString()})`);
    return newInv;
  };

  const updateInvoice = (id: string, updatedData: Partial<Invoice>, reason?: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        const merged = { ...inv, ...updatedData };
        const balanceDue = Math.max(0, merged.totalAmount - merged.amountPaid);
        let status: InvoiceStatus = merged.status;
        if (balanceDue === 0) status = 'paid';
        else if (merged.amountPaid > 0) status = 'partially_paid';

        const auditDetail = reason
          ? `Updated Invoice #${merged.invoiceNumber}. Reason: "${reason}"`
          : `Updated Invoice #${merged.invoiceNumber} details`;
        logAction('UPDATE_INVOICE', 'Sales', auditDetail);
        return { ...merged, balanceDue, status };
      }
      return inv;
    }));
  };

  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv));
  };

  const deleteInvoice = (id: string) => {
    const inv = invoices.find(i => i.id === id);
    if (inv) {
      setInvoices(prev => prev.filter(i => i.id !== id));
      logAction('DELETE_INVOICE', 'Sales', `Deleted Invoice #${inv.invoiceNumber} (${inv.customerName})`);
    }
  };

  const recordInvoicePayment = (invoiceId: string, amount: number, mode: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const newPaid = inv.amountPaid + amount;
        const newBalance = Math.max(0, inv.totalAmount - newPaid);
        const newStatus: InvoiceStatus = newBalance === 0 ? 'paid' : 'partially_paid';

        // Update customer balance
        setContacts(cList => cList.map(c => c.id === inv.customerId ? { ...c, receivables: Math.max(0, c.receivables - amount) } : c));

        logAction('RECORD_PAYMENT', 'Sales', `Recorded payment of PKR ${amount.toLocaleString()} for Invoice ${inv.invoiceNumber}`);
        return {
          ...inv,
          amountPaid: newPaid,
          balanceDue: newBalance,
          status: newStatus
        };
      }
      return inv;
    }));
  };

  const addBill = (billData: Omit<Bill, 'id' | 'createdAt' | 'billNumber' | 'status'>) => {
    const nextNum = bills.length + 101;
    const billNum = `BILL-2026-${String(nextNum).padStart(3, '0')}`;
    const newBill: Bill = {
      ...billData,
      id: `b_${Date.now()}`,
      billNumber: billNum,
      status: 'received',
      amountPaid: 0,
      balanceDue: billData.totalAmount,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBills(prev => [newBill, ...prev]);

    // Update vendor payables
    setContacts(prev => prev.map(c => c.id === billData.vendorId ? { ...c, payables: c.payables + billData.totalAmount } : c));

    // Update inventory stock on hand (increase for purchased items)
    setItems(prevItems => prevItems.map(item => {
      const line = billData.items.find(it => it.itemId === item.id);
      if (line && item.type === 'product') {
        return { ...item, stockOnHand: item.stockOnHand + line.quantity };
      }
      return item;
    }));

    logAction('CREATE_BILL', 'Purchases', `Created Bill ${billNum} for ${billData.vendorName} (PKR ${billData.totalAmount.toLocaleString()})`);
    return newBill;
  };

  const updateBill = (id: string, updatedData: Partial<Bill>, reason?: string) => {
    setBills(prev => prev.map(b => {
      if (b.id === id) {
        const merged = { ...b, ...updatedData };
        const balanceDue = Math.max(0, merged.totalAmount - merged.amountPaid);
        const auditDetail = reason
          ? `Updated Bill #${merged.billNumber}. Reason: "${reason}"`
          : `Updated Bill #${merged.billNumber}`;
        logAction('UPDATE_BILL', 'Purchases', auditDetail);
        return { ...merged, balanceDue };
      }
      return b;
    }));
  };

  const updateBillStatus = (id: string, status: BillStatus) => {
    setBills(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const deleteBill = (id: string) => {
    const b = bills.find(item => item.id === id);
    if (b) {
      setBills(prev => prev.filter(item => item.id !== id));
      logAction('DELETE_BILL', 'Purchases', `Deleted Bill #${b.billNumber} (${b.vendorName})`);
    }
  };

  const addExpense = (expData: Omit<Expense, 'id' | 'expenseNumber'>) => {
    const nextNum = expenses.length + 1;
    const expNum = `EXP-2026-${String(nextNum).padStart(3, '0')}`;
    const newExpense: Expense = {
      ...expData,
      id: `e_${Date.now()}`,
      expenseNumber: expNum
    };
    setExpenses(prev => [newExpense, ...prev]);

    // Update Bank Account balance
    setBankAccounts(prev => prev.map(ba => ba.id === 'ba1' ? { ...ba, balance: ba.balance - expData.amount } : ba));

    logAction('LOG_EXPENSE', 'Expenses', `Logged expense ${expNum}: ${expData.description} ($${expData.amount.toLocaleString()})`);
  };

  const reconcileTransaction = (txId: string) => {
    setBankTransactions(prev => prev.map(tx => tx.id === txId ? { ...tx, isMatched: true } : tx));
    logAction('BANK_RECONCILE', 'Banking', `Matched bank transaction #${txId}`);
  };

  const addAccount = (accData: Omit<Account, 'id'>) => {
    const newAccount: Account = { ...accData, id: `acc_${Date.now()}` };
    setAccounts(prev => [...prev, newAccount]);
    logAction('CREATE_ACCOUNT', 'Accounting', `Created chart account ${accData.code} - ${accData.name}`);
  };

  const addJournalEntry = (jeData: Omit<JournalEntry, 'id' | 'entryNumber' | 'createdAt'>) => {
    if (Math.abs(jeData.totalDebit - jeData.totalCredit) > 0.01) {
      return { success: false, error: 'Total Debits must exactly equal Total Credits.' };
    }
    const nextNum = journalEntries.length + 1;
    const jeNum = `JE-2026-${String(nextNum).padStart(3, '0')}`;
    const newEntry: JournalEntry = {
      ...jeData,
      id: `je_${Date.now()}`,
      entryNumber: jeNum,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setJournalEntries(prev => [newEntry, ...prev]);

    logAction('POST_JOURNAL', 'Accounting', `Posted Journal Entry ${jeNum} ($${jeData.totalDebit.toLocaleString()})`);
    return { success: true };
  };

  const addProject = (prj: Omit<Project, 'id'>) => {
    const newPrj: Project = { ...prj, id: `p_${Date.now()}` };
    setProjects(prev => [...prev, newPrj]);
    logAction('CREATE_PROJECT', 'Projects', `Created project: ${prj.name}`);
  };

  const addTimesheet = (ts: Omit<TimesheetEntry, 'id'>) => {
    const newTs: TimesheetEntry = { ...ts, id: `ts_${Date.now()}` };
    setTimesheets(prev => [newTs, ...prev]);
  };

  const toggleAutomationRule = (id: string) => {
    setAutomationRules(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'active' ? 'paused' : 'active' } : r));
  };

  const logAction = (action: string, module: string, details: string) => {
    const newLog: AuditLog = {
      id: `al_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userName: 'Alex Morgan (Admin)',
      action,
      module,
      details,
      ipAddress: '192.168.1.104'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Calculations
  const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.status !== 'void' ? inv.totalAmount : 0), 0);
  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0) + bills.reduce((acc, b) => acc + b.totalAmount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const totalBankBalance = bankAccounts.reduce((acc, ba) => acc + ba.balance, 0);
  const totalReceivables = contacts.reduce((acc, c) => acc + c.receivables, 0);
  const totalPayables = contacts.reduce((acc, c) => acc + c.payables, 0);
  const overdueInvoicesCount = invoices.filter(i => i.status === 'overdue').length;
  const pendingBillsCount = bills.filter(b => b.status === 'received' || b.status === 'partially_paid').length;

  const getProfitAndLoss = () => {
    const revenueAccounts = accounts.filter(a => a.category === 'income').map(a => ({ code: a.code, name: a.name, balance: a.balance }));
    const expenseAccounts = accounts.filter(a => a.category === 'expense').map(a => ({ code: a.code, name: a.name, balance: a.balance }));
    const totalRev = revenueAccounts.reduce((acc, r) => acc + r.balance, 0);
    const totalExp = expenseAccounts.reduce((acc, e) => acc + e.balance, 0);
    return {
      revenueAccounts,
      expenseAccounts,
      totalRevenue: totalRev,
      totalExpenses: totalExp,
      netIncome: totalRev - totalExp
    };
  };

  const getBalanceSheet = () => {
    const assets = accounts.filter(a => a.category === 'asset').map(a => ({ code: a.code, name: a.name, balance: a.balance }));
    const liabilities = accounts.filter(a => a.category === 'liability').map(a => ({ code: a.code, name: a.name, balance: a.balance }));
    const equity = accounts.filter(a => a.category === 'equity').map(a => ({ code: a.code, name: a.name, balance: a.balance }));

    const totalAssets = assets.reduce((acc, a) => acc + a.balance, 0);
    const totalLiabilities = liabilities.reduce((acc, l) => acc + l.balance, 0);
    const totalEquity = equity.reduce((acc, e) => acc + e.balance, 0);
    const isBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01;

    return { assets, liabilities, equity, totalAssets, totalLiabilities, totalEquity, isBalanced };
  };

  const getTrialBalance = () => {
    const rows = accounts.map(a => {
      let debit = 0;
      let credit = 0;
      if (a.category === 'asset' || a.category === 'expense') {
        debit = a.balance;
      } else {
        credit = a.balance;
      }
      return { code: a.code, name: a.name, category: a.category, debit, credit };
    });

    const totalDebit = rows.reduce((acc, r) => acc + r.debit, 0);
    const totalCredit = rows.reduce((acc, r) => acc + r.credit, 0);
    return { rows, totalDebit, totalCredit, isBalanced: Math.abs(totalDebit - totalCredit) < 0.01 };
  };

  // AI Message Handler
  const sendAIMessage = (userText: string) => {
    const userMsg: AIMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setAiMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let replyText = '';
      const lower = userText.toLowerCase();

      if (lower.includes('profit') || lower.includes('income') || lower.includes('revenue')) {
        replyText = `Based on current financial records in **AD Care RxBooks**:\n\n` +
          `- **Total Revenue**: $${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n` +
          `- **Total Operating Expenses & Bills**: $${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n` +
          `- **Net Operating Income**: **$${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}**\n\n` +
          `Your highest revenue generating item is the *AD Care RxBooks Enterprise Cloud Platform License*.`;
      } else if (lower.includes('overdue') || lower.includes('unpaid') || lower.includes('invoice')) {
        const overdueInvs = invoices.filter(i => i.status === 'overdue');
        if (overdueInvs.length > 0) {
          replyText = `You currently have **${overdueInvs.length} overdue invoice(s)** requiring action:\n\n` +
            overdueInvs.map(i => `• **${i.invoiceNumber}** — ${i.customerName} (Due: ${i.dueDate}) — Balance: **$${i.balanceDue.toLocaleString()}**`).join('\n') +
            `\n\nI recommend sending an automated payment reminder using AD Care RxBooks Automation.`;
        } else {
          replyText = `Great news! You currently have no overdue invoices in AD Care RxBooks.`;
        }
      } else if (lower.includes('bank') || lower.includes('cash') || lower.includes('balance')) {
        replyText = `Here is your current liquidity breakdown across all connected **AD Care RxBooks** banking accounts:\n\n` +
          bankAccounts.map(b => `• **${b.accountName}**: **$${b.balance.toLocaleString()}** (${b.status})`).join('\n') +
          `\n\n**Total Cash Liquidity**: **$${totalBankBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}**`;
      } else if (lower.includes('expense') || lower.includes('spending')) {
        replyText = `Summary of recent logged expenses in **AD Care RxBooks**:\n\n` +
          expenses.map(e => `• **${e.expenseNumber}** (${e.category}): $${e.amount.toLocaleString()} — *${e.description}*`).join('\n') +
          `\n\nTotal Direct Logged Expenses: **$${expenses.reduce((a, b) => a + b.amount, 0).toLocaleString()}**`;
      } else {
        replyText = `I have analyzed your **AD Care RxBooks** financial database. Current Snapshot:\n\n` +
          `• **Net Profit**: $${netProfit.toLocaleString()}\n` +
          `• **Accounts Receivable**: $${totalReceivables.toLocaleString()}\n` +
          `• **Accounts Payable**: $${totalPayables.toLocaleString()}\n` +
          `• **Bank Liquidity**: $${totalBankBalance.toLocaleString()}\n\n` +
          `How can I assist you further? You can ask me to draft invoices, check tax rules, or analyze expense trends.`;
      }

      const botMsg: AIMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAiMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  return (
    <ADCareContext.Provider value={{
      orgSettings, updateOrgSettings,
      contacts, addContact, updateContact, deleteContact,
      items, addItem, updateItem,
      warehouses, addWarehouse,
      invoices, addInvoice, updateInvoice, updateInvoiceStatus, deleteInvoice, recordInvoicePayment,
      bills, addBill, updateBill, updateBillStatus, deleteBill,
      expenses, addExpense,
      bankAccounts, bankTransactions, reconcileTransaction,
      accounts, addAccount,
      journalEntries, addJournalEntry,
      projects, addProject,
      timesheets, addTimesheet,
      automationRules, toggleAutomationRule,
      auditLogs, logAction,

      totalRevenue, totalExpenses, netProfit, totalBankBalance,
      totalReceivables, totalPayables, overdueInvoicesCount, pendingBillsCount,

      getProfitAndLoss, getBalanceSheet, getTrialBalance, resetToDefaultData,

      isAIOpen, setIsAIOpen, aiMessages, sendAIMessage
    }}>
      {children}
    </ADCareContext.Provider>
  );
};

export const useADCare = () => {
  const context = useContext(ADCareContext);
  if (!context) throw new Error('useADCare must be used within an ADCareProvider');
  return context;
};
