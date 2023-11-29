/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState ,useContext  } from 'react';
import styles from "../styles/Home.module.css"
import Image from 'next/image';
import register from '../images/register.svg'
import log from '../images/log.svg'
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { LoadingBarContext } from '../context/LoadingBarContext';


function login() {
  const { setProgress } = useContext(LoadingBarContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [is_active, setIsActive] = useState(true);
  const [is_admin, setIsAdmin] = useState(false);
  const [job_seeker, setIsJobSeeker] = useState('');

  const [logpassword, setLogPassword] = useState('');
  const [logusername, setLogUsername] = useState('');
  

  const handleSignUp = async (e) => {
    e.preventDefault();
    let js = job_seeker
    console.log(js)
    console.log(job_seeker)
    let obj = {
      email: email,
      password: password,
      username: username,
      fullName: fullName,
      is_active,
      is_admin,
      job_seeker: js,
    };
      Cookies.set('job_seeker', js)
    try {
      setProgress(30);

      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      });
      setProgress(60);
      const data = await response.json();

      if (response.ok) {
        Cookies.set('login', 'no');
        router.reload(); // Reload the window after successful registration
      }

      console.log(data);
      setProgress(100);
    } catch (error) {
      console.error('Error during registration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    let obj = {
      username: logusername,
      password: logpassword,
    };

    try {
      setProgress(30);

      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      });
      setProgress(60);
      const data = await response.json();
      
      if (response.ok) {
        const token = data.access_token;
        const expiresIn = data.expires_in;
        const userId = data.id

        Cookies.set('userId', userId);
        Cookies.set('login', 'yes');
        Cookies.set('access_token', token, { expires: expiresIn / (24 * 60 * 60) });

        router.push('/dashboard');
        
        setTimeout(() => {
          Cookies.set('login', 'no');
          Cookies.remove('access_token');
        }, expiresIn * 1000);
        
      }

      console.log(data);
      setProgress(100);
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setIsLoading(false);
      
    }
  };



  useEffect(() => {
    console.log('isLoading:', isLoading);
    const sign_in_btn = document.querySelector("#sign_in_btn");
    const sign_up_btn = document.querySelector("#sign_up_btn");
    const container = document.querySelector('#container');

    sign_up_btn.addEventListener("click", () => {
      container.classList.add(`${styles.sign_up_mode}`);
    });

    sign_in_btn.addEventListener("click", () => {
      container.classList.remove(`${styles.sign_up_mode}`);
    });
  }, [isLoading]);
  return (
    <>
    
    <div className={`${styles.container}`} id='container'>
      <div className={`${styles.forms_container}`}>
        <div className={`${styles.signin_signup}`}>
          <form action="#" className={`${styles.sign_in_} ${styles.form}`} onSubmit={handleSignIn}>
            <h2 className={`${styles.title}`}>Sign in</h2>
            <div className={`${styles.input_field}`}>
              <i className="fas fa-lock"></i>
              <input type="text" id="username" placeholder="Username" value={logusername} onChange={(e) => setLogUsername(e.target.value)} />
            </div>
            <div className={`${styles.input_field}`}>
              <i className="fas fa-lock"></i>
              <input type="password" id="pass" placeholder="Password" value={logpassword} onChange={(e) => setLogPassword(e.target.value)} />
            </div>
            
            <input type="submit" value="Login" className={`${styles.btn} ${styles.solid}`} />
            <p className={`${styles.social_text}`}>Or Sign in with social platforms</p>
            <div className={`${styles.social_media}`}>
              <a href="#" className={`${styles.social_icon}`}>
                <i className="fa fa-facebook"></i>
              </a>
              <a href="#" className={`${styles.social_icon}`}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className={`${styles.social_icon}`}>
                <i className="fab fa-google"></i>
              </a>
              <a href="#" className={`${styles.social_icon}`}>
                <i className="fa fa-linkedin"></i>
              </a>
            </div>
          </form>
          <form action="#" className={`${styles.sign_up_} ${styles.form}`} onSubmit={handleSignUp}>
            <h2 className={`${styles.title}`}>Sign up</h2>
            
            <div className={`${styles.input_field}`}>
              <i className="fas fa-lock"></i>
              <input type="text" id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className={`${styles.input_field}`}>
              <i className="fas fa-lock"></i>
              <input type="password" id="pass" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            
            
            <div className={`${styles.input_field}`}>
              <i className="fas fa-lock"></i>
              <input type="text" id="name" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className={`${styles.input_field}`}>
              <i className="fas fa-envelope"></i>
              <input type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className={`${styles.select}`}>
        <select name="" id="" onChange={(e) => setIsJobSeeker(e.target.value)}>
          <option value="">Select Role</option>
          <option value="job_seeker">Job Seeker</option>
          <option value="job_creator">Job Creator</option>
        </select>
      </div>
            
            
            <input type="submit" className={`${styles.btn}`} value="Sign up" />
            <p className={`${styles.social_text}`}>Or Sign up with social platforms</p>
            <div className={`${styles.social_media}`}>
              <a href="#" className={`${styles.social_icon}`}>
                <i className="fa fa-facebook"></i>
              </a>
              <a href="#" className={`${styles.social_icon}`}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className={`${styles.social_icon}`}>
                <i className="fab fa-google"></i>
              </a>
              <a href="#" className={`${styles.social_icon}`}>
                <i className="fa fa-linkedin"></i>
              </a>
            </div>
          </form>
        </div>
      </div>

      <div className={`${styles.panels_container}`}>
        <div className={`${styles.panel} ${styles.left_panel}`}>
          <div className={`${styles.content}`}>
            <h3>New here ?</h3>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis,
              ex ratione. Aliquid!
            </p>
            <button className={`${styles.btn} ${styles.transparent}`} id="sign_up_btn">
              Sign up
            </button>
          </div>
          <Image src={log} className={`${styles.image}`} alt="" />
        </div>
        <div className={`${styles.panel} ${styles.right_panel}`}>
          <div className={`${styles.content}`}>
            <h3>One of us ?</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
              laboriosam ad deleniti.
            </p>
            <button className={`${styles.btn} ${styles.transparent}`} id="sign_in_btn">
              Sign in
            </button>
          </div>
          <Image src={register} className={styles.image} alt="" />
        </div>
      </div>
    </div>
    </>
  )
}

export default login