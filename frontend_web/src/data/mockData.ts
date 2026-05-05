export const districts = [
  { name: "Colombo", amount: 8200000 },
  { name: "Gampaha", amount: 6100000 },
  { name: "Kandy", amount: 5400000 },
  { name: "Kurunegala", amount: 5100000 },
  { name: "Galle", amount: 4800000 },
  { name: "Matara", amount: 3900000 },
  { name: "Anuradhapura", amount: 3500000 },
  { name: "Ratnapura", amount: 2700000 },
  { name: "Badulla", amount: 2300000 },
  { name: "Jaffna", amount: 1900000 },
];

export const categories = [
  { name: "Speeding", value: 16900000, color: "#C9A84C" },
  { name: "Signal Violation", value: 10600000, color: "#8B1A1A" },
  { name: "No License", value: 8700000, color: "#1A3A5C" },
  { name: "Illegal Parking", value: 5800000, color: "#8C6A3C" },
  { name: "Drunk Driving", value: 3900000, color: "#B5860D" },
  { name: "Other", value: 2400000, color: "#F5F0E8" },
];

export const monthlyTrend = [
  { month: "Jan", amount: 3200000 },
  { month: "Feb", amount: 3500000 },
  { month: "Mar", amount: 4100000 },
  { month: "Apr", amount: 3800000 },
  { month: "May", amount: 4300000 },
  { month: "Jun", amount: 4700000 },
  { month: "Jul", amount: 5100000 },
  { month: "Aug", amount: 4900000 },
  { month: "Sep", amount: 4500000 },
  { month: "Oct", amount: 4800000 },
  { month: "Nov", amount: 5300000 },
  { month: "Dec", amount: 4900000 },
];

export type Status = "PAID" | "PENDING" | "OVERDUE";
export interface Transaction {
  id: string; officer: string; district: string; category: string;
  amount: number; date: string; status: Status;
}
export const transactions: Transaction[] = [
  { id: "TF-2026-00847", officer: "P. Karunaratne", district: "Colombo", category: "Speeding", amount: 3500, date: "2026-04-28", status: "PAID" },
  { id: "TF-2026-00846", officer: "S. Perera", district: "Kandy", category: "Signal Violation", amount: 2500, date: "2026-04-28", status: "PAID" },
  { id: "TF-2026-00845", officer: "R. Fernando", district: "Galle", category: "No License", amount: 5000, date: "2026-04-27", status: "PENDING" },
  { id: "TF-2026-00844", officer: "K. Bandara", district: "Gampaha", category: "Illegal Parking", amount: 1500, date: "2026-04-27", status: "PAID" },
  { id: "TF-2026-00843", officer: "M. Jayasuriya", district: "Matara", category: "Drunk Driving", amount: 25000, date: "2026-04-26", status: "OVERDUE" },
  { id: "TF-2026-00842", officer: "A. Wickramasinghe", district: "Kurunegala", category: "Speeding", amount: 3500, date: "2026-04-26", status: "PAID" },
  { id: "TF-2026-00841", officer: "T. Silva", district: "Anuradhapura", category: "Signal Violation", amount: 2500, date: "2026-04-25", status: "PAID" },
  { id: "TF-2026-00840", officer: "N. Dissanayake", district: "Jaffna", category: "No License", amount: 5000, date: "2026-04-25", status: "PENDING" },
  { id: "TF-2026-00839", officer: "L. Rathnayake", district: "Badulla", category: "Speeding", amount: 3500, date: "2026-04-24", status: "PAID" },
  { id: "TF-2026-00838", officer: "C. Gunawardena", district: "Ratnapura", category: "Other", amount: 1000, date: "2026-04-24", status: "OVERDUE" },
];

export const mockFine = {
  reference: "TF-2026-00847",
  violation: "Speeding (Category B)",
  amount: 3500,
  officer: "Officer P. Karunaratne",
  date: "2026-04-28",
  location: "Galle Road, Colombo 03",
};
