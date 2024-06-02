import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProjectBasicInfo from '../../components/ProjectPageComponents/ProjectBasicInfo.jsx';
import projectService from '../../services/projectService.jsx';
import AttributeEditor from '../../components/reactSelect/AttributeEditor.jsx';
import useProjectStatesStore from '../../stores/useProjectStatesStore.jsx';
import useLabStore from '../../stores/useLabStore.jsx';
import { useCallback } from 'react';
import useProjectRolesStore from '../../stores/useProjectRolesStore.jsx';

const ProjectPage = () => {
  const [isEditing, setIsEditing] = useState(false); 
  const { id } = useParams();
  const [isTheProjectNotExistant, setIsTheProjectNotExistant] = useState();
  const [projectInfo, setProjectInfo] = useState(
    {
      name: "",
      description: "",
      motivation: "",
      state: "",
      laboratory: "",
      keywords: [],
      skills: [],
      users: []
    }
  );
  const{states, fetchProjectStates} = useProjectStatesStore();
  const{roles, fetchProjectRoles} = useProjectRolesStore();
  const { laboratories, fetchLaboratories } = useLabStore();
  const fetchProjectData = useCallback(async () => {
    try {
      const response = await projectService.getProjectById(id);
      if (response.status === 404) {
        setIsTheProjectNotExistant(true);
        return;
      }
      const projectData = await response.json();
      setProjectInfo(projectData);
    } catch (error) {
      console.error("Error fetching project data:", error.message);
    }
  }, [id]);

  useEffect(() => {
    fetchLaboratories();
    fetchProjectData();
    fetchProjectRoles();
    fetchProjectStates();
  }, []);



  return (
    <>

      <div  >
        <ProjectBasicInfo projectInfo={projectInfo} states={states} laboratories={laboratories} setProjectInfo={setProjectInfo}/>
        <AttributeEditor title="skills" editMode={true} mainEntity={"project"} creationMode={false} projectId={id}/>
        <AttributeEditor title="keywords" editMode={true} mainEntity={"project"} creationMode={false} projectId={id}/>                
        <AttributeEditor title="users" editMode={true} mainEntity={"project"} creationMode={false} projectId={id}/>
      </div>
      
    </>
  );

};

export default ProjectPage;
