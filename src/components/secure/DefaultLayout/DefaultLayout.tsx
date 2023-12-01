import { ChildrenComponentProps } from '../../../shared/models/shared.model';
import Sidebar from '../Sidebar/Sidebar';

const DefaultLayout = ({ children }: ChildrenComponentProps) => {
  return (
    <>
      <div className='main-container p-0'>
        <Sidebar />
        <main>{children}</main>
      </div>
    </>
  );
};

export default DefaultLayout;
