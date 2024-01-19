import { useEffect, useState } from 'react';
import { TbInfoTriangle } from 'react-icons/tb';

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
    props.setShowAlert(false);
  };

  const confirm = () => {
    setOpacity('opacity-0');
    props.confirm();
  };

  return (
    <>
      <div className='fixed top-0 left-0 w-full h-full z-10 bg-[rgba(0,0,0,0.72)]'></div>
      <div
        className={`absolute top-1/3 left-0 right-0 mx-auto rounded-md bg-white p-3 shadow-sm z-20 text-black transition duration-200 ease-in ${opacity} w-4/5 sm:w-1/2 lg:w-1/3 flex flex-col items-center`}
      >
        <TbInfoTriangle size={40} />
        <h6 className='mt-2'>{props.message}</h6>
        <div className='mt-3'>
          <button onClick={confirm} className='btn btn-danger'>
            Delete
          </button>
          <button onClick={cancel} className='btn btn-secondary ml-4'>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default Alert;
