import React, {useEffect, useState} from 'react';
import styles from './HomePage.module.css';
import ProjectTable from '../../components/HomePageComponents/ProjectTable/ProjectTable.jsx';
import ProtectedComponents from '../../components/auth regist/ProtectedComponents';
import CreateProjectModal from '../../components/modals/CreateProjectModal.jsx';
import projectService from '../../services/projectService';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [projects, setProjects] = useState([]);

  useEffect(() => {
      const fetchProjects = async () => {
          const response = await projectService.getAllProjects();
          console.log(response);
          if (response.status === 200) {
              const data = await response.json();
              console.log(data);
              setProjects(data);
          }
      }
      fetchProjects();
  }, [isModalOpen]);
  const handleClick = () => {
    setIsModalOpen(true);
  }
  return (
    <div className={styles.homePage} >
      <ProtectedComponents>
        <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <button onClick={handleClick}>Click me</button>
      </ProtectedComponents>
      <ProjectTable projects={projects}/>
    </div>
  );
};

export default HomePage;
