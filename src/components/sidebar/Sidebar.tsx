import { Icon } from "@iconify/react";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { useWindowSize } from "usehooks-ts";
import sidebarNav from "../../config/sidebarNav";
import { images } from "../../constants";
import LoginContext from "../../store/loginContext";
import SidebarContext from "../../store/sidebarContext";
import classes from "./Sidebar.module.scss";

function Sidebar() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const { width } = useWindowSize();
  const location = useLocation();
  const sidebarCtx = useContext(SidebarContext);
  const loginCtx = useContext(LoginContext);
  const { t } = useTranslation();

  function openSidebarHandler() {
    if (width <= 768) document.body.classList.toggle("sidebar__open");
  }

  function logoutHandler() {
    openSidebarHandler();
    loginCtx.toggleLogin();
  }

  function toggleDropdown(index: number) {
    setOpenDropdown(openDropdown === index ? null : index);
  }

  useEffect(() => {
    const curPath = window.location.pathname.split("/")[1];
    const activeItem = sidebarNav.findIndex((item) => {
      if (item.link) {
        return item.link.replace("/", "") === curPath;
      } else if (item.children) {
        return item.children.some(
          (child) => child.link.replace("/", "") === curPath
        );
      }
      return false;
    });
    setActiveIndex(activeItem >= 0 ? activeItem : 0);
  }, [location]);

  return (
    <div
      className={`${classes.sidebar} ${
        !sidebarCtx.isOpen && classes.sidebar_close
      }`}
    >
      <div className={classes.sidebar__logo}>
        <img src={images.logo} alt="Logo" />
      </div>

      <div className={classes.sidebar__menu}>
        {sidebarNav.map((nav, index) => (
          <div key={`nav-${index}`}>
            {nav.children ? (
              <>
                {/* Parent with dropdown */}
                <div
                  className={`${classes.sidebar__menu__item} ${
                    activeIndex === index && classes.active
                  }`}
                  onClick={() => toggleDropdown(index)}
                >
                  <div className={classes.sidebar__menu__item__icon}>
                    <Icon icon={nav.icon} />
                  </div>
                  <div className={classes.sidebar__menu__item__txt}>
                    {t(nav.section)}
                  </div>
                  <div
                    className={`${classes.sidebar__menu__item__chevron} ${
                      openDropdown === index ? classes.open : ""
                    }`}
                  >
                    <Icon
                      icon={
                        openDropdown === index
                          ? "tabler:chevron-up"
                          : "tabler:chevron-down"
                      }
                    />
                  </div>
                </div>

                {/* Dropdown submenu */}
                {openDropdown === index && (
                  <div className={classes.sidebar__submenu}>
                    {nav.children.map((child, childIdx) => (
                      <Link
                        to={child.link}
                        key={`child-${childIdx}`}
                        className={classes.sidebar__submenu__item}
                        onClick={openSidebarHandler}
                      >
                        {child.section}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              // Normal link
              <Link
                to={nav.link!} // TypeScript-safe because no children
                className={`${classes.sidebar__menu__item} ${
                  activeIndex === index && classes.active
                }`}
                onClick={openSidebarHandler}
              >
                <div className={classes.sidebar__menu__item__icon}>
                  <Icon icon={nav.icon} />
                </div>
                <div className={classes.sidebar__menu__item__txt}>
                  {t(nav.section)}
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className={[classes.sidebar__menu, classes.logout].join(" ")}>
        <Link
          to="/login"
          className={classes.sidebar__menu__item}
          onClick={logoutHandler}
        >
          <div className={classes.sidebar__menu__item__icon}>
            <Icon icon="tabler:logout" />
          </div>
          <div className={classes.sidebar__menu__item__txt}>
            {t("logout")}
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
