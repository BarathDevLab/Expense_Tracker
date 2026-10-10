const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const startOfWeek = (date) => {
  const monday = startOfDay(date);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return monday;
};

const dateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const getPeriodStart = (date, groupBy) => {
  if (groupBy === "weekly") return startOfWeek(date);
  if (groupBy === "monthly") return new Date(date.getFullYear(), date.getMonth(), 1);
  return startOfDay(date);
};

const formatPeriod = (periodStart, groupBy) => {
  const monthDay = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" });
  if (groupBy === "weekly") {
    const weekEnd = new Date(periodStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return `${monthDay.format(periodStart)} - ${monthDay.format(weekEnd)}`;
  }
  if (groupBy === "monthly") {
    return new Intl.DateTimeFormat(undefined, { month: "short", year: "numeric" }).format(periodStart);
  }
  return monthDay.format(periodStart);
};

export const aggregateTransactions = (transactions, startDate, endDate, groupBy) => {
  const groups = new Map();
  const firstPeriod = getPeriodStart(startDate, groupBy);
  const lastPeriod = getPeriodStart(endDate, groupBy);

  for (const period = new Date(firstPeriod); period <= lastPeriod; ) {
    groups.set(dateKey(period), {
      date: formatPeriod(period, groupBy),
      income: 0,
      expense: 0,
      balanceChange: 0,
    });

    if (groupBy === "weekly") period.setDate(period.getDate() + 7);
    else if (groupBy === "monthly") period.setMonth(period.getMonth() + 1);
    else period.setDate(period.getDate() + 1);
  }

  transactions
    .filter((item) => {
      const transactionDate = new Date(item.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    })
    .forEach((item) => {
      const period = getPeriodStart(new Date(item.date), groupBy);
      const group = groups.get(dateKey(period));
      if (!group) return;

      const amount = Number(item.amount) || 0;
      if (item.type === "income") {
        group.income += amount;
        group.balanceChange += amount;
      } else if (item.type === "expense") {
        group.expense += amount;
        group.balanceChange -= amount;
      }
    });

  return Array.from(groups.values());
};
