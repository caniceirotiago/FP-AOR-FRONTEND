import React from 'react';
import styles from './HomePage.module.css';
import ProjectTable from '../../components/HomePageComponents/ProjectTable/ProjectTable.jsx';
import ProtectedComponents from '../../components/auth regist/ProtectedComponents';
import CreateProjectModal from '../../components/modals/CreateProjectModal.jsx';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const handleClick = () => {
    setIsModalOpen(true);
  }

  return (
    <div className={styles.homePage} >
      <ProtectedComponents>
        <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <button onClick={handleClick}>Click me</button>
      </ProtectedComponents>
      <ProjectTable/>
    </div>
  );
};

export default HomePage;
