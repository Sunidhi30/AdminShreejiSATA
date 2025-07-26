// import { useTranslation } from "react-i18next";
// import { Link } from "react-router-dom";
// import data from "../../constants/data";
// import classes from "./DashboardTables.module.scss";
// import CustomTable from "./customTable/CustomTable";
// import Deposit from '../../pages/UserDeposit'
// const Table = () => {
//   const { t } = useTranslation();
//   return (
//     <section className={classes.table}>
//       <div
//         className={`${classes.table__top__customers} ${classes.table__child}`}
//       >
//         <div className={classes.table__title}>
//           <p className="subTitle">{t("topCustomers")}</p>
//           <Link to="/">{t("viewAll")}</Link>
//         </div>
//         <CustomTable
//           headData={data.topCustomers.head}
//           bodyData={data.topCustomers.body}
//         />
//       </div>
//       <div
//         className={`${classes.table__latest__orders} ${classes.table__child}`}
//       >
//         <div className={classes.table__title}>
//           <p className="subTitle">{t("latestTransaction")}</p>
//           <Link to="/users-Deposit">{t("viewAll")}</Link>
//         </div>
//         <CustomTable
//           headData={data.latestOrders.header}
//           bodyData={data.latestOrders.body}
//         />
//       </div>
//     </section>
//   );
// };

// export default Table;

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import data from "../../constants/data";
import classes from "./DashboardTables.module.scss";
import CustomTable from "./customTable/CustomTable";
import GamesTable from "./customTable/gamesTable/GameTable"; // ✅ Correct path to GamesTable

const Table = () => {
  const { t } = useTranslation();

  return (
    <section className={classes.table}>
      {/* Top Customers */}
      <div className={`${classes.table__top__customers} ${classes.table__child}`}>
        <div className={classes.table__title}>
          <p className="subTitle">{t("topCustomers")}</p>
          <Link to="/customers">{t("viewAll")}</Link>
        </div>
        <CustomTable
          headData={data.topCustomers.head}
          bodyData={data.topCustomers.body}
        />
      </div>

      {/* Latest Games - replacing Latest Transactions */}
      <div className={`${classes.table__latest__orders} ${classes.table__child}`}>
        <div className={classes.table__title}>
          <p className="subTitle">Latest Games</p>
          <Link to="/products">{t("viewAll")}</Link>
        </div>

        {/* ✅ Inject GamesTable here */}
        <div className={classes.gamesWrapper}>
          <GamesTable games={[]} /> {/* Pass real game data or leave empty for sample */}
        </div>
      </div>
    </section>
  );
};

export default Table;
