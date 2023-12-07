import { memo, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { httpRequest } from '../../../utils/axios-utils';
import { useAuthContext } from '../../../utils/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

type LoginFormData = {
  email: string;
  password: string;
};

const Login = () => {
  const methods = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const authContext = useAuthContext();
  const navigate = useNavigate();

  const { errors } = methods.formState;

  const submitClickHandler: SubmitHandler<LoginFormData> = (
    loginFormData: LoginFormData
  ) => {
    setIsLoading(true);
    httpRequest({
      url: 'auth/sign_in',
      method: 'post',
      data: loginFormData,
    })
      .then((response) => {
        authContext?.setLoggedInUser(response);
        setIsLoading(false);
        navigate('/dashboard');
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  return (
    <>
      <div className='d-flex justify-content-center align-items-center vh-100'>
        <div className='card w-50 p-3 shadow-lg'>
          <h3 className='text-center mb-3'>Sign In</h3>
          <form
            noValidate
            className='px-3'
            onSubmit={methods.handleSubmit(submitClickHandler)}
          >
            <div className='form-group'>
              <label htmlFor='email'>Email address</label>
              <input
                {...methods.register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
                type='email'
                className='form-control mt-1'
                id='email'
                placeholder='Enter your email'
              />
              {!errors.email ? (
                <small id='emailHelp' className='form-text text-muted'>
                  We'll never share your email with anyone else.
                </small>
              ) : (
                <small className='text-danger'>{errors.email?.message}</small>
              )}
            </div>
            <div className='form-group mt-3'>
              <label htmlFor='password'>Password</label>
              <input
                {...methods.register('password', {
                  required: 'Password is required',
                })}
                type='password'
                className='form-control mt-1'
                id='password'
                placeholder='Enter your password'
              />
              <small className='text-danger'>{errors.password?.message}</small>
            </div>
            <button
              type='submit'
              className='btn btn-primary mt-4 d-flex align-items-center'
              disabled={isLoading}
            >
              {isLoading ? 'Signing in' : 'Sign in'}
              {isLoading && (
                <span className='ms-2'>
                  <div
                    className='spinner-border spinner-border-sm'
                    role='status'
                  ></div>
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default memo(Login);
