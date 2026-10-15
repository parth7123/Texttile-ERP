"use server";

import { prisma } from "@/lib/prisma";
import { getSessionOrgId } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getEmployees(search?: string) {
  const organizationId = await getSessionOrgId();
  return prisma.employee.findMany({
    where: {
      organizationId,
      ...(search
        ? {
            OR: [
              { firstName: { contains: search } },
              { lastName: { contains: search } },
              { employeeCode: { contains: search } },
              { department: { contains: search } },
            ],
          }
        : {}),
    },
    include: {
      branch: true,
      role: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getEmployeeById(id: string) {
  const organizationId = await getSessionOrgId();
  return prisma.employee.findFirst({
    where: { id, organizationId },
    include: {
      branch: true,
      role: true,
      attendances: { orderBy: { date: "desc" }, take: 10 },
      leaves: { orderBy: { createdAt: "desc" }, take: 10 },
      payslips: { orderBy: { id: "desc" }, take: 10 },
    },
  });
}

export async function getEmployeeFormOptions() {
  const organizationId = await getSessionOrgId();
  const [branches, roles] = await Promise.all([
    prisma.branch.findMany({ where: { organizationId, isActive: true }, orderBy: { name: "asc" } }),
    prisma.role.findMany({
      where: { OR: [{ organizationId }, { organizationId: null }] },
      orderBy: { name: "asc" },
    }),
  ]);
  return { branches, roles };
}

export async function createEmployee(formData: FormData) {
  const organizationId = await getSessionOrgId();

  const employeeCode = formData.get("employeeCode") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const department = formData.get("department") as string;
  const designation = formData.get("designation") as string;
  const employmentType = formData.get("employmentType") as string;
  const wageType = formData.get("wageType") as string;
  const basicSalary = formData.get("basicSalary") as string;
  const pieceRate = formData.get("pieceRate") as string;
  const branchId = formData.get("branchId") as string;
  const roleId = formData.get("roleId") as string;

  await prisma.employee.create({
    data: {
      organizationId,
      employeeCode,
      firstName,
      lastName,
      email,
      phone: phone || null,
      department,
      designation,
      employmentType: employmentType as never,
      wageType: wageType as never,
      basicSalary: basicSalary ? parseFloat(basicSalary) : null,
      pieceRate: pieceRate ? parseFloat(pieceRate) : null,
      branchId: branchId || null,
      roleId: roleId || null,
    },
  });

  revalidatePath("/dashboard/hr");
  redirect("/dashboard/hr");
}

export async function updateEmployeeStatus(id: string, status: string) {
  const organizationId = await getSessionOrgId();
  const existing = await prisma.employee.findFirst({ where: { id, organizationId } });
  if (!existing) throw new Error("Employee not found");

  await prisma.employee.update({
    where: { id },
    data: {
      status: status as never,
      leftAt: status === "TERMINATED" ? new Date() : existing.leftAt,
    },
  });

  revalidatePath("/dashboard/hr");
}

export async function deleteEmployee(id: string) {
  const organizationId = await getSessionOrgId();
  const existing = await prisma.employee.findFirst({ where: { id, organizationId } });
  if (!existing) throw new Error("Employee not found");

  await prisma.employee.delete({ where: { id } });
  revalidatePath("/dashboard/hr");
}

export async function getShifts() {
  const organizationId = await getSessionOrgId();
  return prisma.shift.findMany({ where: { organizationId }, orderBy: { name: "asc" } });
}

export async function createShift(formData: FormData) {
  const organizationId = await getSessionOrgId();
  const name = String(formData.get("name"));
  const startTime = String(formData.get("startTime"));
  const endTime = String(formData.get("endTime"));

  await prisma.shift.create({
    data: { organizationId, name, startTime, endTime },
  });

  revalidatePath("/dashboard/hr/shifts");
}

export async function getAttendanceForDate(date: Date) {
  const organizationId = await getSessionOrgId();
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const [employees, records] = await Promise.all([
    prisma.employee.findMany({
      where: { organizationId, status: "ACTIVE" },
      orderBy: { firstName: "asc" },
    }),
    prisma.attendance.findMany({
      where: {
        date: startOfDay,
        employee: { organizationId },
      },
      include: { shift: true },
    }),
  ]);

  return { employees, records };
}

export async function markAttendance(formData: FormData) {
  const employeeId = String(formData.get("employeeId"));
  const dateStr = String(formData.get("date"));
  const status = String(formData.get("status")) as any;
  const shiftId = String(formData.get("shiftId") || "") || null;

  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);

  await prisma.attendance.upsert({
    where: {
      employeeId_date: { employeeId, date },
    },
    update: { status, shiftId },
    create: { employeeId, date, status, shiftId },
  });

  revalidatePath("/dashboard/hr/attendance");
}

export async function getLeaveRequests() {
  const organizationId = await getSessionOrgId();
  return prisma.leaveRequest.findMany({
    where: { employee: { organizationId } },
    include: { employee: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function requestLeave(formData: FormData) {
  const employeeId = String(formData.get("employeeId"));
  const leaveType = String(formData.get("leaveType")) as any;
  const startDate = new Date(String(formData.get("startDate")));
  const endDate = new Date(String(formData.get("endDate")));

  await prisma.leaveRequest.create({
    data: {
      employeeId,
      leaveType,
      startDate,
      endDate,
      status: "PENDING",
    },
  });

  revalidatePath("/dashboard/hr/leaves");
}

export async function decideLeave(id: string, status: "APPROVED" | "REJECTED") {
  await prisma.leaveRequest.update({
    where: { id },
    data: { status: status as any },
  });

  revalidatePath("/dashboard/hr/leaves");
}

export async function getPayrollRuns() {
  const organizationId = await getSessionOrgId();
  return prisma.payrollRun.findMany({
    where: { organizationId },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });
}

export async function generatePayrollRun(formData: FormData) {
  const organizationId = await getSessionOrgId();
  const month = Number(formData.get("month"));
  const year = Number(formData.get("year"));

  const employees = await prisma.employee.findMany({
    where: { organizationId, status: "ACTIVE" },
  });

  const run = await prisma.payrollRun.upsert({
    where: {
      organizationId_month_year: { organizationId, month, year },
    },
    update: {},
    create: {
      organizationId,
      month,
      year,
      status: "PROCESSED",
      totalAmount: 0,
    },
  });

  let total = 0;
  for (const emp of employees) {
    const basic = emp.basicSalary ?? 0;
    const piece = emp.pieceRate ?? 0;
    const net = basic + piece;
    total += net;

    await prisma.payslip.upsert({
      where: {
        payrollRunId_employeeId: { payrollRunId: run.id, employeeId: emp.id },
      },
      update: { basicSalary: basic, pieceRatePay: piece, netPay: net },
      create: {
        payrollRunId: run.id,
        employeeId: emp.id,
        basicSalary: basic,
        pieceRatePay: piece,
        netPay: net,
      },
    });
  }

  await prisma.payrollRun.update({
    where: { id: run.id },
    data: { totalAmount: total },
  });

  revalidatePath("/dashboard/hr/payroll");
}

export async function getPayrollRunDetail(id: string) {
  const organizationId = await getSessionOrgId();
  return prisma.payrollRun.findFirst({
    where: { id, organizationId },
    include: {
      payslips: {
        include: { employee: true },
        orderBy: { employee: { firstName: "asc" } },
      },
    },
  });
}

export async function markPayslipPaid(payslipId: string) {
  const payslip = await prisma.payslip.update({
    where: { id: payslipId },
    data: { paidAt: new Date() },
  });

  revalidatePath(`/dashboard/hr/payroll/${payslip.payrollRunId}`);
}