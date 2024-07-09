import React, { useEffect, useState, useCallback } from 'react';
import styles from './ProjectList.module.css';
import { format, parseISO } from 'date-fns';
import membershipService from '../../../services/membershipService';
import { useNavigate } from 'react-router-dom';

const ProjectList = ({ id }) => {
    const [projects, setProjects] = useState([]);
    const [sortCriteria, setSortCriteria] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('asc');
    const navigate = useNavigate();

    const fetchProjects = useCallback(async () => {
        if(!id) return;
        try {
            const response = await membershipService.getProjectsByuserId(id);
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error("Error fetching projects:", error.message);
        }
    }, [id]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const formatDate = (dateString) => {
        const date = parseISO(dateString);
        return format(date, 'dd/MM/yyyy');
    };

    const handleSortCriteriaChange = (event) => {
        setSortCriteria(event.target.value);
    };

    const handleSortOrderChange = (event) => {
        setSortOrder(event.target.value);
    };

    const sortedProjects = [...projects].sort((a, b) => {
        if (a[sortCriteria] < b[sortCriteria]) {
            return sortOrder === 'asc' ? -1 : 1;
        }
        if (a[sortCriteria] > b[sortCriteria]) {
            return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const handleProjectClick = (e, id) => {
        navigate("/projectpage/" + id);
    };
    if(projects.length === 0 || !projects) return null;
    return (
        <div className={styles.container}>
            <h2>Project List</h2>
            <div className={styles.sortOptions}>
                <label>
                    Sort by:
                    <select className={styles.select} value={sortCriteria} onChange={handleSortCriteriaChange}>
                        <option value="createdAt">Date</option>
                        <option value="status">Status</option>
                    </select>
                </label>
                <label>
                    Order:
                    <select className={styles.select} value={sortOrder} onChange={handleSortOrderChange}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </label>
            </div>
            <div className={styles.innerContainer}>
                <ul className={styles.attributeList}>
                    {sortedProjects.map((project, index) => (
                        <li className={styles.projectElement} key={index} onClick={(e) => handleProjectClick(e, project.id)}>
                            <span className={styles.projectName}>{project.name}</span>
                            <span className={styles.projectDate}>{formatDate(project.createdAt)}</span>
                            <span className={styles.projectStatus}>{project.status}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProjectList;
