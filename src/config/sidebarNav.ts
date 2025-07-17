
const sidebarNav = [
  {
    link: "/",
    section: "dashboard",
    icon: "lucide:layout-dashboard",
    text: "Dashboard",
  },
  {
    link: "/customers",
    section: "Users",
    icon: "ph:users-bold",
    text: "Customers",
  },
  {
    // Remove direct link here because it's a parent now
    section: "Games ",
    icon: "icon-park-outline:ad-product",
    text: "Games",
    children: [
      {
        section: "Games List",
        link: "/products", 
      },
      
{
    section: "Games Rate",
    link: "/games-rate", 
},
       {
        section: "Games Results",
        link: "/game-results", 
      },
    ],
  },
  {
    // Remove direct link here because it's a parent now
    section: "Reports",
    icon: "mdi:file-chart-outline",
    text: "Reports",
    children: [
     
       {
        section: "Winner Prediction",
        link: "/investors-list", 
      },
{
    section: "Profit/Loss",
    link: "/games-rate", 
},
       {
        section: "Winning Details",
        link: "/Winning-details", 
      },
       {
        section: "Bet Filter",
        link: "/game-results", 
      },
       {
        section: "Customer Sell Report",
        link: "/game-results", 
      },
       {
        section: "Bid History",
        link: "/game-results", 
      },
      {
        section: "Withdrawal Report",
        link: "/game-results", 
      },
    ],
  },
  {
    link: "/analytics",
    section: "Wallet",
    icon: "carbon:analytics",
    text: "Analytics",
  },
  {
    link: "/discount",
    section: "Notices",
    icon: "bi:chat-dots",
    text: "Discount",
  },
  {
    link: "/inventory",
    section: "Settings",
    icon: "mdi:cog-outline",
    text: "Inventory",
  },
];

export default sidebarNav;
