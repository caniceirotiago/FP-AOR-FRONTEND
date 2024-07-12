import React, { useEffect } from "react";
import HomepageHeader from "../../components/headers/HomepageHeader";
import styles from "./MainLayout.module.css";
import HomepageAside from "../../components/asides/HomepageAside";
import ProtectedComponent from "../../components/auth regist/ProtectedComponents.jsx";
import useDeviceStore from "../../stores/useDeviceStore";
import HomepageMobileFooter from "../../components/footers/homePageFooters/homePageMobileFooter/HomepageMobileFooter.jsx";
import { useGlobalWebSocket } from "../../websockets/useGlobalWebSocket.jsx";
import useDomainStore from "../../stores/useDomainStore.jsx";
import useConfigurationStore from "../../stores/useConfigurationStore.jsx";

const MainLayout = ({ children }) => {
  const { dimensions, setDimensions, setDeviceType } = useDeviceStore();
  const { fetchConfigurations } = useConfigurationStore();
  const { wssDomain } = useDomainStore();

  // Initialize WebSocket connection
  useGlobalWebSocket(`${wssDomain}/ws`, true);

  // Fetch configurations when the component mounts
  useEffect(() => {
    fetchConfigurations();
  }, [fetchConfigurations]);

  // Handle window resize events to update device dimensions and type
  useEffect(() => {
    const handleResize = () => {
      setDimensions(window.innerWidth, window.innerHeight);
      setDeviceType(window.innerWidth < 768 ? "mobile" : "desktop");
    };
    window.addEventListener("resize", handleResize);

    // Initial call to set dimensions and device type
    handleResize();
    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [setDimensions, setDeviceType]);

  return (
    <div className={styles.main}>
      <HomepageHeader />
      <div className={styles.board}>
        <ProtectedComponent>
          {dimensions.width >= 768 && <HomepageAside />}
        </ProtectedComponent>
        <div
          className={`${styles.rightContainer} ${
            false ? "" : styles.expandedRightContainer
          }`}
        >
          {children}
        </div>
      </div>
      <ProtectedComponent>
        {dimensions.width < 768 && <HomepageMobileFooter />}
      </ProtectedComponent>
    </div>
  );
};

export default MainLayout;
