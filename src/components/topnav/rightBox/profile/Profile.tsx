
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { images } from "../../../../constants";
import classes from "./Profile.module.scss";

interface Admin {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
  earnings?: number;
}

interface EarningsData {
  totalUserInvestments: number;
  adminEarnings: number;
}

const Profile: React.FC = () => {
  const { t } = useTranslation();

  const [admin, setAdmin] = useState<Admin | null>(null);
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProfile();
    fetchEarnings();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/admin/profiles", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
        },
      });
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setAdmin(data.data[0]); // Assuming first admin is current user
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEarnings = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/admin/admin-earnings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
        },
      });
      const data = await response.json();
      setEarnings(data);
    } catch (error) {
      console.error("Error fetching earnings:", error);
    }
  };

  if (loading) {
    return (
      <div className={classes.profile}>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={classes.profile}>
      {/* Avatar */}
     
      <div className={classes.profile__avatar}>
        <img
          src={admin?.profileImage || images.avt}
          alt="avatar"
        />
      </div>

      {/* Info */}
      
      <div className={classes.profile__info}>
        <p className={classes.profile__userName}>{admin?.username || t("Admin")}</p>
        {/* <span className={classes.profile__role}>{admin?.email}</span> */}
      </div>

      {/* Earnings (Optional) */}
     
    </div>
  );
};

export default Profile;
