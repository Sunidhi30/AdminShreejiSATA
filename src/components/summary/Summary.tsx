
import { useTranslation } from "react-i18next";
import { IsummData } from "../../interfaces/IsummData";
import classes from "./Summary.module.scss";
import SummaryBox from "./SummaryBox";

const summaryData: IsummData[] = [
 
 
  {
    icon: "lucide:user",
    text: "Total Users",
    amount: "salesAmount",
    currency: "",
  },
  {
    icon: "mdi:wallet",
    text: "Total bid amount",
    amount: "orderAmount",
    currency: "currency",
  },
  {
    icon: "mdi:currency-inr",
    text: "thisMonthRevenue",
    amount: "revenueAmount",
    currency: "currency",
  },
];

function Summary() {
  const { t } = useTranslation();
  return (
    <section className={classes.summary}>
      <p className="subTitle">{t("summary")}</p>
      <div className={classes.summary__box}>
        {summaryData.map((item) => (
          <SummaryBox key={item.text} item={item} />
        ))}
      </div>
    </section>
  );
}

export default Summary;
