import React from 'react';
import UserProfileBasicElements from '../../components/UserProfilePageComponents/UserProfileBasicElements.jsx';   
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import userService from '../../services/userService.jsx';
import AttributeEditor from '../../components/reactSelect/AttributeEditor.jsx';

const ProjectPage = () => {
  const [isEditing, setIsEditing] = useState(false); 
  const { projectId } = useParams();
  const [isTheProjectNotExistant, setIsTheProjectNotExistant] = useState();
  const [projectInfo, setProjectInfo] = useState({

  });

  const fetchProjectData = async () => {

    };
  useEffect(() => {
    fetchProjectData();
  }, []);



  return (
    <>

      <div  >
        Project Page {projectId}
      </div>
      
    </>
  );

};

export default ProjectPage;
