
import { Bar, BarChart, Line, LineChart, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useTranslations } from "next-intl"
import { useData } from "@/context/admin/fetchDataContext"

function CardIncome() {
const t=useTranslations()
const getMonthAbbreviation = (fullMonth:string) => {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthIndex = monthNames.findIndex((month) => month.toLowerCase() === fullMonth?.toLowerCase());
  return monthIndex !== -1 ? monthNames[monthIndex].slice(0, 3) : '';
};
const { analytics } = useData();
const data:any[]=analytics.data?Object.keys(analytics.data).map((key:any) => ({
  month:getMonthAbbreviation(analytics.data[key].month),
  income:analytics.data[key].income || 0,
  expenses:analytics.data[key].expenses || 0,
})):[];
const getCurrentMonthData = () => {
  const currentMonth = new Date().toLocaleString('default', { month: 'short' });
  return data.find(item => item.month === currentMonth);
};

const getPreviousMonthData = () => {
  const currentMonthIndex = new Date().getMonth();
  const previousMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
  const previousMonthName = new Date(0, previousMonthIndex).toLocaleString('default', { month: 'short' });
  return data.find(item => item.month === previousMonthName);
};

const calculateRate = () => {
  const currentMonthData = getCurrentMonthData();
  const previousMonthData = getPreviousMonthData();

  if (!currentMonthData || !previousMonthData) {
    return null; // Data not found for current or previous month
  }

  const rate = ((currentMonthData.expenses - previousMonthData.expenses) / previousMonthData.expenses) * 100;
  return rate.toFixed(2); // Return rate with two decimal places
};
  return (
    <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-normal">{t('total-expenses')}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">DZD { data.reduce((acc, curr) => acc + curr.expenses, 0)}</div>
      <p className="text-xs text-muted-foreground">
{t("from-last-month",{rate:calculateRate()})}
      </p>
      <div className="h-[80px]">
      <ResponsiveContainer width="100%" height="100%">
      <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <Line
              type="monotone"
              strokeWidth={2}
              dataKey="expenses"
              activeDot={{
                r: 6,
                style: { fill: "var(221.2 83.2% 53.3%)", opacity: 0.25 },
              }}
              style={
                {
                  stroke: "var(221.2 83.2% 53.3%)",
                  "--theme-primary": `hsl(221.2 83.2% 53.3%)`,
                } as React.CSSProperties
              }
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>


  )
}
export default CardIncome
{/* <Card>
<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  <CardTitle className="text-sm font-normal">Subscriptions</CardTitle>
</CardHeader>
<CardContent>
  <div className="text-2xl font-bold">+2350</div>
  <p className="text-xs text-muted-foreground">
    +180.1% from last month
  </p>
  <div className="mt-4 h-[80px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <Bar
          dataKey="subscription"
          style={
            {
              fill: "var(--theme-primary)",
              opacity: 1,
              "--theme-primary": `hsl(221.2 83.2% 53.3%)`,
            } as React.CSSProperties
          }
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</CardContent>
</Card> */}