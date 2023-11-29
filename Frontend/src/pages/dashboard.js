// Dashboard.js
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useContext } from 'react';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import ApplicationCard from '@/components/ApplicationCard';
import axios from 'axios';
import Link from 'next/link';
import { LoadingBarContext } from '../context/LoadingBarContext';
import JobCard from '@/components/JobCard';
import JobForm from '@/components/JobForm';
import Cookies from 'js-cookie';

function Dashboard() {
  const { setProgress } = useContext(LoadingBarContext);

  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [userData, setUserData] = useState({
    name: '',
    description: '',
    skills: [],
    imageUrl: '',
  });
  const [selectedOption, setSelectedOption] = useState('recomandations');
  const [jobListings, setJobListings] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/jobpostings');
        setJobListings(response.data.job_postings);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userid = document.cookie.replace(/(?:(?:^|.*;\s*)userId\s*=\s*([^;]*).*$)|^.*$/, '$1');
        setProgress(30);

        // Fetch user data
        const userDataResponse = await fetch(`http://localhost:8080/users/${userid}`);
        const userDataJson = await userDataResponse.json();
        setUserData({
          name: userDataJson.user.fullName,
          description: userDataJson.user.description,
          skills: userDataJson.user.skills,
          imageUrl: userDataJson.user.img,
        });
        Cookies.set('img', userDataJson.user.img);
        setProgress(100);

        // Fetch applied jobs data
        const appliedJobsResponse = await fetch('http://127.0.0.1:8080/get_all_applications');
        const appliedJobsJson = await appliedJobsResponse.json();
        setAppliedJobs(appliedJobsJson.applications);
      } catch (error) {
        console.error('Error fetching data:', error);
        setProgress(100);
      }
    };

    fetchData();
  }, [setProgress]);

  const handleBookmark = (jobId) => {
    const isBookmarked = bookmarkedJobs.includes(jobId);
    if (isBookmarked) {
      setBookmarkedJobs((prevBookmarkedJobs) => prevBookmarkedJobs.filter((id) => id !== jobId));
    } else {
      setBookmarkedJobs((prevBookmarkedJobs) => [...prevBookmarkedJobs, jobId]);
    }

    Cookies.set('bookmarkedJobs', JSON.stringify(bookmarkedJobs));
  };

  const renderOptionButtons = () => {
    const isJobSeeker = Cookies.get('job_seeker') === 'job_seeker';

    if (isJobSeeker) {
      return (
        <div className={`${styles.dashboardcontainer}`}>
          <button onClick={() => handleOptionChange('recomandations')}>Recomandations</button>
          <button onClick={() => handleOptionChange('upcomming')}>Upcoming</button>
          <button onClick={() => handleOptionChange('findJob')}>Find Job</button>
        </div>
      );
    } else {
      return (
        <div className={`${styles.dashboardcontainer}`}>
          <button onClick={() => handleOptionChange('recomandations')}>Recomandations</button>
          <button onClick={() => handleOptionChange('applications')}>Applications</button>
          <button onClick={() => handleOptionChange('createJob')}>Create Job</button>
        </div>
      );
    }
  };

  const renderContent = () => {
    const isJobSeeker = Cookies.get('job_seeker') === 'job_seeker';

    if (isJobSeeker) {
      if (selectedOption === 'recomandations') {
        return (
          <div>
            <h1>Job Recommendations</h1>
            {/* Display job recommendations here */}
          </div>
        );
      } else if (selectedOption === 'findJob') {
        const currentTime = new Date();
        console.log(jobListings);
        return (
          <div className={`${styles.jobcarddiv}`}>
            {jobListings
              .filter((job) => new Date(job.start_date) <= currentTime)
              .map((job) => (
                <JobCard
                  key={job._id}
                  id={job._id}
                  img={job.img}
                  job_title={job.job_title}
                  company={job.company}
                  creator={job.hiring_manager}
                  submissionEndDate={job.end_date}
                  timeLeft={job.timeLeft}
                  isBookmarked={job.is_bookmarked}
                  status={job.status}
                  startDate={job.start_date}
                  onViewApplication={() => alert(`View Application for ${job.company}`)}
                  onBookmark={() => handleBookmark(job._id)}
                />
              ))}
          </div>
        );
      } else if (selectedOption === 'upcomming') {
        const currentTime = new Date();
        console.log(jobListings);
        return (
          <div className={`${styles.jobcarddiv}`}>
            {jobListings
              .filter((job) => new Date(job.start_date) > currentTime)
              .map((job) => (
                <JobCard
                  key={job._id}
                  id={job._id}
                  img={job.img}
                  job_title={job.job_title}
                  company={job.company}
                  creator={job.hiring_manager}
                  submissionEndDate={job.end_date}
                  timeLeft={job.timeLeft}
                  isBookmarked={job.is_bookmarked}
                  status="upcoming"
                  startDate={job.start_date}
                  onViewApplication={() => alert(`View Application for ${job.company}`)}
                  onBookmark={() => handleBookmark(job._id)}
                />
              ))}
          </div>
        );
      }
    } else {
      if (selectedOption === 'recomandations') {
        return (
          <div>
            <h1>User Recommendations</h1>
            {/* Display user recommendations here */}
          </div>
        );
      } else if (selectedOption === 'applications') {
        return (
          <div>
            <h2>Applications</h2>
            <div className={`${styles.jobcarddiv}`}>
              {/* Display applied job cards here */}
              {appliedJobs.map((application) => (
                <ApplicationCard
                  key={application.id}
                  id={application.id}
                  appStatus={application.status}
                  img={application.details.img}
                  name={application.details.fullName}
                  userStatus={application.details.status}
                  contact={application.details.contact}
                  email={application.details.email}
                  skills={application.details.skills}
                  cv={application.details.cv}
                  portfolio={application.details.portfolio}
                  onViewApplication={() => alert(`View Application for ${application.company}`)}
                />
              ))}
            </div>
          </div>
        );
      } else if (selectedOption === 'createJob') {
        return (
          <div>
            <JobForm onSubmit={handleJobFormSubmit} setJobListings={setJobListings} />
          </div>
        );
      }
    }
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleJobFormSubmit = (jobData) => {
    console.log('Submitted Job Data:', jobData);
    setJobListings((prevListings) => [...prevListings, jobData]);
  };

  return (
    <div className={styles.main}>
      <div className={styles.dashboardprofile}>
        <div className={styles.dashboarduserimg}>
          <img src={userData.imageUrl} alt="User" />
        </div>
        <div className={styles.dashboarduserdetails}>
          <div>
            <h3 className={styles.name}>{userData.name}</h3>
            <Link href="/profile" passHref className={styles.editbtn}>
              Edit Profile
            </Link>
          </div>
          <p className={styles.userdesc}>{userData.description}</p>
          <div className={styles.userskills}>
            {userData.skills.map((skill, index) => (
              <p key={index}>{skill}</p>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.recommendations}>
        {renderOptionButtons()}
        <div>{renderContent()}</div>
      </div>
    </div>
  );
}

export default Dashboard;