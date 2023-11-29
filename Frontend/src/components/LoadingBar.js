// components/LoadingBar.js
import { useEffect, useContext } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { LoadingBarContext } from '../context/LoadingBarContext';

const CustomLoadingBar = () => {
  const { progress, setProgress } = useContext(LoadingBarContext);

  useEffect(() => {
    return () => {
      // Reset the progress when the component unmounts
      setProgress(0);
    };
  }, [setProgress]);

  return (
    <LoadingBar
      color="#f11946"
      progress={progress}
      waitingTime={400}
      onLoaderFinished={() => setProgress(0)}
    />
  );
};

export default CustomLoadingBar;
