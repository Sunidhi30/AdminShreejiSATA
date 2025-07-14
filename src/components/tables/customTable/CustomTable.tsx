
import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Itable as Props, complex } from "../../../interfaces/Itable";
import Card from "../../UI/card/Card";
import Modal from "../../UI/modal/Modal";
import classes from "./CustomTable.module.scss";

/* ✅ Fix 1: Use "type" instead of "interface extends" */
type UserWithWallet = complex & {
  profileImage?: string;
  wallet?: {
    balance: number;
    totalDeposits: number;
    totalWinnings: number;
  };
  _id: string;
  userName?: string;
  email?: string;
  mobile?: string;
};

const CustomTable: React.FC<Props> = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<UserWithWallet[]>([]);
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();

  function showModalHandler() {
    setShowModal((prev) => !prev);
  }

  function tableBody(item: UserWithWallet, index: number) {
    if ("email" in item) {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td className={classes.userName}>
            <img
              className={classes.avatar}
              src={item.profileImage || "/default-avatar.png"}
              alt="user avatar"
            />
            {item.userName || "N/A"}
          </td>
          <td className="ltr">{item.email}</td>
          <td className="ltr">{item.mobile || "N/A"}</td>
          <td>{item.wallet?.balance || 0}</td>
          <td>{item.wallet?.totalDeposits || 0}</td>
          <td>{item.wallet?.totalWinnings || 0}</td>
          <td className={classes.actions}>
            <Icon icon="charm:menu-kebab" />
            <div className={classes.actions__box}>
              <div
                className={classes.actions__delete}
                onClick={showModalHandler}
              >
                <Icon icon="fluent:delete-24-regular" width="24" />
              </div>
              <div className={classes.actions__edit}>
                <Link to={`/customers/${item._id}`}>
                  <Icon icon="fluent:edit-16-regular" width="24" />
                </Link>
              </div>
            </div>
          </td>
        </tr>
      );
    }
  }

  // pagination logic
  const [dataShow, setDataShow] = useState<UserWithWallet[]>([]);
  const pages = useRef(1);
  const range = useRef<number[]>([]);
  const [currPage, setCurrPage] = useState(0);

  const selectPage = (page: number) => {
    const start = Number(props.limit) * page;
    const end = start + Number(props.limit);
    setDataShow(users.slice(start, end));
    setCurrPage(page);
  };

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          console.error("Admin token not found in localStorage");
          return;
        }

        const response = await fetch("http://localhost:9000/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          const formattedUsers: UserWithWallet[] = data.users.map(
            (user: any, index: number) => ({
              ...user,
              ID: index + 1,
              userName: user.email?.split("@")[0],
              mobile: user.mobile || "N/A",
            })
          );
          setUsers(formattedUsers);
          setDataShow(
            props.limit
              ? formattedUsers.slice(0, Number(props.limit))
              : formattedUsers
          );

          if (props.limit) {
            let page = Math.floor(formattedUsers.length / Number(props.limit));
            pages.current =
              formattedUsers.length % Number(props.limit) === 0
                ? page
                : page + 1;
            range.current = [...Array(pages.current).keys()];
          }
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [props.limit]);

  return (
    <>
      {showModal && (
        <Modal
          title={t("deleteCustomer")}
          message={`${t("modalMessage")}`}
          onConfirm={showModalHandler}
        />
      )}

      <div className={classes.container}>
        <Card>
          <div className={classes.wrapper}>
            {loading ? (
              <div className={classes.loading}>Loading users...</div>
            ) : (
              <div className={classes.table__wrapper}>
                <table
                  className={props.limit ? classes.largeTable : classes.table}
                >
                  {props.headData && (
                    <thead>
                      <tr>
                        {props.headData.map((item, index) => (
                          <th key={index}>{t(item)}</th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {dataShow.map((item, index) => tableBody(item, index))}
                  </tbody>
                </table>
              </div>
            )}

            {pages.current > 1 && (
              <div className={classes.table__pagination}>
                {range.current.map((item, index) => (
                  <div
                    key={index}
                    className={`${classes.table__pagination_item} ${
                      currPage === index ? classes.active : ""
                    }`}
                    onClick={() => selectPage(index)}
                  >
                    {item + 1}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
};

export default CustomTable;
