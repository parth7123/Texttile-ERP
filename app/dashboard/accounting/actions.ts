"use server";

import { prisma } from "@/lib/prisma";
import { getSessionOrgId } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getChartOfAccounts() {
  const organizationId = await getSessionOrgId();
  return prisma.chartOfAccount.findMany({ where: { organizationId }, orderBy: { code: "asc" } });
}

export async function createAccount(formData: FormData) {
  const organizationId = await getSessionOrgId();
  await prisma.chartOfAccount.create({
    data: {
      organizationId,
      code: String(formData.get("code")),
      name: String(formData.get("name")),
      accountType: String(formData.get("accountType")) as any,
      parentId: String(formData.get("parentId") || "") || null,
    },
  });
  revalidatePath("/dashboard/accounting");
}

export async function getJournalEntries() {
  const organizationId = await getSessionOrgId();
  return prisma.journalEntry.findMany({ where: { organizationId }, include: { lines: { include: { account: true } } }, orderBy: { entryDate: "desc" } });
}

export async function createJournalEntry(formData: FormData) {
  const organizationId = await getSessionOrgId();
  const entryNumber = String(formData.get("entryNumber"));
  const description = String(formData.get("description") ?? "");

  const accountIds = formData.getAll("accountId").map(String);
  const debits = formData.getAll("debit").map(Number);
  const credits = formData.getAll("credit").map(Number);

  const totalDebit = debits.reduce((a, b) => a + b, 0);
  const totalCredit = credits.reduce((a, b) => a + b, 0);
  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    throw new Error(`Journal entry does not balance: debit ${totalDebit} vs credit ${totalCredit}`);
  }

  await prisma.journalEntry.create({
    data: {
      organizationId,
      entryNumber,
      description,
      isPosted: true,
      lines: {
        create: accountIds.map((accountId, idx) => ({
          accountId,
          debit: debits[idx] || 0,
          credit: credits[idx] || 0,
        })),
      },
    },
  });

  revalidatePath("/dashboard/accounting/journal");
}

export async function getBankAccounts() {
  return prisma.bankAccount.findMany({ include: { account: true } });
}

export async function createBankAccount(formData: FormData) {
  await prisma.bankAccount.create({
    data: {
      accountId: String(formData.get("accountId")),
      bankName: String(formData.get("bankName")),
      accountNumber: String(formData.get("accountNumber")),
      branchName: String(formData.get("branchName") ?? "") || null,
    },
  });
  revalidatePath("/dashboard/accounting/banks");
}