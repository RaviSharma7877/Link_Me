import React, { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";

const JobDetailsModal = ({ jobId, loggedInUserId, onClose }) => {
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [loadingApply, setLoadingApply] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/get_job_posting/${jobId}`
        );
        const data = await response.json();

        const sampleJobDetails = {
          job_title: data.job_title || "Software Developer",
          company: data.company || "Tech Co.",
          experience: data.experience || "5+ years",
          description:
            data.job_description || "This is a detailed job description...",
          creator_id: data.user_id,
          status: data.status || "open", // Retrieve job status
        };

        setJobDetails(sampleJobDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userid = document.cookie.replace(
        /(?:(?:^|.*;\s*)userId\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      try {
        const response = await fetch(`http://localhost:8080/users/${userid}`);
        const data = await response.json();
        setUserDetails(data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (showApplyForm && !userDetails) {
      fetchUserDetails();
    }
  }, [loggedInUserId, showApplyForm, userDetails]);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (userDetails) {
        try {
          const response = await fetch(
            `http://localhost:8080/applications/${jobId}`
          );
          const data = await response.json();
          setHasApplied(data.applied);
        } catch (error) {
          console.error("Error checking application status:", error);
        }
      }
    };

    if (showApplyForm && !hasApplied) {
      checkApplicationStatus();
    }
  }, [jobId, loggedInUserId, showApplyForm, userDetails, hasApplied]);

  const isUserJobCreator =
    jobDetails && loggedInUserId === jobDetails.creator_id;

  const handleApply = async () => {
    // Check if the job status is 'close'
    if (jobDetails.status === 'close') {
      console.log("This job posting is no longer accepting applications.");
      return;
    }

    // Check if the user has already applied
    if (hasApplied) {
      // You can display a message or handle this case as needed
      console.log("You have already applied for this job.");
      return;
    }

    // Set loadingApply to true to indicate that the application process is in progress
    setLoadingApply(true);

    try {
      // Fetch job details
      const responseJobDetails = await fetch(
        `http://localhost:8080/get_job_posting/${jobId}`
      );
      const dataJobDetails = await responseJobDetails.json();

      const sampleJobDetails = {
        job_title: dataJobDetails.job_title || "Software Developer",
        company: dataJobDetails.company || "Tech Co.",
        experience: dataJobDetails.experience || "5+ years",
        description:
          dataJobDetails.job_description ||
          "This is a detailed job description...",
        creator_id: dataJobDetails.user_id,
      };

      setJobDetails(sampleJobDetails);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      // Set loadingApply back to false regardless of success or failure
      setLoadingApply(false);
    }

    // Display the application form if the user has not applied
    setShowApplyForm(true);
  };

  const handleSubmitApplication = async (formData) => {
    const excludedKeys = ['username', 'password', 'is_active', 'is_admin'];
    const filteredFormData = Object.fromEntries(
      Object.entries(formData).filter(([key]) => !excludedKeys.includes(key))
    );
    let obj = {
      job_seeker_id: jobId,
      job_posting_id: loggedInUserId,
      status: "Pending",
      details: filteredFormData,
    };

    try {
      // Make a POST request to submit the application
      const response = await fetch(
        `http://localhost:8080/apply/${jobId}/${loggedInUserId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(obj),
        }
      );
      console.log(obj);
      // Check the response status
      if (response.ok) {
        console.log('Application submitted successfully.');
        // Additional logic or state updates after successful submission
      } else {
        console.error('Failed to submit application.');
        // Handle the error or show an error message
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      // Handle the error or show an error message
    } finally {
      // Close the form and perform any other necessary actions
      setShowApplyForm(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`${styles.job_details_modal}`}>
      <div className={`${styles.modal_content}`}>
        <h2 className={`${styles.h2}`}>
          <strong>Job Title:</strong>
          {jobDetails.job_title}
        </h2>
        <p>
          <strong>Company:</strong> {jobDetails.company}
        </p>
        <p>
          <strong>Experience Needed:</strong> {jobDetails.experience}+ years
        </p>
        <p>
          <strong>Description:</strong> {jobDetails.description}
        </p>

        {(!showApplyForm && !hasApplied && jobDetails.status === 'open') && (
          <button
            className={`${styles.button} ${styles.apply}`}
            onClick={handleApply}
            disabled={isUserJobCreator || loadingApply}
          >
            {loadingApply
              ? "Loading..."
              : isUserJobCreator
              ? "You cannot apply to your own job"
              : "Apply"}
          </button>
        )}

        {jobDetails.status === 'close' && (
          <div>
            <p>This job posting is no longer accepting applications.</p>
            {/* Additional information or actions for closed jobs */}
          </div>
        )}

        {hasApplied && (
          <div>
            <p>You have already applied for this job.</p>
            {/* Additional information or actions for users who have already applied */}
          </div>
        )}

        <button
          className={`${styles.button} ${styles.close}`}
          onClick={onClose}
        >
          Close
        </button>

        {showApplyForm && userDetails && !hasApplied && (
          <div className={`${styles.apply_form}`}>
            <h3>Application Form</h3>
            {/* Autofill user details in the form */}
            <form
              className={`${styles.hiddenform}`}
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const formDataObject = {};
                formData.forEach((value, key) => {
                  formDataObject[key] = value;
                });

                // Merge user details with form data
                const applicationData = { ...userDetails, ...formDataObject };

                handleSubmitApplication(applicationData);
              }}
            >
              <label>
                Name:
                <input
                  type="text"
                  name="fullName"
                  defaultValue={userDetails.fullName}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  defaultValue={userDetails.email}
                  required
                />
              </label>
              <label>
                Contact:
                <input
                  type="number"
                  name="contact"
                  required
                  defaultValue={userDetails.contact_number}
                />
              </label>
              <label>
                Resume:-
                <input type="file" name="resume" accept=".pdf" required />
              </label>
              <label>
                Portfolio:-
                <input type="url" name="portfolio" />
              </label>
              {/* Add more fields as needed */}
              <button type="submit">Submit Application</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailsModal;
