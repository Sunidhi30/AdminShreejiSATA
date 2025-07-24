
import { useEffect, useState } from "react";
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
    text: "Total Revenue", 
    amount: "revenueAmount",
    currency: "currency",
  },
];

function Summary() {
  const { t } = useTranslation();
  const [userCount, setUserCount] = useState<number | null>(null);
  const [totalBidAmount, setTotalBidAmount] = useState<number | null>(null);
  const [adminEarnings, setAdminEarnings] = useState<number | null>(null);
  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch(
          "https://satashreejibackend.onrender.com/api/admin/users-count",
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Unauthorized or failed to fetch user count");
        }
        const data = await response.json();
        setUserCount(data.count);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

   
const fetchTotalBidAmount = async () => {
  try {
    const response = await fetch(
      "https://satashreejibackend.onrender.com/api/admin/total-bid-amount",
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Unauthorized or failed to fetch total bid amount");
    }
    const data = await response.json();
    setTotalBidAmount(data.totalBidAmount);
  } catch (error) {
    console.error("Error fetching total bid amount:", error);
  }
};

   
    const fetchAdminEarnings = async () => {
      try {
        const response = await fetch(
          "https://satashreejibackend.onrender.com/api/admin/admin-earnings",
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Unauthorized or failed to fetch admin earnings");
        }
        const data = await response.json();
        setAdminEarnings(data.adminEarnings);
      } catch (error) {
        console.error("Error fetching admin earnings:", error);
      }
    };

    fetchUserCount();
    fetchTotalBidAmount();
    fetchAdminEarnings();
  }, []);

  // Clone summaryData and inject API values
  const updatedSummaryData = summaryData.map((item) => {
  if (item.text === "Total Users" && userCount !== null && userCount !== undefined) {
    return { ...item, amount: userCount?.toString() || "0" };
  }
  if (item.text === "Total bid amount" && totalBidAmount !== null && totalBidAmount !== undefined) {
    return { ...item, amount: totalBidAmount?.toString() || "0" };
  }
  if (item.text === "Total Revenue" && adminEarnings !== null && adminEarnings !== undefined) {
    return { ...item, amount: adminEarnings?.toString() || "0" };
  }
  return item;
});


  return (
    <section className={classes.summary}>
      <p className="subTitle">{t("summary")}</p>
      <div className={classes.summary__box}>
        {updatedSummaryData.map((item) => (
          <SummaryBox key={item.text} item={item} />
        ))}
      </div>
    </section>
  );
}

export default Summary;
