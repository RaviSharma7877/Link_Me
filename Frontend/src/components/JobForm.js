// components/JobForm.js
import { LoadingBarContext } from "../context/LoadingBarContext";
import React, { useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";

const JobForm = ({ onSubmit, setJobListings }) => {
  const { setProgress } = useContext(LoadingBarContext);
  const userid = document.cookie.replace(
    /(?:(?:^|.*;\s*)userId\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  const storedImageUrl = Cookies.get("img");
  console.log(storedImageUrl);
  const [jobData, setJobData] = useState({
    img: "",
    job_title: "",
    status: "",
    start_date: "",
    end_date: "",
    hiring_manager: "",
    skill_sets: [],
    job_description: "",
    company: "",
    user_id: userid,
    jobimg: storedImageUrl,
    experience: "",
    is_bookmarked: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleskill_setsChange = (e) => {
    const { value } = e.target;
    setJobData((prevData) => ({ ...prevData, skill_sets: value.split(",") }));
  };

  const handleSubmit = async (e) => {
    setProgress(30);
    e.preventDefault();
    console.log(jobData);
    try {
      const response = await fetch("http://localhost:8080/create_job_posting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to create job");
      }

      // Assuming onSubmit is a callback prop to handle the created job data
      onSubmit(jobData);
      setJobListings((prevListings) => [...prevListings, jobData]);
      setProgress(100);
    } catch (error) {
      console.error("Error creating job:", error.message);
      // Handle error, show a message, or perform other actions
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "600px",
        margin: "auto",
        padding: "20px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ marginBottom: "15px" }}>
        <label>
          Image url:
          <input
            type="url"
            name="img"
            value={jobData.img}
            onChange={handleInputChange}
            style={{
              width: "100%",
              borderBottom: "1px solid black",
              paddingLeft: "10px",
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label>
          Job Title:
          <input
            type="text"
            name="job_title"
            value={jobData.job_title}
            onChange={handleInputChange}
            style={{
              width: "100%",
              borderBottom: "1px solid black",
              paddingLeft: "10px",
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label>
          Company Name:
          <input
            type="text"
            name="company"
            value={jobData.company}
            onChange={handleInputChange}
            style={{
              width: "100%",
              borderBottom: "1px solid black",
              paddingLeft: "10px",
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label>
          status:
          <input
            type="text"
            name="status"
            value={jobData.status}
            onChange={handleInputChange}
            style={{
              width: "100%",
              borderBottom: "1px solid black",
              paddingLeft: "10px",
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label>
          Start Date:
          <input
            type="date"
            name="start_date"
            value={jobData.start_date}
            onChange={handleInputChange}
            style={{
              width: "100%",
              borderBottom: "1px solid black",
              paddingLeft: "10px",
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label>
          End Date:
          <input
            type="date"
            name="end_date"
            value={jobData.end_date}
            onChange={handleInputChange}
            style={{
              width: "100%",
              borderBottom: "1px solid black",
              paddingLeft: "10px",
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label>
          Experiance Needed:
          <input
            type="number"
            name="experience"
            value={jobData.experience}
            onChange={handleInputChange}
            style={{
              width: "100%",
              borderBottom: "1px solid black",
              paddingLeft: "10px",
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label>
          Hiring Manager:
          <input
            type="text"
            name="hiring_manager"
            value={jobData.hiring_manager}
            onChange={handleInputChange}
            style={{
              width: "100%",
              borderBottom: "1px solid black",
              paddingLeft: "10px",
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label>
          Skill Sets (comma-separated):
          <input
            type="text"
            name="skill_sets"
            value={jobData.skill_sets.join(",")}
            onChange={handleskill_setsChange}
            style={{
              width: "100%",
              borderBottom: "1px solid black",
              paddingLeft: "10px",
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label>
          Job Description:
          <textarea
            name="job_description"
            value={jobData.job_description}
            onChange={handleInputChange}
            style={{
              width: "100%",
              border: "1px solid black",
              paddingLeft: "10px",
            }}
          />
        </label>
      </div>
      <div>
        <button
          type="submit"
          style={{
            background: "#4CAF50",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Create Job
        </button>
      </div>
    </form>
  );
};

export default JobForm;
