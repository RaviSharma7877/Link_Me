import React, { useState, useContext, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { LoadingBarContext } from "../context/LoadingBarContext";
import Cookies from "js-cookie";


function Profile() {
  const { setProgress } = useContext(LoadingBarContext);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [img, setImg] = useState("");
  const [skills, setSkills] = useState([]);
  const [is_active, setIs_Active] = useState(true);
  const [is_admin, setIs_Admin] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [job_seeker, setIsJobSeeker] = useState('');
  const [contact_number, setContact] = useState('');

  useEffect(() => {
    setProgress(30);
    const fetchUserData = async () => {
      try {
        const userid = document.cookie.replace(
          /(?:(?:^|.*;\s*)userId\s*=\s*([^;]*).*$)|^.*$/,
          "$1"
        );

        const accessToken = document.cookie.replace(
          /(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,
          "$1"
        );

        const response = await fetch(`http://localhost:8080/users/${userid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setProgress(70);
        const data = await response.json();
        console.log(data)
        setUsername(data.user.username || "");
        setFullName(data.user.fullName || "");
        setDescription(data.user.description || "");
        setStatus(data.user.status || "");
        setEmail(data.user.email || "");
        setImg(data.user.img || "");
        setSkills(data.user.skills || []);
        setIs_Active(data.user.is_active || true);
        setIs_Admin(data.user.is_admin || false);
        setIsJobSeeker(data.user.job_seeker || '');
        setContact(data.user.contact_number || '');
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      
    };
    setProgress(100);
    fetchUserData();
  }, []); 

  const updateProfile = async () => {
    let js = job_seeker
    let obj = {
      username,
      fullName,
      description,
      img,
      skills,
      email,
      status,
      is_active,
      is_admin,
      job_seeker: js,
      contact_number,
    };
    Cookies.set('job_seeker', js)

    try {
      setProgress(30);

      const accessToken = document.cookie.replace(
        /(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      const userid = document.cookie.replace(
        /(?:(?:^|.*;\s*)userId\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      const response = await fetch(`http://localhost:8080/users/${userid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(obj),
      });
      setProgress(80);
      const data = await response.json();
      console.log(data);
      setProgress(100);
      alert("User updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() !== "") {
      setSkills((prevSkills) => [...prevSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  return (
    <div className={`${styles.profilemain}`}>
      <h1>User Profile</h1>
      <div className={`${styles.profile_container}`}>
        <div className={`${styles.image_container}`}>
          <img
            id="userImage"
            src={img}
            alt="User Image"
            className={`${styles.userImage}`}
          />
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="text"
            id="imageUrl"
            value={img}
            onChange={(e) => setImg(e.target.value)}
          />
          <div className={`${styles.select}`}>
            <select name="" id="" onChange={(e) => setIsJobSeeker(e.target.value)}>
              <option value="">Select Role</option>
              <option value="job_seeker">Job Seeker</option>
              <option value="job_creator">Job Creator</option>
            </select>
          </div>
        </div>

        <div className={`${styles.details_container}`}>
          <div>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="fullName">Full Name:</label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <label htmlFor="status">Experience Level:</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)} className={`${styles.experience}`}
            >
              <option value="intern">Intern</option>
              <option value="intermediate">Intermediate</option>
              <option value="experienced">Experienced</option>
            </select>

            <div>
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className={`${styles.skills}`}>
            <div>
              <label htmlFor="contact">Contact:</label>
              <input
                id="contact"
                value={contact_number}
                type="number"
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
            <label htmlFor="skills">Skills:</label>
            <input
              id="skills"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <button onClick={addSkill}>Add Skill</button>
            <ul>
              {skills.map((skill, index) => (
                <li key={index}>
                  {skill}
                  <button
                    onClick={() => removeSkill(index)}
                    className={`${styles.removeskills}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <button onClick={updateProfile} className={`${styles.updateprofile}`}>
        Update Profile
      </button>
    </div>
  );
}

export default Profile;
