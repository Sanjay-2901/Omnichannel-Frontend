import { memo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { httpRequest } from '../../../utils/axios-utils';

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

  const { errors } = methods.formState;

  const submitClickHandler: SubmitHandler<LoginFormData> = (
    data: LoginFormData
  ) => {
    console.log(data);
    httpRequest({ url: 'auth/sign_in', method: 'post', data: data });
  };

  return (
    <>
      <div className='card w-50 p-3 shadow-lg position-absolute top-50 start-50 translate-middle'>
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
          <button type='submit' className='btn btn-primary mt-3'>
            Sign in
          </button>
        </form>
      </div>
    </>
  );
};

export default memo(Login);
