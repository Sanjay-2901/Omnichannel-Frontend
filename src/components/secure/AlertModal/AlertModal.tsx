import { useEffect, useState } from 'react';

interface AlertProps {
  message: string;
  confirm: () => void;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

const Alert = (props: AlertProps) => {
  const [opacity, setOpacity] = useState('opacity-0');

  useEffect(() => {
    setOpacity('opacity-100');
  }, []);

  const cancel = () => {
    setOpacity('opacity-0');
    setTimeout(() => {
      props.setShowAlert(false);
    }, 200);
  };

  const confirm = () => {
    setOpacity('opacity-0');
    setTimeout(() => {
      props.confirm();
    }, 200);
  };

  return (
    <>
      <div className='fixed top-0 left-0 w-full h-full z-10 bg-[rgba(0,0,0,0.72)]'></div>
      <div
        className={`absolute top-1/3 left-0 right-0 mx-auto rounded-md bg-white p-3 shadow-sm z-20 text-black transition duration-200 ${opacity} w-4/5 sm:w-1/2 lg:w-1/3`}
      >
        <div>{props.message}</div>
        <div className='mt-3'>
          <button onClick={confirm} className='btn btn-danger'>
            Delete
          </button>
          <button onClick={cancel} className='btn btn-secondary ml-3'>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default Alert;
