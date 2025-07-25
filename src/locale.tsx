

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          zahraMirzaei: "Sunidhi",
          admin: "admin",
          dashboard: "Dashboard",
          orders: "Orders",
          products: "Products",
          customers: "Customers",
          analytics: "Analytics",
          discount: "Discount",
          inventory: "Inventory",
          logout: "Logout",
          login: "Login",
          summary: "Summary",
          thisMonthSales: "This month Sales",
          thisMonthOrders: "This month Orders",
          thisMonthRevenue: "This month Revenue",
          quickAnalysis: "Quick Analysis",
          topCustomers: "Top Customers",
          latestTransaction: "Latest Transactions",
          customer: "Customer",
          totalSpending: "Total Spending",
          totalOrders: "Total Orders",
          orderID: "Order ID",
          totalPrice: "Total Price",
          date: "Date",
          status: "Status",
          approved: "Approved",
          pending: "Pending",
          rejected: "Rejected",
          viewAll: "View All",
          search: "Search",
          editCustomer: "Edit Customer",
          editProduct: "Edit Product",
          AccountDetails: "Account Details",
          contacts: "Contacts",
          edit: "Edit",
          userName: "User Name",
          pass: "Password",
          phoneNumber: "Phone Number",
          email: "Email",
          address: "Address",
          upload: "Upload",
          location: "Location",
          deleteCustomer: "Delete Customer",
          modalMessage: "Are you sure about delete this?",
          delete: "Delete",
          cancel: "Cancel",
          actions: "Actions",
          category: "Category",
          all: "All",
          clothing: "Clothing",
          digital: "Digital",
          beauty: "Beauty",
          product: "Product",
          price: "Price",
          proName: "Product Name",
          inventoryCount: "Inventory Count",
          loginPage: "Login Into Your Account",
          errorMessage: "Please enter 'admin' in User Name box",
          forgetPass: "Forget your password?",
          rememberMe: "Remember me",
          salesAmount: "5,340",
          orderAmount: "3000",
          revenueAmount: "2,500",
          currency: "$",
          summaryOfSale: "Chart Of Sale",
          summaryOfRevenue: "Chart Of Revenue",
          summaryOfOrders: "Chart Of Order",
          Jan: "Jan",
          Feb: "Feb",
          Mar: "Mar",
          Apr: "Apr",
          May: "May",
          Jun: "Jun",
          July: "July",
          Aug: "Aug",
          Sep: "Sep",
          Oct: "Oct",
          Nov: "Nov",
          Dec: "Dec",
          backToHome: "Back to Main Page",
          notFoundMsg: "Page Not Found!",
        },
      },
      hi: {
        translation: {
          zahraMirzaei: "सुनिधि",
          admin: "प्रशासक",
          dashboard: "डैशबोर्ड",
          orders: "ऑर्डर",
          products: "उत्पाद",
          customers: "ग्राहक",
          analytics: "विश्लेषण",
          discount: "छूट",
          inventory: "भंडार",
          logout: "लॉग आउट",
          login: "लॉगिन",
          summary: "सारांश",
          thisMonthSales: "इस महीने की बिक्री",
          thisMonthOrders: "इस महीने के ऑर्डर",
          thisMonthRevenue: "इस महीने की आय",
          quickAnalysis: "त्वरित विश्लेषण",
          topCustomers: "शीर्ष ग्राहक",
          latestTransaction: "हाल की लेन-देन",
          customer: "ग्राहक",
          totalSpending: "कुल खर्च",
          totalOrders: "कुल ऑर्डर",
          orderID: "ऑर्डर आईडी",
          totalPrice: "कुल कीमत",
          date: "तारीख",
          status: "स्थिति",
          approved: "स्वीकृत",
          pending: "लंबित",
          rejected: "अस्वीकृत",
          viewAll: "सभी देखें",
          search: "खोजें",
          editCustomer: "ग्राहक संपादित करें",
          editProduct: "उत्पाद संपादित करें",
          AccountDetails: "खाता विवरण",
          contacts: "संपर्क",
          edit: "संपादित करें",
          userName: "यूज़र नेम",
          pass: "पासवर्ड",
          phoneNumber: "फ़ोन नंबर",
          email: "ईमेल",
          address: "पता",
          upload: "अपलोड",
          location: "स्थान",
          deleteCustomer: "ग्राहक हटाएं",
          modalMessage: "क्या आप इसे हटाने के लिए सुनिश्चित हैं?",
          delete: "हटाएं",
          cancel: "रद्द करें",
          actions: "क्रियाएं",
          category: "श्रेणी",
          all: "सभी",
          clothing: "कपड़े",
          digital: "डिजिटल",
          beauty: "सौंदर्य",
          product: "उत्पाद",
          price: "कीमत",
          proName: "उत्पाद का नाम",
          inventoryCount: "भंडार गिनती",
          loginPage: "अपने खाते में लॉगिन करें",
          errorMessage: "कृपया यूज़र नेम बॉक्स में 'admin' दर्ज करें",
          forgetPass: "क्या आप पासवर्ड भूल गए?",
          rememberMe: "मुझे याद रखें",
          salesAmount: "5,340",
          orderAmount: "3,000",
          revenueAmount: "2,500",
          currency: "₹",
          summaryOfSale: "बिक्री का चार्ट",
          summaryOfRevenue: "आय का चार्ट",
          summaryOfOrders: "ऑर्डर का चार्ट",
          Jan: "जनवरी",
          Feb: "फरवरी",
          Mar: "मार्च",
          Apr: "अप्रैल",
          May: "मई",
          Jun: "जून",
          July: "जुलाई",
          Aug: "अगस्त",
          Sep: "सितंबर",
          Oct: "अक्टूबर",
          Nov: "नवंबर",
          Dec: "दिसंबर",
          backToHome: "मुख्य पृष्ठ पर लौटें",
          notFoundMsg: "पृष्ठ नहीं मिला!",
        },
      },
    },
    lng: "en", // default language
    fallbackLng: "en", // fallback language

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
