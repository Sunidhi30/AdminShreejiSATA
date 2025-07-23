// import React, { useState } from "react";

// type SidebarContextObj = { isOpen: boolean; toggleSidebar: () => void };

// const SidebarContext = React.createContext<SidebarContextObj>({
//   isOpen: true,
//   toggleSidebar: () => {},
// });

// export const SidebarContextProvider: React.FC = (props) => {
//   const [isOpen, setIsOpen] = useState(true);
//   function ToggleSidebar() {
//     setIsOpen((prev) => !prev);
//   }

//   const contextValue: SidebarContextObj = {
//     isOpen,
//     toggleSidebar: ToggleSidebar,
//   };
//   return (
//     <SidebarContext.Provider value={contextValue}>
//       {props.children}
//     </SidebarContext.Provider>
//   );
// };

// export default SidebarContext;
import React, { useState } from "react";

type SidebarContextObj = { 
  isOpen: boolean; 
  toggleSidebar: () => void;
  setIsOpen: (state: boolean) => void; // ✅ Add this
};

const SidebarContext = React.createContext<SidebarContextObj>({
  isOpen: true,
  toggleSidebar: () => {},
  setIsOpen: () => {}, // ✅ placeholder
});

export const SidebarContextProvider: React.FC = (props) => {
  const [isOpen, setIsOpen] = useState(true);

  function ToggleSidebar() {
    setIsOpen((prev) => !prev);
  }

  const contextValue: SidebarContextObj = {
    isOpen,
    toggleSidebar: ToggleSidebar,
    setIsOpen, // ✅ Add this
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      {props.children}
    </SidebarContext.Provider>
  );
};

export default SidebarContext;
